"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class SmsSettingsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/sms_settings');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-smssettings', 'controller', 'default', '*', '1.0'));
    }
}
exports.SmsSettingsHttpServiceV1 = SmsSettingsHttpServiceV1;
//# sourceMappingURL=SmsSettingsHttpServiceV1.js.map