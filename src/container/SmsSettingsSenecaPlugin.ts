import { References } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { ConfigException } from 'pip-services-commons-node';
import { SenecaPlugin } from 'pip-services-net-node';
import { SenecaInstance } from 'pip-services-net-node';

import { SmsSettingsMemoryPersistence } from '../persistence/SmsSettingsMemoryPersistence';
import { SmsSettingsFilePersistence } from '../persistence/SmsSettingsFilePersistence';
import { SmsSettingsMongoDbPersistence } from '../persistence/SmsSettingsMongoDbPersistence';
import { SmsSettingsController } from '../logic/SmsSettingsController';
import { SmsSettingsSenecaServiceV1 } from '../services/version1/SmsSettingsSenecaServiceV1';
import { ActivitiesSenecaClientV1 } from 'pip-clients-activities-node';
import { SmsSenecaClientV1 } from 'pip-clients-sms-node';

export class SmsSettingsSenecaPlugin extends SenecaPlugin {
    public constructor(seneca: any, options: any) {
        super('pip-services-smssettings', seneca, SmsSettingsSenecaPlugin.createReferences(seneca, options));
    }

    private static createReferences(seneca: any, options: any): References {
        options = options || {};

        let logger = new ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(ConfigParams.fromValue(loggerOptions));

        let activitiesClient = new ActivitiesSenecaClientV1();
        let activitiesOptions = options.activities || {};
        activitiesClient.configure(ConfigParams.fromValue(activitiesOptions));

        let smsClient = new SmsSenecaClientV1();
        let smsOptions = options.sms || {};
        smsClient.configure(ConfigParams.fromValue(smsOptions));

        let controller = new SmsSettingsController();
        controller.configure(ConfigParams.fromValue(options));

        let persistence;
        let persistenceOptions = options.persistence || {};
        let persistenceType = persistenceOptions.type || 'memory';
        if (persistenceType == 'mongodb') 
            persistence = new SmsSettingsMongoDbPersistence();
        else if (persistenceType == 'file')
            persistence = new SmsSettingsFilePersistence();
        else if (persistenceType == 'memory')
            persistence = new SmsSettingsMemoryPersistence();
        else 
            throw new ConfigException(null, 'WRONG_PERSISTENCE_TYPE', 'Unrecognized persistence type: ' + persistenceType);
        persistence.configure(ConfigParams.fromValue(persistenceOptions));

        let service = new SmsSettingsSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(ConfigParams.fromValue(serviceOptions));

        let senecaInstance = new SenecaInstance(seneca);

        return References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance,
            new Descriptor('pip-services-activities', 'client', 'seneca', 'default', '1.0'), activitiesClient,
            new Descriptor('pip-services-sms', 'client', 'seneca', 'default', '1.0'), smsClient,
            new Descriptor('pip-services-smssettings', 'persistence', persistenceType, 'default', '1.0'), persistence,
            new Descriptor('pip-services-smssettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-smssettings', 'service', 'seneca', 'default', '1.0'), service
        );
    }
}

module.exports = function(options: any): any {
    let seneca = this;
    let plugin = new SmsSettingsSenecaPlugin(seneca, options);
    return { name: plugin.name };
}