let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';

import { SmsNullClientV1 } from 'pip-clients-sms-node';

import { SmsSettingsV1 } from '../../../src/data/version1/SmsSettingsV1';
import { SmsSettingsMemoryPersistence } from '../../../src/persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsController } from '../../../src/logic/SmsSettingsController';
import { SmsSettingsHttpServiceV1 } from '../../../src/services/version1/SmsSettingsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let SETTINGS = <SmsSettingsV1> {
    id: '1',
    name: 'User 1',
    phone: '+1234567890',
    language: 'en',
    verified: false
};

suite('SmsSettingsHttpServiceV1', ()=> {
    let service: SmsSettingsHttpServiceV1;

    let rest: any;

    suiteSetup((done) => {
        let persistence = new SmsSettingsMemoryPersistence();

        let controller = new SmsSettingsController();
        controller.configure(new ConfigParams());

        service = new SmsSettingsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-smssettings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-smssettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-sms', 'client', 'null', 'default', '1.0'), new SmsNullClientV1(),
            new Descriptor('pip-services-smssettings', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('CRUD Operations', (done) => {
        let settings1: SmsSettingsV1;

        async.series([
        // Create sms settings
            (callback) => {
                rest.post('/v1/sms_settings/set_settings',
                    {
                        settings: SETTINGS
                    },
                    (err, req,res, settings) => {
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

                rest.post('/v1/sms_settings/set_settings',
                    { 
                        settings: settings1 
                    },
                    (err, req, res, settings) => {
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
                rest.post('/v1/sms_settings/delete_settings_by_id',
                    {
                        recipient_id: settings1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted settings
            (callback) => {
                rest.post('/v1/sms_settings/get_settings_by_id',
                    {
                        recipient_id: settings1.id
                    },
                    (err, req, res, settings) => {
                        assert.isNull(err);

                        //assert.isNull(settings);

                        callback();
                    }
                );
            }
        ], done);
    });
        
});