import { ConfigParams } from 'pip-services-commons-node';

import { SmsSettingsMongoDbPersistence } from '../../src/persistence/SmsSettingsMongoDbPersistence';
import { SmsSettingsPersistenceFixture } from './SmsSettingsPersistenceFixture';

suite('SmsSettingsMongoDbPersistence', ()=> {
    let persistence: SmsSettingsMongoDbPersistence;
    let fixture: SmsSettingsPersistenceFixture;

    let mongoUri = process.env['MONGO_URI'];
    var mongoCollection = process.env["MONGO_COLLECTION"] || "sms_settings";
    let mongoHost = process.env['MONGO_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_DB'] || 'test';

    if (mongoUri == null && mongoHost == null)
        return;
    
    setup((done) => {
        let dbConfig = ConfigParams.fromTuples(
            "collection", mongoCollection,
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDatabase
        );

        persistence = new SmsSettingsMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new SmsSettingsPersistenceFixture(persistence);

        persistence.open(null, (err: any) => {
            persistence.clear(null, (err) => {
                done(err);
            });
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});