"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class SmsSettingsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('sms_settings');
    }
    getOneByPhoneSettings(correlationId, phone, callback) {
        this._collection.findOne({
            phone: phone
        }, (err, item) => {
            if (!err)
                this._logger.trace(correlationId, "Retrieved from %s by %s", this._collection, phone);
            item = this.convertToPublic(item);
            callback(err, item);
        });
    }
}
exports.SmsSettingsMongoDbPersistence = SmsSettingsMongoDbPersistence;
//# sourceMappingURL=SmsSettingsMongoDbPersistence.js.map