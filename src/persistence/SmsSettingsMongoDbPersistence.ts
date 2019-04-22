let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';
import { ISmsSettingsPersistence } from './ISmsSettingsPersistence';
import { SmsSettingsMongoDbSchema } from './SmsSettingsMongoDbSchema';

export class SmsSettingsMongoDbPersistence 
    extends IdentifiableMongoDbPersistence<SmsSettingsV1, string> 
    implements ISmsSettingsPersistence {

    constructor() {
        super('sms_settings', SmsSettingsMongoDbSchema());
    }

    public getOneByPhoneSettings(correlationId: string, phone: string,
        callback: (err: any, item: SmsSettingsV1) => void): void {
        this._model.findOne(
            {
                phone: phone
            }, 
            (err, item) => {
                if (!err)
                    this._logger.trace(correlationId, "Retrieved from %s by %s", this._collection, phone);

                item = this.convertToPublic(item);
                callback(err, item);
            }
        );
    }
}
