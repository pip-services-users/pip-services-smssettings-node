import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class SmsSettingsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/sms_settings');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-smssettings', 'controller', 'default', '*', '1.0'));
    }
}