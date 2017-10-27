let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';

import { SmsDeliveryNullClientV1 } from 'pip-clients-smsdelivery-node';

import { SmsSettingsV1 } from '../../src/data/version1/SmsSettingsV1';
import { SmsSettingsMemoryPersistence } from '../../src/persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsController } from '../../src/logic/SmsSettingsController';

let SETTINGS = <SmsSettingsV1> {
    id: '1',
    name: 'User 1',
    phone: '+1234567890',
    language: 'en',
    verified: false
};

suite('SmsSettingsController', ()=> {
    let persistence: SmsSettingsMemoryPersistence;
    let controller: SmsSettingsController;

    setup(() => {
        persistence = new SmsSettingsMemoryPersistence();

        controller = new SmsSettingsController();
        controller.configure(new ConfigParams());

        let references: References = References.fromTuples(
            new Descriptor('pip-services-smssettings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-smssettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-smsdelivery', 'client', 'null', 'default', '1.0'), new SmsDeliveryNullClientV1()
        );
        controller.setReferences(references);
    });
    
    test('CRUD Operations', (done) => {
        let settings1: SmsSettingsV1;

        async.series([
        // Create sms settings
            (callback) => {
                controller.setSettings(
                    null, 
                    SETTINGS,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        assert.equal(settings.id, SETTINGS.id);
                        assert.equal(settings.phone, SETTINGS.phone);
                        assert.isFalse(settings.verified);

                        settings1 = settings;

                        callback();
                    }
                );
            },
        // Update the settings
            (callback) => {
                settings1.subscriptions.engagement = true;

                controller.setSettings(
                    null,
                    settings1,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        assert.equal(settings.id, settings1.id)
                        assert.isTrue(settings.subscriptions.engagement);

                        callback();
                    }
                );
            },
        // Get settings
            (callback) => {
                controller.getSettingsByIds(
                    null,
                    [ settings1.id ],
                    (err, settings) => {
                        assert.isNull(err);

                        assert.lengthOf(settings, 1);

                        callback();
                    }
                );
            },
        // Delete settings
            (callback) => {
                controller.deleteSettingsById(
                    null,
                    settings1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted settings
            (callback) => {
                controller.getSettingsById(
                    null,
                    settings1.id,
                    (err, settings) => {
                        assert.isNull(err);

                        assert.isNull(settings);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Verify Phone', (done) => {
        let settings1: SmsSettingsV1;

        async.series([
        // Create new settings
            (callback) => {
                settings1 = _.clone(SETTINGS);
                settings1.ver_code = '123';
                settings1.verified = false;
                settings1.ver_expire_time = new Date(new Date().getTime() + 10000);

                persistence.set(
                    null,
                    settings1,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        settings1 = settings;

                        assert.isFalse(settings.verified);
                        assert.isDefined(settings.ver_code);

                        callback();
                    }
                );
            },
        // Verify phone
            (callback) => {
                controller.verifyPhone(
                    null,
                    settings1.id,
                    settings1.ver_code,
                    (err) => {
                        assert.isNull(err);
                        
                        callback();
                    }
                );
            },
        // Check settings
            (callback) => {
                persistence.getOneById(
                    null,
                    settings1.id,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        settings1 = settings;

                        assert.isTrue(settings.verified);
                        assert.isNull(settings.ver_code);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Resend Verification Sms', (done) => {
        let settings1: SmsSettingsV1;

        async.series([
        // Create new settings
            (callback) => {
                persistence.set(
                    null,
                    SETTINGS,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        settings1 = settings;

                        assert.isFalse(settings.verified);
                        assert.isUndefined(settings.ver_code);

                        callback();
                    }
                );
            },
        // Verify sms
            (callback) => {
                controller.resendVerification(
                    null,
                    settings1.id,
                    (err) => {
                        assert.isNull(err);
                        
                        callback();
                    }
                );
            },
        // Check settings
            (callback) => {
                persistence.getOneById(
                    null,
                    settings1.id,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        settings1 = settings;

                        assert.isFalse(settings.verified);
                        assert.isNotNull(settings.ver_code);

                        callback();
                    }
                );
            }
        ], done);
    });
    
});