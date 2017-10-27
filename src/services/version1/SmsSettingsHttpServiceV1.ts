import { Descriptor } from 'pip-services-commons-node';
import { CommandableHttpService } from 'pip-services-net-node';

export class SmsSettingsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('sms_settings');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-smssettings', 'controller', 'default', '*', '1.0'));
    }
}