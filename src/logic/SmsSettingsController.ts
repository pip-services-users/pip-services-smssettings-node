let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { DependencyResolver } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { BadRequestException } from 'pip-services-commons-node';
import { ConfigException } from 'pip-services-commons-node';
import { NotFoundException } from 'pip-services-commons-node';
import { IOpenable } from 'pip-services-commons-node';
import { IdGenerator } from 'pip-services-commons-node';
import { CompositeLogger } from 'pip-services-commons-node';

import { PartyActivityV1 } from 'pip-clients-activities-node';
import { IActivitiesClientV1 } from 'pip-clients-activities-node';
import { MessageTemplatesResolverV1 } from 'pip-clients-msgtemplates-node';
import { SmsMessageV1 } from 'pip-clients-sms-node';
import { SmsRecipientV1 } from 'pip-clients-sms-node';
import { ISmsClientV1 } from 'pip-clients-sms-node';

import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';
import { SmsSettingsActivityTypeV1 } from '../data/version1/SmsSettingsActivityTypeV1';
import { ISmsSettingsPersistence } from '../persistence/ISmsSettingsPersistence';
import { ISmsSettingsController } from './ISmsSettingsController';
import { SmsSettingsCommandSet } from './SmsSettingsCommandSet';

export class SmsSettingsController implements IConfigurable, IReferenceable, ICommandable, ISmsSettingsController {
    private static _phoneRegex = /^\+[0-9]{10,15}$/;
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-smssettings:persistence:*:*:1.0',
        'dependencies.activities', 'pip-services-activities:client:*:*:1.0',
        'dependencies.msgtemplates', 'pip-services-msgtemplates:client:*:*:1.0',
        'dependencies.smsdelivery', 'pip-services-sms:client:*:*:1.0',
        
        'message_templates.verify_phone.subject', 'Verify phone number',
        'message_templates.verify_phone.text', 'Verification code for {{phone}} is {{ code }}.',

