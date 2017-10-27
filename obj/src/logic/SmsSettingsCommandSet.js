"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const SmsSettingsV1Schema_1 = require("../data/version1/SmsSettingsV1Schema");
class SmsSettingsCommandSet extends pip_services_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeGetSettingsByIdsCommand());
        this.addCommand(this.makeGetSettingsByIdCommand());
        this.addCommand(this.makeGetSettingsBySmsSettingsCommand());
        this.addCommand(this.makeSetSettingsCommand());
        this.addCommand(this.makeSetRecipientCommand());
        this.addCommand(this.makeSetSubscriptionsCommand());
        this.addCommand(this.makeDeleteSettingsByIdCommand());
        this.addCommand(this.makeResendVerificationCommand());
        this.addCommand(this.makeVerifySmsCommand());
    }
    makeGetSettingsByIdsCommand() {
        return new pip_services_commons_node_2.Command("get_settings_by_ids", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('recipient_ids', new pip_services_commons_node_4.ArraySchema(pip_services_commons_node_5.TypeCode.String)), (correlationId, args, callback) => {
            let recipientIds = args.get("recipient_ids");
            this._logic.getSettingsByIds(correlationId, recipientIds, callback);
        });
    }
    makeGetSettingsByIdCommand() {
        return new pip_services_commons_node_2.Command("get_settings_by_id", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services_commons_node_5.TypeCode.String), (correlationId, args, callback) => {
            let recipientId = args.getAsNullableString("recipient_id");
            this._logic.getSettingsById(correlationId, recipientId, callback);
        });
    }
    makeGetSettingsBySmsSettingsCommand() {
        return new pip_services_commons_node_2.Command("get_settings_by_phone", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('phone', pip_services_commons_node_5.TypeCode.String), (correlationId, args, callback) => {
            let phone = args.getAsNullableString("phone");
            this._logic.getSettingsByPhoneSettings(correlationId, phone, callback);
        });
    }
    makeSetSettingsCommand() {
        return new pip_services_commons_node_2.Command("set_settings", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('settings', new SmsSettingsV1Schema_1.SmsSettingsV1Schema()), (correlationId, args, callback) => {
            let settings = args.get("settings");
            this._logic.setSettings(correlationId, settings, callback);
        });
    }
    makeSetRecipientCommand() {
        return new pip_services_commons_node_2.Command("set_recipient", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services_commons_node_5.TypeCode.String)
            .withOptionalProperty('name', pip_services_commons_node_5.TypeCode.String)
            .withOptionalProperty('phone', pip_services_commons_node_5.TypeCode.String)
            .withOptionalProperty('language', pip_services_commons_node_5.TypeCode.String), (correlationId, args, callback) => {
            let recipientId = args.getAsString("recipient_id");
            let name = args.getAsString("name");
            let phone = args.getAsString("phone");
            let language = args.getAsString("language");
            this._logic.setRecipient(correlationId, recipientId, name, phone, language, callback);
        });
    }
    makeSetSubscriptionsCommand() {
        return new pip_services_commons_node_2.Command("set_subscriptions", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services_commons_node_5.TypeCode.String)
            .withRequiredProperty('subscriptions', pip_services_commons_node_5.TypeCode.Map), (correlationId, args, callback) => {
            let recipientId = args.getAsString("recipient_id");
            let subscriptions = args.get("subscriptions");
            this._logic.setSubscriptions(correlationId, recipientId, subscriptions, callback);
        });
    }
    makeDeleteSettingsByIdCommand() {
        return new pip_services_commons_node_2.Command("delete_settings_by_id", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services_commons_node_5.TypeCode.String), (correlationId, args, callback) => {
            let recipientId = args.getAsNullableString("recipient_id");
            this._logic.deleteSettingsById(correlationId, recipientId, (err) => {
                callback(err, null);
            });
        });
    }
    makeResendVerificationCommand() {
        return new pip_services_commons_node_2.Command("resend_verification", null, (correlationId, args, callback) => {
            let recipientId = args.getAsString("recipient_id");
            this._logic.resendVerification(correlationId, recipientId, (err) => {
                callback(err, null);
            });
        });
    }
    makeVerifySmsCommand() {
        return new pip_services_commons_node_2.Command("verify_phone", new pip_services_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services_commons_node_5.TypeCode.String), (correlationId, args, callback) => {
            let recipientId = args.getAsString("recipient_id");
            let code = args.getAsString("code");
            this._logic.verifyPhone(correlationId, recipientId, code, (err) => {
                callback(err, null);
            });
        });
    }
}
exports.SmsSettingsCommandSet = SmsSettingsCommandSet;
//# sourceMappingURL=SmsSettingsCommandSet.js.map