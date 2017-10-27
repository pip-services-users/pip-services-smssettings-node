"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const SmsSettingsServiceFactory_1 = require("../build/SmsSettingsServiceFactory");
class SmsSettingsProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("sms_settings", "Sms settings microservice");
        this._factories.add(new SmsSettingsServiceFactory_1.SmsSettingsServiceFactory);
    }
}
exports.SmsSettingsProcess = SmsSettingsProcess;
//# sourceMappingURL=SmsSettingsProcess.js.map