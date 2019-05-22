import { Schema } from 'mongoose';
let Mixed = Schema.Types.Mixed;

export let SmsSettingsMongooseSchema = function(collection?: string) {
    collection = collection || 'sms_settings';

    let schema = new Schema(
        {
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
        },
        {
            collection: collection,
            autoIndex: true,
            strict: true
        }
    );

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
}