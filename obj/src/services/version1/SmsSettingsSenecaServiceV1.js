"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_seneca_node_1 = require("pip-services-seneca-node");
class SmsSettingsSenecaServiceV1 extends pip_services_seneca_node_1.CommandableSenecaService {
    constructor() {
        super('sms_settings');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-smssettings', 'controller', 'default', '*', '1.0'));
    }
}
exports.SmsSettingsSenecaServiceV1 = SmsSettingsSenecaServiceV1;
//# sourceMappingURL=SmsSettingsSenecaServiceV1.js.map