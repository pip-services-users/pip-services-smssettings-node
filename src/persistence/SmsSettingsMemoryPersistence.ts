let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';
import { ISmsSettingsPersistence } from './ISmsSettingsPersistence';

export class SmsSettingsMemoryPersistence 
    extends IdentifiableMemoryPersistence<SmsSettingsV1, string> 
    implements ISmsSettingsPersistence {

    constructor() {
        super();
    }

    public getOneByPhoneSettings(correlationId: string, phone: string,
        callback: (err: any, settings: SmsSettingsV1) => void): void {
        
        let items = this._items.filter((x) => {return x.phone == phone;});
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved %s by %s", item, phone);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", phone);

        callback(null, item);
    }
}
