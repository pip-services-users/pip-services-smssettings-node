import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';
import { DefaultNetFactory } from 'pip-services-net-node';
import { DefaultOssFactory } from 'pip-services-oss-node';

import { ActivitiesClientFactory } from 'pip-clients-activities-node';
import { MessageTemplatesClientFactory } from 'pip-clients-msgtemplates-node';
import { SmsClientFactory } from 'pip-clients-sms-node';

import { SmsSettingsServiceFactory } from '../build/SmsSettingsServiceFactory';

export class SmsSettingsProcess extends ProcessContainer {

    public constructor() {
        super("sms_settings", "Sms settings microservice");
        this._factories.add(new SmsSettingsServiceFactory);
        this._factories.add(new ActivitiesClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new DefaultNetFactory);
        this._factories.add(new DefaultOssFactory);
    }

}
