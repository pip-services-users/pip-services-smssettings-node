let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';

import { SmsNullClientV1 } from 'pip-clients-sms-node';

import { SmsSettingsV1 } from '../../src/data/version1/SmsSettingsV1';
import { SmsSettingsMemoryPersistence } from '../../src/persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsController } from '../../src/logic/SmsSettingsController';
import { SmsSettingsLambdaFunction } from '../../src/container/SmsSettingsLambdaFunction';

let SETTINGS = <SmsSettingsV1> {
    id: '1',
    name: 'User 1',
    phone: '+1234567890',
    language: 'en',
    verified: false
};

suite('SmsSettingsLambdaFunction', ()=> {
    let lambda: SmsSettingsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services-commons:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-smssettings:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-smssettings:controller:default:default:1.0',
            'smsdelivery.descriptor', 'pip-services-sms:client:null:default:1.0'
        );

        lambda = new SmsSettingsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    

    test('CRUD Operations', (done) => {
        let settings1: SmsSettingsV1;

        async.series([
        // Create sms settings
            (callback) => {
                lambda.act(
                    {
                        role: 'sms_settings',
                        cmd: 'set_settings',
                        settings: SETTINGS
                    },
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

                lambda.act(
                    {
                        role: 'sms_settings',
                        cmd: 'set_settings',
                        settings: settings1
                    },
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        assert.equal(settings.id, settings1.id)
                        assert.isTrue(settings.subscriptions.engagement);

                        callback();
                    }
                );
            },
        // Delete settings
            (callback) => {
                lambda.act(
                    {
                        role: 'sms_settings',
                        cmd: 'delete_settings_by_id',
                        recipient_id: SETTINGS.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted settings
            (callback) => {
                lambda.act(
                    {
                        role: 'sms_settings',
                        cmd: 'get_settings_by_id',
                        recipient_id: SETTINGS.id
                    },
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isNull(settings);

                        callback();
                    }
                );
            }
        ], done);
    });
    
});