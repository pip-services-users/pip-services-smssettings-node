"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let Mixed = mongoose_1.Schema.Types.Mixed;
exports.SmsSettingsMongoDbSchema = function (collection) {
    collection = collection || 'sms_settings';
    let schema = new mongoose_1.Schema({
        /* Identification */
        _id: { type: String },
        phone: { type: String, required: true, index: true },
        name: { type: String, required: false },
        language: { type: String, required: false },
        /* SmsSettings management */
        verified: { type: Boolean, required: true, 'default': false },
        ver_code: { type: String, required: false },
        ver_expire_time: { type: Date, required: false },
        subscriptions: { type: Mixed, required: false },
        /* Custom fields */
        custom_hdr: { type: Mixed, required: false },
        custom_dat: { type: Mixed, required: false }
    }, {
        collection: collection,
        autoIndex: true,
        strict: true
    });
    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            // delete ret.ver_code;
            return ret;
        }
    });
    return schema;
};
//# sourceMappingURL=SmsSettingsMongoDbSchema.js.map