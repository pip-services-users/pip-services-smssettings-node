import { SmsSettingsMemoryPersistence } from '../../src/persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsPersistenceFixture } from './SmsSettingsPersistenceFixture';

suite('SmsSettingsMemoryPersistence', ()=> {
    let persistence: SmsSettingsMemoryPersistence;
    let fixture: SmsSettingsPersistenceFixture;
    
    setup((done) => {
        persistence = new SmsSettingsMemoryPersistence();
        fixture = new SmsSettingsPersistenceFixture(persistence);
        
        persistence.open(null, done);
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});