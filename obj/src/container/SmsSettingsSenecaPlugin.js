"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_net_node_2 = require("pip-services-net-node");
const SmsSettingsMemoryPersistence_1 = require("../persistence/SmsSettingsMemoryPersistence");
const SmsSettingsFilePersistence_1 = require("../persistence/SmsSettingsFilePersistence");
const SmsSettingsMongoDbPersistence_1 = require("../persistence/SmsSettingsMongoDbPersistence");
const SmsSettingsController_1 = require("../logic/SmsSettingsController");
const SmsSettingsSenecaServiceV1_1 = require("../services/version1/SmsSettingsSenecaServiceV1");
const pip_clients_activities_node_1 = require("pip-clients-activities-node");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
class SmsSettingsSenecaPlugin extends pip_services_net_node_1.SenecaPlugin {
    constructor(seneca, options) {
        super('pip-services-smssettings', seneca, SmsSettingsSenecaPlugin.createReferences(seneca, options));
    }
    static createReferences(seneca, options) {
        options = options || {};
        let logger = new pip_services_commons_node_4.ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(pip_services_commons_node_3.ConfigParams.fromValue(loggerOptions));
        let activitiesClient = new pip_clients_activities_node_1.ActivitiesSenecaClientV1();
        let activitiesOptions = options.activities || {};
        activitiesClient.configure(pip_services_commons_node_3.ConfigParams.fromValue(activitiesOptions));
        let smsClient = new pip_clients_sms_node_1.SmsSenecaClientV1();
        let smsOptions = options.sms || {};
        smsClient.configure(pip_services_commons_node_3.ConfigParams.fromValue(smsOptions));
        let controller = new SmsSettingsController_1.SmsSettingsController();
        controller.configure(pip_services_commons_node_3.ConfigParams.fromValue(options));
        let persistence;
        let persistenceOptions = options.persistence || {};
        let persistenceType = persistenceOptions.type || 'memory';
        if (persistenceType == 'mongodb')
            persistence = new SmsSettingsMongoDbPersistence_1.SmsSettingsMongoDbPersistence();
        else if (persistenceType == 'file')
            persistence = new SmsSettingsFilePersistence_1.SmsSettingsFilePersistence();
        else if (persistenceType == 'memory')
            persistence = new SmsSettingsMemoryPersistence_1.SmsSettingsMemoryPersistence();
        else
            throw new pip_services_commons_node_5.ConfigException(null, 'WRONG_PERSISTENCE_TYPE', 'Unrecognized persistence type: ' + persistenceType);
        persistence.configure(pip_services_commons_node_3.ConfigParams.fromValue(persistenceOptions));
        let service = new SmsSettingsSenecaServiceV1_1.SmsSettingsSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(pip_services_commons_node_3.ConfigParams.fromValue(serviceOptions));
        let senecaInstance = new pip_services_net_node_2.SenecaInstance(seneca);
        return pip_services_commons_node_1.References.fromTuples(new pip_services_commons_node_2.Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger, new pip_services_commons_node_2.Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance, new pip_services_commons_node_2.Descriptor('pip-services-activities', 'client', 'seneca', 'default', '1.0'), activitiesClient, new pip_services_commons_node_2.Descriptor('pip-services-sms', 'client', 'seneca', 'default', '1.0'), smsClient, new pip_services_commons_node_2.Descriptor('pip-services-smssettings', 'persistence', persistenceType, 'default', '1.0'), persistence, new pip_services_commons_node_2.Descriptor('pip-services-smssettings', 'controller', 'default', 'default', '1.0'), controller, new pip_services_commons_node_2.Descriptor('pip-services-smssettings', 'service', 'seneca', 'default', '1.0'), service);
    }
}
exports.SmsSettingsSenecaPlugin = SmsSettingsSenecaPlugin;
module.exports = function (options) {
    let seneca = this;
    let plugin = new SmsSettingsSenecaPlugin(seneca, options);
    return { name: plugin.name };
};
//# sourceMappingURL=SmsSettingsSenecaPlugin.js.map