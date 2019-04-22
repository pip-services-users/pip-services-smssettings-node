import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';

import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';

export interface ISmsSettingsPersistence 
    extends IGetter<SmsSettingsV1, string>, IWriter<SmsSettingsV1, string> 
{
    getListByIds(correlationId: string, ids: string[], callback: (err: any, items: SmsSettingsV1[]) => void): void;

    getOneById(correlation_id: string, id: string, callback: (err: any, item: SmsSettingsV1) => void): void;

    getOneByPhoneSettings(correlation_id: string, phone: string, callback: (err: any, item: SmsSettingsV1) => void): void;

    set(correlation_id: string, item: SmsSettingsV1, callback?: (err: any, item: SmsSettingsV1) => void): void;
    
    deleteById(correlation_id: string, id: string, callback?: (err: any, item: SmsSettingsV1) => void): void;
}
