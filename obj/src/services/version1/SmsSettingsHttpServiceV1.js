"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
class SmsSettingsHttpServiceV1 extends pip_services_net_node_1.CommandableHttpService {
    constructor() {
        super('sms_settings');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-smssettings', 'controller', 'default', '*', '1.0'));
    }
}
exports.SmsSettingsHttpServiceV1 = SmsSettingsHttpServiceV1;
//# sourceMappingURL=SmsSettingsHttpServiceV1.js.map