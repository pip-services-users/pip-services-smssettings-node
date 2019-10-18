"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class SmsSettingsV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('sms', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('language', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('subscriptions', pip_services3_commons_node_2.TypeCode.Map);
        this.withOptionalProperty('verified', pip_services3_commons_node_2.TypeCode.Boolean);
        this.withOptionalProperty('ver_code', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('ver_expire_time', null); // TypeCode.Date);
        this.withOptionalProperty('custom_hdr', null);
        this.withOptionalProperty('custom_dat', null);
    }
}
exports.SmsSettingsV1Schema = SmsSettingsV1Schema;
//# sourceMappingURL=SmsSettingsV1Schema.js.map