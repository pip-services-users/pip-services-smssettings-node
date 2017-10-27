import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { SmsSettingsServiceFactory } from '../build/SmsSettingsServiceFactory';

export class SmsSettingsProcess extends ProcessContainer {

    public constructor() {
        super("sms_settings", "Sms settings microservice");
        this._factories.add(new SmsSettingsServiceFactory);
    }


}
