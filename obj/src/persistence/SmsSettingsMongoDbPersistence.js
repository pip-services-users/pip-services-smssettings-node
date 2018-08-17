"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services_mongodb_node_1 = require("pip-services-mongodb-node");
const SmsSettingsMongoDbSchema_1 = require("./SmsSettingsMongoDbSchema");
class SmsSettingsMongoDbPersistence extends pip_services_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('sms_settings', SmsSettingsMongoDbSchema_1.SmsSettingsMongoDbSchema());
    }
    getOneByPhoneSettings(correlationId, phone, callback) {
        this._model.findOne({
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