        'options.magic_code', null,
        'options.signature_length', 100,
        'options.verify_on_create', true,
        'options.verify_on_update', true
    );

    private _verifyOnCreate: boolean = true;
    private _verifyOnUpdate: boolean = true;
    private _expireTimeout: number = 24 * 60; // in minutes
    private _magicCode: string = null;
    private _config: ConfigParams = new ConfigParams();

    private _dependencyResolver: DependencyResolver = new DependencyResolver(SmsSettingsController._defaultConfig);
    private _templatesResolver: MessageTemplatesResolverV1 = new MessageTemplatesResolverV1();
    private _logger: CompositeLogger = new CompositeLogger();
    private _activitiesClient: IActivitiesClientV1;
    private _smsClient: ISmsClientV1;
    private _persistence: ISmsSettingsPersistence;
    private _commandSet: SmsSettingsCommandSet;

    public configure(config: ConfigParams): void {
        config = config.setDefaults(SmsSettingsController._defaultConfig);

        this._dependencyResolver.configure(config);
        this._templatesResolver.configure(config);
        this._logger.configure(config);

        this._verifyOnCreate = config.getAsBooleanWithDefault('options.verify_on_create', this._verifyOnCreate);
        this._verifyOnUpdate = config.getAsBooleanWithDefault('options.verify_on_update', this._verifyOnUpdate);
        this._expireTimeout = config.getAsIntegerWithDefault('options.verify_expire_timeout', this._expireTimeout);
        this._magicCode = config.getAsStringWithDefault('options.magic_code', this._magicCode);
        
        this._config = config;
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._templatesResolver.setReferences(references);
        this._logger.setReferences(references);

        this._persistence = this._dependencyResolver.getOneRequired<ISmsSettingsPersistence>('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional<IActivitiesClientV1>('activities');
        this._smsClient = this._dependencyResolver.getOneOptional<ISmsClientV1>('smsdelivery');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new SmsSettingsCommandSet(this);
        return this._commandSet;
    }
    
    private settingsToPublic(settings: SmsSettingsV1): SmsSettingsV1 {
        if (settings == null) return null;
        delete settings.ver_code;
        delete settings.ver_expire_time;
        return settings;
    }
    
    public getSettingsByIds(correlationId: string, recipientIds: string[],
        callback: (err: any, settings: SmsSettingsV1[]) => void): void {
        this._persistence.getListByIds(correlationId, recipientIds, (err, settings) => {

            if (settings)
                settings = _.map(settings, s => this.settingsToPublic(s));

            callback(err, settings);
        });
    }
    
    public getSettingsById(correlationId: string, recipientId: string,
        callback: (err: any, settings: SmsSettingsV1) => void): void {
        this._persistence.getOneById(correlationId, recipientId, (err, settings) => {
            settings = this.settingsToPublic(settings);
            callback(err, settings);
        });
    }

    public getSettingsByPhoneSettings(correlationId: string, phone: string,
        callback: (err: any, settings: SmsSettingsV1) => void): void {
        this._persistence.getOneByPhoneSettings(correlationId, phone, (err, settings) => {
            callback(err, this.settingsToPublic(settings));
        });
    }

    private verifyAndSaveSettings(correlationId: string,
        oldSettings: SmsSettingsV1, newSettings: SmsSettingsV1,
        callback: (err: any, settings: SmsSettingsV1) => void): void {

        let verify = false;

        async.series([
            // Check if verification is needed
            (callback) => {
                verify = (oldSettings == null && this._verifyOnCreate)
                    || (oldSettings.phone != newSettings.phone && this._verifyOnUpdate);
                if (verify) {
                    newSettings.verified = false;
                    newSettings.ver_code = IdGenerator.nextShort();
                    newSettings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);
                }
                callback();
            },
            // Set new settings
            (callback) => {
                this._persistence.set(correlationId, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                })
            },
            // Send verification if needed
            (callback) => {
                // Send verification message and do not wait
                if (verify)
                    this.sendVerificationMessage(correlationId, newSettings);
                callback();
            }
        ], (err) => {
            callback(err, newSettings);
        });
    }

    private sendVerificationMessage(correlationId: string, newSettings: SmsSettingsV1): void {
        this._templatesResolver.resolve('verify_phone', (err, template) => {
            if (err == null && template == null) {
                err = new ConfigException(
                    correlationId, 
                    'MISSING_VERIFY_PHONE',
                    'Message template "verify_phone" is missing'
                );
            }

            if (err) {
                this._logger.error(correlationId, err, 'Cannot find verify_phone message template');
                return;
            }

            let message = <SmsMessageV1> {
                subject: template.subject,
                text: template.text,
                html: template.html
            };

            let recipient = <SmsRecipientV1> {
                id: newSettings.id,
                name: newSettings.name,
                phone: newSettings.phone,
                language: newSettings.language
            };

            let parameters = ConfigParams.fromTuples(
                'code', newSettings.ver_code
            );

            if (this._smsClient) {
                this._smsClient.sendMessageToRecipient(correlationId, recipient, message, parameters, (err) => {
                    if (err)
                        this._logger.error(correlationId, err, 'Failed to send phone verification message');
                });
            }
        });
    }
    
    public setSettings(correlationId: string, settings: SmsSettingsV1,
        callback: (err: any, settings: SmsSettingsV1) => void): void {
        if (settings.id == null) {
            callback(new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'), null);
            return;
        }
        if (settings.phone == null) {
            callback(new BadRequestException(correlationId, 'NO_PHONE', 'Missing phone'), null);
            return;
        }
        if (!SmsSettingsController._phoneRegex.test(settings.phone)) {
            callback(
                new BadRequestException(
                    correlationId, 
                    'WRONG_PHONE', 
                    'Invalid phone ' + settings.phone
                ).withDetails('phone', settings.phone),
                null
            );
            return;
        }
    
        let newSettings: SmsSettingsV1 = _.clone(settings);
        newSettings.verified = false;
        newSettings.ver_code = null;
        newSettings.ver_expire_time = null;
        newSettings.subscriptions = newSettings.subscriptions || {};

        let oldSettings: SmsSettingsV1;

        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(
                    correlationId,
                    newSettings.id,
                    (err, data) => {
                        if (data != null) {
                            oldSettings = data;

                            // Override
                            newSettings.verified = data.verified;
                            newSettings.ver_code = data.ver_code;
                            newSettings.ver_expire_time = data.ver_expire_time;
                        }
                        callback(err);
                    }
                );
            },
            // Verify and save settings
            (callback) => {
                this.verifyAndSaveSettings(correlationId, oldSettings, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                })
            },
        ], (err) => {
            if (callback) callback(err, newSettings);
        });
    }


    public setRecipient(correlationId: string, recipientId: string,
        name: string, phone: string, language: string,
        callback?: (err: any, settings: SmsSettingsV1) => void): void {

        if (recipientId == null) {
            callback(new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'), null);
            return;
        }
        if (phone != null && !SmsSettingsController._phoneRegex.test(phone)) {
            callback(
                new BadRequestException(
                    correlationId, 
                    'WRONG_PHONE', 
                    'Invalid phone ' + phone
                ).withDetails('phone', phone),
                null
            );
            return;
        }
    
        let oldSettings: SmsSettingsV1;
        let newSettings: SmsSettingsV1;

        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(
                    correlationId,
                    recipientId,
                    (err, data) => {
                        if (err) {
                            callback(err);
                            return;
                        }

                        if (data != null) {
                            // Copy and modify existing settings
                            oldSettings = data;
                            newSettings = _.clone(data);
                            newSettings.name = name || data.name;
                            newSettings.phone = phone || data.phone;
                            newSettings.language = language || data.language;
                        } else {
                            // Create new settings if they are not exist
                            oldSettings = null;
                            newSettings = <SmsSettingsV1> {
                                id: recipientId,
                                name: name,
                                phone: phone,
                                language: language
                            };
                        }

                        callback();
                    }
                );
            },
            // Verify and save settings
            (callback) => {
                this.verifyAndSaveSettings(correlationId, oldSettings, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                })
            },
        ], (err) => {
            if (callback) callback(err, newSettings);
        });
    }

    public setSubscriptions(correlationId: string, recipientId: string, subscriptions: any,
        callback?: (err: any, settings: SmsSettingsV1) => void): void {

        if (recipientId == null) {
            callback(new BadRequestException(correlationId, 'NO_ID', 'Missing id'), null);
            return;
        }
    
        let oldSettings: SmsSettingsV1;
        let newSettings: SmsSettingsV1;

        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(
                    correlationId,
                    recipientId,
                    (err, data) => {
                        if (err) {
                            callback(err);
                            return;
                        }

                        if (data != null) {
                            // Copy and modify existing settings
                            oldSettings = data;
                            newSettings = _.clone(data);
                            newSettings.subscriptions = subscriptions || data.subscriptions;
                        } else {
                            // Create new settings if they are not exist
                            oldSettings = null;
                            newSettings = <SmsSettingsV1> {
                                id: recipientId,
                                name: null,
                                phone: null,
                                language: null,
                                subscriptions: subscriptions
                            };
                        }

                        callback();
                    }
                );
            },
            // Verify and save settings
            (callback) => {
                this.verifyAndSaveSettings(correlationId, oldSettings, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                })
            },
        ], (err) => {
            if (callback) callback(err, newSettings);
        });
    }

    public deleteSettingsById(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void {
        this._persistence.deleteById(correlationId, recipientId, (err, settings) => {
            if (callback) callback(err);
        });
    }

    public resendVerification(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void {

        if (recipientId == null) {
            callback(new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'));
            return;
        }
    
        let settings: SmsSettingsV1;

        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(correlationId, recipientId, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId, 
                            'RECIPIENT_NOT_FOUND', 
                            'Recipient ' + recipientId + ' was not found'
                        )
                        .withDetails('recipient_id', recipientId);
                    }
                    settings = data;
                    callback(err); 
                });
            },
            // Check if verification is needed
            (callback) => {
                settings.verified = false;
                settings.ver_code = IdGenerator.nextShort();
                settings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);

                callback();
            },
            // Set new settings
            (callback) => {
                this._persistence.set(correlationId, settings, (err, data) => {
                    settings = data;
                    callback(err);
                })
            },
            // Send verification
            (callback) => {
                // Send verification message and do not wait
                this.sendVerificationMessage(correlationId, settings);
                callback();
            }
        ], (err) => {
            if (callback) callback(err);
        });
    }

    private logActivity(correlationId: string, settings: SmsSettingsV1, activityType: string) {
        if (this._activitiesClient) {
            this._activitiesClient.logPartyActivity(
                correlationId,
                new PartyActivityV1(
                    null,
                    activityType,
                    {
                        id: settings.id,
                        type: 'account',
                        name: settings.name
                    }
                ),
                (err, activity) => {
                    if (err)
                       this._logger.error(correlationId, err, 'Failed to log user activity');
                }
            );
        }
    }
    
    public verifyPhone(correlationId: string, recipientId: string, code: string,
        callback?: (err: any) => void): void {
        let settings: SmsSettingsV1;

        async.series([
            // Read settings
            (callback) => {
                this._persistence.getOneById(
                    correlationId,
                    recipientId, 
                    (err, data) => {
                        settings = data;

                        if (settings == null && err == null) {
                            err = new NotFoundException(
                                correlationId,
                                'RECIPIENT_NOT_FOUND',
                                'Recipient ' + recipientId + ' was not found'
                            )
                            .withDetails('recipient_id', recipientId);
                        }

                        callback(err);
                    }
                );
            },
            // Check and update verification code
            (callback) => {
                let verified = settings.ver_code == code;
                verified = verified || (this._magicCode != null && code == this._magicCode);
                verified = verified && new Date().getTime() < settings.ver_expire_time.getTime();

                if (!verified) {
                    callback(
                        new BadRequestException(
                            correlationId,
                            'INVALID_CODE',
                            'Invalid sms verification code ' + code
                        )
                        .withDetails('recipient_id', recipientId)
                        .withDetails('code', code)
                    );
                    return;
                }

                settings.verified = true;
                settings.ver_code = null;
                settings.ver_expire_time = null;

                callback();
            },
            // Save user
            (callback) => {
                this._persistence.set(
                    correlationId,
                    settings,
                    callback
                );
            },
            // Asynchronous post-processing
            (callback) => {
                this.logActivity(
                    correlationId,
                    settings,
                    SmsSettingsActivityTypeV1.PhoneVerified
                );

                callback();
            }
        ], (err) => {
            if (callback) callback(err);
        });
    }

}
