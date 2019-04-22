import { ConfigParams } from 'pip-services3-commons-node';

import { SmsSettingsFilePersistence } from '../../src/persistence/SmsSettingsFilePersistence';
import { SmsSettingsPersistenceFixture } from './SmsSettingsPersistenceFixture';

suite('SmsSettingsFilePersistence', ()=> {
    let persistence: SmsSettingsFilePersistence;
    let fixture: SmsSettingsPersistenceFixture;
    
    setup((done) => {
        persistence = new SmsSettingsFilePersistence('./data/sms_settings.test.json');

        fixture = new SmsSettingsPersistenceFixture(persistence);
        
        persistence.open(null, (err) => {
            if (err) done(err);
            else persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});