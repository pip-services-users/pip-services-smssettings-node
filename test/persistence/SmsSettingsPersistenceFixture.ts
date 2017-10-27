let async = require('async');
let assert = require('chai').assert;

import { SmsSettingsV1 } from '../../src/data/version1/SmsSettingsV1';
import { ISmsSettingsPersistence } from '../../src/persistence/ISmsSettingsPersistence';

let SETTINGS = <SmsSettingsV1> {
    id: '1',
    name: 'User 1',
    phone: '+1234567890',
    language: 'en',
    verified: false,
    ver_code: null,
    subscriptions: { notifications: true, ads: false }
};

export class SmsSettingsPersistenceFixture {
    private _persistence: ISmsSettingsPersistence;
    
    constructor(persistence: ISmsSettingsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }
                
    testCrudOperations(done) {
        let settings1: SmsSettingsV1;

        async.series([
        // Create items
            (callback) => {
                this._persistence.set(
                    null,
                    SETTINGS,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        assert.equal(settings.id, SETTINGS.id);
                        assert.equal(settings.phone, SETTINGS.phone);
                        assert.isFalse(settings.verified);
                        assert.isNull(settings.ver_code || null);

                        callback();
                    }
                );
            },
        // Get settings by sms
            (callback) => {
                this._persistence.getOneByPhoneSettings(
                    null,
                    SETTINGS.phone,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        assert.equal(settings.id, SETTINGS.id);
                        
                        settings1 = settings;

                        callback();
                    }
                );
            },
        // Update settings
            (callback) => {
                settings1.phone = '+1234567432';

                this._persistence.set(
                    null,
                    settings1,
                    (err, settings) => {
                        assert.isNull(err);
                        
                        assert.isObject(settings);
                        assert.equal(settings.id, SETTINGS.id)
                        assert.isFalse(settings.verified);
                        assert.equal(settings.phone, '+1234567432');

                        callback();
                    }
                );
            },
        // Try to get deleted settings
            (callback) => {
                this._persistence.getListByIds(
                    null,
                    [ SETTINGS.id ],
                    (err, settings) => {
                        assert.isNull(err);

                        assert.lengthOf(settings, 1);

                        callback();
                    }
                );
            },
        // Delete settings
            (callback) => {
                this._persistence.deleteById(
                    null,
                    SETTINGS.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted settings
            (callback) => {
                this._persistence.getOneById(
                    null,
                    SETTINGS.id,
                    (err, settings) => {
                        assert.isNull(err);

                        assert.isNull(settings || null);

                        callback();
                    }
                );
            }
        ], done);
    }

}
