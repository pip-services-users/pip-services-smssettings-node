"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_commons_node_6 = require("pip-services-commons-node");
const pip_services_commons_node_7 = require("pip-services-commons-node");
const pip_clients_activities_node_1 = require("pip-clients-activities-node");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
const SmsSettingsActivityTypeV1_1 = require("../data/version1/SmsSettingsActivityTypeV1");
const SmsSettingsCommandSet_1 = require("./SmsSettingsCommandSet");
class SmsSettingsController {
    constructor() {
        this._verifyOnCreate = true;
        this._verifyOnUpdate = true;
        this._expireTimeout = 24 * 60; // in minutes
        this._magicCode = null;
        this._config = new pip_services_commons_node_1.ConfigParams();
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver(SmsSettingsController._defaultConfig);
        this._templatesResolver = new pip_clients_msgtemplates_node_1.MessageTemplatesResolverV1();
        this._logger = new pip_services_commons_node_7.CompositeLogger();
    }
    configure(config) {
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
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._templatesResolver.setReferences(references);
        this._logger.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional('activities');
        this._smsClient = this._dependencyResolver.getOneOptional('smsdelivery');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new SmsSettingsCommandSet_1.SmsSettingsCommandSet(this);
        return this._commandSet;
    }
    settingsToPublic(settings) {
        if (settings == null)
            return null;
        delete settings.ver_code;
        delete settings.ver_expire_time;
        return settings;
    }
    getSettingsByIds(correlationId, recipientIds, callback) {
        this._persistence.getListByIds(correlationId, recipientIds, (err, settings) => {
            if (settings)
                settings = _.map(settings, s => this.settingsToPublic(s));
            callback(err, settings);
        });
    }
    getSettingsById(correlationId, recipientId, callback) {
        this._persistence.getOneById(correlationId, recipientId, (err, settings) => {
            settings = this.settingsToPublic(settings);
            callback(err, settings);
        });
    }
    getSettingsByPhoneSettings(correlationId, phone, callback) {
        this._persistence.getOneByPhoneSettings(correlationId, phone, (err, settings) => {
            callback(err, this.settingsToPublic(settings));
        });
    }
    verifyAndSaveSettings(correlationId, oldSettings, newSettings, callback) {
        let verify = false;
        async.series([
            // Check if verification is needed
            (callback) => {
                verify = (oldSettings == null && this._verifyOnCreate)
                    || (oldSettings.phone != newSettings.phone && this._verifyOnUpdate);
                if (verify) {
                    newSettings.verified = false;
                    let code = pip_services_commons_node_6.IdGenerator.nextShort();
                    newSettings.ver_code = code.substr(code.length - 4);
                    newSettings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);
                }
                callback();
            },
            // Set new settings
            (callback) => {
                this._persistence.set(correlationId, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                });
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
    sendVerificationMessage(correlationId, newSettings) {
        this._templatesResolver.resolve('verify_phone', (err, template) => {
            if (err == null && template == null) {
                err = new pip_services_commons_node_4.ConfigException(correlationId, 'MISSING_VERIFY_PHONE', 'Message template "verify_phone" is missing');
            }
            if (err) {
                this._logger.error(correlationId, err, 'Cannot find verify_phone message template');
                return;
            }
            let message = {
                subject: template.subject,
                text: template.text,
                html: template.html
            };
            let recipient = {
                id: newSettings.id,
                name: newSettings.name,
                phone: newSettings.phone,
                language: newSettings.language
            };
            let parameters = pip_services_commons_node_1.ConfigParams.fromTuples('code', newSettings.ver_code);
            if (this._smsClient) {
                this._smsClient.sendMessageToRecipient(correlationId, recipient, message, parameters, (err) => {
                    if (err)
                        this._logger.error(correlationId, err, 'Failed to send phone verification message');
                });
            }
        });
    }
    setSettings(correlationId, settings, callback) {
        if (settings.id == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'), null);
            return;
        }
        if (settings.phone == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_PHONE', 'Missing phone'), null);
            return;
        }
        if (!SmsSettingsController._phoneRegex.test(settings.phone)) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'WRONG_PHONE', 'Invalid phone ' + settings.phone).withDetails('phone', settings.phone), null);
            return;
        }
        let newSettings = _.clone(settings);
        newSettings.verified = false;
        newSettings.ver_code = null;
        newSettings.ver_expire_time = null;
        newSettings.subscriptions = newSettings.subscriptions || {};
        let oldSettings;
        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(correlationId, newSettings.id, (err, data) => {
                    if (data != null) {
                        oldSettings = data;
                        // Override
                        newSettings.verified = data.verified;
                        newSettings.ver_code = data.ver_code;
                        newSettings.ver_expire_time = data.ver_expire_time;
                    }
                    callback(err);
                });
            },
            // Verify and save settings
            (callback) => {
                this.verifyAndSaveSettings(correlationId, oldSettings, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                });
            },
        ], (err) => {
            // remove ver_code from returned data
            delete newSettings.ver_code;
            if (callback)
                callback(err, newSettings);
        });
    }
    setVerifiedSettings(correlationId, settings, callback) {
        if (settings.id == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'), null);
            return;
        }
        if (settings.phone == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_PHONE', 'Missing phone'), null);
            return;
        }
        if (!SmsSettingsController._phoneRegex.test(settings.phone)) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'WRONG_PHONE', 'Invalid phone ' + settings.phone).withDetails('phone', settings.phone), null);
            return;
        }
        let newSettings = _.clone(settings);
        newSettings.verified = true;
        newSettings.ver_code = null;
        newSettings.ver_expire_time = null;
        newSettings.subscriptions = newSettings.subscriptions || {};
        this._persistence.set(correlationId, newSettings, callback);
    }
    setRecipient(correlationId, recipientId, name, phone, language, callback) {
        if (recipientId == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'), null);
            return;
        }
        if (phone != null && !SmsSettingsController._phoneRegex.test(phone)) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'WRONG_PHONE', 'Invalid phone ' + phone).withDetails('phone', phone), null);
            return;
        }
        let oldSettings;
        let newSettings;
        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(correlationId, recipientId, (err, data) => {
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
                    }
                    else {
                        // Create new settings if they are not exist
                        oldSettings = null;
                        newSettings = {
                            id: recipientId,
                            name: name,
                            phone: phone,
                            language: language
                        };
                    }
                    callback();
                });
            },
            // Verify and save settings
            (callback) => {
                this.verifyAndSaveSettings(correlationId, oldSettings, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                });
            },
        ], (err) => {
            // remove ver_code from returned data
            delete newSettings.ver_code;
            if (callback)
                callback(err, newSettings);
        });
    }
    setSubscriptions(correlationId, recipientId, subscriptions, callback) {
        if (recipientId == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_ID', 'Missing id'), null);
            return;
        }
        let oldSettings;
        let newSettings;
        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(correlationId, recipientId, (err, data) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (data != null) {
                        // Copy and modify existing settings
                        oldSettings = data;
                        newSettings = _.clone(data);
                        newSettings.subscriptions = subscriptions || data.subscriptions;
                    }
                    else {
                        // Create new settings if they are not exist
                        oldSettings = null;
                        newSettings = {
                            id: recipientId,
                            name: null,
                            phone: null,
                            language: null,
                            subscriptions: subscriptions
                        };
                    }
                    callback();
                });
            },
            // Verify and save settings
            (callback) => {
                this.verifyAndSaveSettings(correlationId, oldSettings, newSettings, (err, data) => {
                    newSettings = data;
                    callback(err);
                });
            },
        ], (err) => {
            // remove ver_code from returned data
            delete newSettings.ver_code;
            if (callback)
                callback(err, newSettings);
        });
    }
    deleteSettingsById(correlationId, recipientId, callback) {
        this._persistence.deleteById(correlationId, recipientId, (err, settings) => {
            if (callback)
                callback(err);
        });
    }
    resendVerification(correlationId, recipientId, callback) {
        if (recipientId == null) {
            callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id'));
            return;
        }
        let settings;
        async.series([
            // Get existing settings
            (callback) => {
                this._persistence.getOneById(correlationId, recipientId, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services_commons_node_5.NotFoundException(correlationId, 'RECIPIENT_NOT_FOUND', 'Recipient ' + recipientId + ' was not found')
                            .withDetails('recipient_id', recipientId);
                    }
                    settings = data;
                    callback(err);
                });
            },
            // Check if verification is needed
            (callback) => {
                settings.verified = false;
                settings.ver_code = pip_services_commons_node_6.IdGenerator.nextShort();
                settings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);
                callback();
            },
            // Set new settings
            (callback) => {
                this._persistence.set(correlationId, settings, (err, data) => {
                    settings = data;
                    callback(err);
                });
            },
            // Send verification
            (callback) => {
                // Send verification message and do not wait
                this.sendVerificationMessage(correlationId, settings);
                callback();
            }
        ], (err) => {
            if (callback)
                callback(err);
        });
    }
    logActivity(correlationId, settings, activityType) {
        if (this._activitiesClient) {
            this._activitiesClient.logPartyActivity(correlationId, new pip_clients_activities_node_1.PartyActivityV1(null, activityType, {
                id: settings.id,
                type: 'account',
                name: settings.name
            }), (err, activity) => {
                if (err)
                    this._logger.error(correlationId, err, 'Failed to log user activity');
            });
        }
    }
    verifyPhone(correlationId, recipientId, code, callback) {
        let settings;
        async.series([
            // Read settings
            (callback) => {
                this._persistence.getOneById(correlationId, recipientId, (err, data) => {
                    settings = data;
                    if (settings == null && err == null) {
                        err = new pip_services_commons_node_5.NotFoundException(correlationId, 'RECIPIENT_NOT_FOUND', 'Recipient ' + recipientId + ' was not found')
                            .withDetails('recipient_id', recipientId);
                    }
                    callback(err);
                });
            },
            // Check and update verification code
            (callback) => {
                let verified = settings.ver_code == code;
                verified = verified || (this._magicCode != null && code == this._magicCode);
                verified = verified && new Date().getTime() < settings.ver_expire_time.getTime();
                if (!verified) {
                    callback(new pip_services_commons_node_3.BadRequestException(correlationId, 'INVALID_CODE', 'Invalid sms verification code ' + code)
                        .withDetails('recipient_id', recipientId)
                        .withDetails('code', code));
                    return;
                }
                settings.verified = true;
                settings.ver_code = null;
                settings.ver_expire_time = null;
                callback();
            },
            // Save user
            (callback) => {
                this._persistence.set(correlationId, settings, callback);
            },
            // Asynchronous post-processing
            (callback) => {
                this.logActivity(correlationId, settings, SmsSettingsActivityTypeV1_1.SmsSettingsActivityTypeV1.PhoneVerified);
                callback();
            }
        ], (err) => {
            if (callback)
                callback(err);
        });
    }
}
SmsSettingsController._phoneRegex = /^\+[0-9]{10,15}$/;
SmsSettingsController._defaultConfig = pip_services_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-smssettings:persistence:*:*:1.0', 'dependencies.activities', 'pip-services-activities:client:*:*:1.0', 'dependencies.msgtemplates', 'pip-services-msgtemplates:client:*:*:1.0', 'dependencies.smsdelivery', 'pip-services-sms:client:*:*:1.0', 'message_templates.verify_phone.subject', 'Verify phone number', 'message_templates.verify_phone.text', 'Verification code for {{phone}} is {{ code }}.', 'options.magic_code', null, 'options.signature_length', 100, 'options.verify_on_create', true, 'options.verify_on_update', true);
exports.SmsSettingsController = SmsSettingsController;
//# sourceMappingURL=SmsSettingsController.js.map