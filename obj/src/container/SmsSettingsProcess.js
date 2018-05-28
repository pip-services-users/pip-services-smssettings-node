"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_oss_node_1 = require("pip-services-oss-node");
const pip_clients_activities_node_1 = require("pip-clients-activities-node");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
const SmsSettingsServiceFactory_1 = require("../build/SmsSettingsServiceFactory");
class SmsSettingsProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("sms_settings", "Sms settings microservice");
        this._factories.add(new SmsSettingsServiceFactory_1.SmsSettingsServiceFactory);
        this._factories.add(new pip_clients_activities_node_1.ActivitiesClientFactory());
        this._factories.add(new pip_clients_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new pip_clients_sms_node_1.SmsClientFactory());
        this._factories.add(new pip_services_net_node_1.DefaultNetFactory);
        this._factories.add(new pip_services_oss_node_1.DefaultOssFactory);
    }
}
exports.SmsSettingsProcess = SmsSettingsProcess;
//# sourceMappingURL=SmsSettingsProcess.js.map