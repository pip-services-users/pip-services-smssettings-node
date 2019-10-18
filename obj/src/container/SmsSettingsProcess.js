"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const SmsSettingsServiceFactory_1 = require("../build/SmsSettingsServiceFactory");
const pip_clients_activities_node_1 = require("pip-clients-activities-node");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class SmsSettingsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("sms_settings", "Sms settings microservice");
        this._factories.add(new SmsSettingsServiceFactory_1.SmsSettingsServiceFactory());
        this._factories.add(new pip_clients_activities_node_1.ActivitiesClientFactory());
        this._factories.add(new pip_clients_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new pip_clients_sms_node_1.SmsClientFactory());
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory());
    }
}
exports.SmsSettingsProcess = SmsSettingsProcess;
//# sourceMappingURL=SmsSettingsProcess.js.map