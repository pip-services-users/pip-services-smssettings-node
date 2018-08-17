"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
const SmsSettingsMongoDbPersistence_1 = require("../persistence/SmsSettingsMongoDbPersistence");
const SmsSettingsFilePersistence_1 = require("../persistence/SmsSettingsFilePersistence");
const SmsSettingsMemoryPersistence_1 = require("../persistence/SmsSettingsMemoryPersistence");
const SmsSettingsController_1 = require("../logic/SmsSettingsController");
const SmsSettingsHttpServiceV1_1 = require("../services/version1/SmsSettingsHttpServiceV1");
const SmsSettingsSenecaServiceV1_1 = require("../services/version1/SmsSettingsSenecaServiceV1");
class SmsSettingsServiceFactory extends pip_services_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(SmsSettingsServiceFactory.MemoryPersistenceDescriptor, SmsSettingsMemoryPersistence_1.SmsSettingsMemoryPersistence);
        this.registerAsType(SmsSettingsServiceFactory.FilePersistenceDescriptor, SmsSettingsFilePersistence_1.SmsSettingsFilePersistence);
        this.registerAsType(SmsSettingsServiceFactory.MongoDbPersistenceDescriptor, SmsSettingsMongoDbPersistence_1.SmsSettingsMongoDbPersistence);
        this.registerAsType(SmsSettingsServiceFactory.ControllerDescriptor, SmsSettingsController_1.SmsSettingsController);
        this.registerAsType(SmsSettingsServiceFactory.SenecaServiceDescriptor, SmsSettingsSenecaServiceV1_1.SmsSettingsSenecaServiceV1);
        this.registerAsType(SmsSettingsServiceFactory.HttpServiceDescriptor, SmsSettingsHttpServiceV1_1.SmsSettingsHttpServiceV1);
    }
}
SmsSettingsServiceFactory.Descriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "factory", "default", "default", "1.0");
SmsSettingsServiceFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "persistence", "memory", "*", "1.0");
SmsSettingsServiceFactory.FilePersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "persistence", "file", "*", "1.0");
SmsSettingsServiceFactory.MongoDbPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "persistence", "mongodb", "*", "1.0");
SmsSettingsServiceFactory.ControllerDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "controller", "default", "*", "1.0");
SmsSettingsServiceFactory.SenecaServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "service", "seneca", "*", "1.0");
SmsSettingsServiceFactory.HttpServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-smssettings", "service", "http", "*", "1.0");
exports.SmsSettingsServiceFactory = SmsSettingsServiceFactory;
//# sourceMappingURL=SmsSettingsServiceFactory.js.map