import { Descriptor } from 'pip-services-commons-node';
import { CommandableSenecaService } from 'pip-services-seneca-node';

export class SmsSettingsSenecaServiceV1 extends CommandableSenecaService {
    public constructor() {
        super('sms_settings');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-smssettings', 'controller', 'default', '*', '1.0'));
    }
}