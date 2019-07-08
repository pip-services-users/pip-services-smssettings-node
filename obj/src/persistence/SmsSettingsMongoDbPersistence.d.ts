import { IdentifiableMongoosePersistence } from 'pip-services3-mongoose-node';
import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';
import { ISmsSettingsPersistence } from './ISmsSettingsPersistence';
export declare class SmsSettingsMongoDbPersistence extends IdentifiableMongoosePersistence<SmsSettingsV1, string> implements ISmsSettingsPersistence {
    constructor();
    getOneByPhoneSettings(correlationId: string, phone: string, callback: (err: any, item: SmsSettingsV1) => void): void;
}
