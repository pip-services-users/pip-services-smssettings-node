import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { SmsSettingsServiceFactory } from '../build/SmsSettingsServiceFactory';
import { ActivitiesClientFactory } from 'pip-clients-activities-node';
import { MessageTemplatesClientFactory } from 'pip-clients-msgtemplates-node';
import { SmsClientFactory } from 'pip-clients-sms-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class SmsSettingsProcess extends ProcessContainer {

    public constructor() {
        super("sms_settings", "Sms settings microservice");
        this._factories.add(new SmsSettingsServiceFactory());
        this._factories.add(new ActivitiesClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new DefaultRpcFactory());
    }

}
