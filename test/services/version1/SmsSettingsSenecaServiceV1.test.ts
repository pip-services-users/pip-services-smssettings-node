let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { SenecaInstance } from 'pip-services-net-node';

import { SmsDeliveryNullClientV1 } from 'pip-clients-smsdelivery-node';

import { SmsSettingsV1 } from '../../../src/data/version1/SmsSettingsV1';
import { SmsSettingsMemoryPersistence } from '../../../src/persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsController } from '../../../src/logic/SmsSettingsController';
import { SmsSettingsSenecaServiceV1 } from '../../../src/services/version1/SmsSettingsSenecaServiceV1';

let SETTINGS = <SmsSettingsV1> {
    id: '1',
    name: 'User 1',
    phone: '+1234567890',
    language: 'en',
    verified: false
};

suite('SmsSettingsSenecaServiceV1', ()=> {
    let seneca: any;
    let service: SmsSettingsSenecaServiceV1;
    let persistence: SmsSettingsMemoryPersistence;
    let controller: SmsSettingsController;

    suiteSetup((done) => {
        persistence = new SmsSettingsMemoryPersistence();

        controller = new SmsSettingsController();
        controller.configure(new ConfigParams());

        service = new SmsSettingsSenecaServiceV1();
        service.configure(ConfigParams.fromTuples(
            "connection.protocol", "none"
        ));

        let logger = new ConsoleLogger();
        let senecaAddon = new SenecaInstance();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaAddon,
            new Descriptor('pip-services-smssettings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-smssettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-smsdelivery', 'client', 'null', 'default', '1.0'), new SmsDeliveryNullClientV1(),
            new Descriptor('pip-services-smssettings', 'service', 'seneca', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        seneca = senecaAddon.getInstance();

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });

    test('CRUD Operations', (done) => {
        let settings1: SmsSettingsV1;

        async.series([
        // Create sms settings
            (callback) => {
                seneca.act(
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

                seneca.act(
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
                seneca.act(
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
                seneca.act(
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