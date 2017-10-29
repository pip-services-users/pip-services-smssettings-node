import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';
import { SmsSettingsServiceFactory } from '../build/SmsSettingsServiceFactory';

import { SmsClientFactory } from 'pip-clients-sms-node';
import { MessageTemplatesClientFactory } from 'pip-clients-msgtemplates-node';
import { ActivitiesClientFactory } from 'pip-clients-activities-node';

export class SmsSettingsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("sms_settings", "Sms settings function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-smssettings', 'controller', 'default', '*', '*'));
        this._factories.add(new SmsSettingsServiceFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new ActivitiesClientFactory());
    }
}

export const handler = new SmsSettingsLambdaFunction().getHandler();