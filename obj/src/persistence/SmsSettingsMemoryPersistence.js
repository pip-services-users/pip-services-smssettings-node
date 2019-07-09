"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_data_node_1 = require("pip-services3-data-node");
class SmsSettingsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    getOneByPhoneSettings(correlationId, phone, callback) {
        let items = this._items.filter((x) => { return x.phone == phone; });
        let item = items.length > 0 ? items[0] : null;
        if (item != null)
            this._logger.trace(correlationId, "Retrieved %s by %s", item, phone);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", phone);
        callback(null, item);
    }
}
exports.SmsSettingsMemoryPersistence = SmsSettingsMemoryPersistence;
//# sourceMappingURL=SmsSettingsMemoryPersistence.js.map