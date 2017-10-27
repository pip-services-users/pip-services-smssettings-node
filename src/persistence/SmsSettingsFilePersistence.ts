import { ConfigParams } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { JsonFilePersister } from 'pip-services-data-node';

import { SmsSettingsMemoryPersistence } from './SmsSettingsMemoryPersistence';
import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';

export class SmsSettingsFilePersistence extends SmsSettingsMemoryPersistence {
	protected _persister: JsonFilePersister<SmsSettingsV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<SmsSettingsV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}