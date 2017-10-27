import { ObjectSchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';

export class SmsSettingsV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('id', TypeCode.String);
        this.withOptionalProperty('name', TypeCode.String);
        this.withOptionalProperty('sms', TypeCode.String);
        this.withOptionalProperty('language', TypeCode.String);
        this.withOptionalProperty('subscriptions', TypeCode.Map);
        this.withOptionalProperty('verified', TypeCode.Boolean);
        this.withOptionalProperty('ver_code', TypeCode.String);
        this.withOptionalProperty('ver_expire_time', null); // TypeCode.Date);
        this.withOptionalProperty('custom_hdr', null);
        this.withOptionalProperty('custom_dat', null);
    }
}
