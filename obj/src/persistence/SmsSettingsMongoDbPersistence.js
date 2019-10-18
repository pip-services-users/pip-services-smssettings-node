"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_mongoose_node_1 = require("pip-services3-mongoose-node");
const SmsSettingsMongooseSchema_1 = require("./SmsSettingsMongooseSchema");
class SmsSettingsMongoDbPersistence extends pip_services3_mongoose_node_1.IdentifiableMongoosePersistence {
    constructor() {
        super('sms_settings', SmsSettingsMongooseSchema_1.SmsSettingsMongooseSchema());
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