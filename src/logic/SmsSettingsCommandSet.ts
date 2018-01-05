import { CommandSet } from 'pip-services-commons-node';
import { ICommand } from 'pip-services-commons-node';
import { Command } from 'pip-services-commons-node';
import { Schema } from 'pip-services-commons-node';
import { Parameters } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ObjectSchema } from 'pip-services-commons-node';
import { ArraySchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';

import { SmsSettingsV1Schema } from '../data/version1/SmsSettingsV1Schema';
import { SmsSettingsV1 } from '../data/version1/SmsSettingsV1';
import { ISmsSettingsController } from './ISmsSettingsController';

export class SmsSettingsCommandSet extends CommandSet {
    private _logic: ISmsSettingsController;

    constructor(logic: ISmsSettingsController) {
        super();

        this._logic = logic;

		this.addCommand(this.makeGetSettingsByIdsCommand());
		this.addCommand(this.makeGetSettingsByIdCommand());
		this.addCommand(this.makeGetSettingsBySmsSettingsCommand());
		this.addCommand(this.makeSetSettingsCommand());
		this.addCommand(this.makeSetVerifiedSettingsCommand());
		this.addCommand(this.makeSetRecipientCommand());
		this.addCommand(this.makeSetSubscriptionsCommand());
		this.addCommand(this.makeDeleteSettingsByIdCommand());
		this.addCommand(this.makeResendVerificationCommand());
		this.addCommand(this.makeVerifySmsCommand());
    }

	private makeGetSettingsByIdsCommand(): ICommand {
		return new Command(
			"get_settings_by_ids",
			new ObjectSchema(true)
				.withRequiredProperty('recipient_ids', new ArraySchema(TypeCode.String)),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientIds = args.get("recipient_ids");
                this._logic.getSettingsByIds(correlationId, recipientIds, callback);
            }
		);
	}

	private makeGetSettingsByIdCommand(): ICommand {
		return new Command(
			"get_settings_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('recipient_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientId = args.getAsNullableString("recipient_id");
                this._logic.getSettingsById(correlationId, recipientId, callback);
            }
		);
	}

	private makeGetSettingsBySmsSettingsCommand(): ICommand {
		return new Command(
			"get_settings_by_phone",
			new ObjectSchema(true)
				.withRequiredProperty('phone', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let phone = args.getAsNullableString("phone");
                this._logic.getSettingsByPhoneSettings(correlationId, phone, callback);
            }
		);
	}

	private makeSetSettingsCommand(): ICommand {
		return new Command(
			"set_settings",
			new ObjectSchema(true)
				.withRequiredProperty('settings', new SmsSettingsV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let settings = args.get("settings");
                this._logic.setSettings(correlationId, settings, callback);
            }
		);
	}

	private makeSetVerifiedSettingsCommand(): ICommand {
		return new Command(
			"set_verified_settings",
			new ObjectSchema(true)
				.withRequiredProperty('settings', new SmsSettingsV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let settings = args.get("settings");
                this._logic.setVerifiedSettings(correlationId, settings, callback);
            }
		);
	}

	private makeSetRecipientCommand(): ICommand {
		return new Command(
			"set_recipient",
			new ObjectSchema(true)
				.withRequiredProperty('recipient_id', TypeCode.String)
				.withOptionalProperty('name', TypeCode.String)
				.withOptionalProperty('phone', TypeCode.String)
				.withOptionalProperty('language', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientId = args.getAsString("recipient_id");
                let name = args.getAsString("name");
                let phone = args.getAsString("phone");
                let language = args.getAsString("language");
                this._logic.setRecipient(correlationId, recipientId, name, phone, language, callback);
            }
		);
	}

	private makeSetSubscriptionsCommand(): ICommand {
		return new Command(
			"set_subscriptions",
			new ObjectSchema(true)
				.withRequiredProperty('recipient_id', TypeCode.String)
				.withRequiredProperty('subscriptions', TypeCode.Map),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientId = args.getAsString("recipient_id");
                let subscriptions = args.get("subscriptions");
                this._logic.setSubscriptions(correlationId, recipientId, subscriptions, callback);
            }
		);
	}
	
	private makeDeleteSettingsByIdCommand(): ICommand {
		return new Command(
			"delete_settings_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('recipient_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientId = args.getAsNullableString("recipient_id");
                this._logic.deleteSettingsById(correlationId, recipientId, (err) => {
					callback(err, null);
				});
			}
		);
	}

	private makeResendVerificationCommand(): ICommand {
		return new Command(
			"resend_verification",
			null,
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientId = args.getAsString("recipient_id");
                this._logic.resendVerification(correlationId, recipientId, (err) => {
					callback(err, null);
				});
            }
		);
	}

	private makeVerifySmsCommand(): ICommand {
		return new Command(
			"verify_phone",
			new ObjectSchema(true)
				.withRequiredProperty('recipient_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let recipientId = args.getAsString("recipient_id");
                let code = args.getAsString("code");
                this._logic.verifyPhone(correlationId, recipientId, code, (err) => {
					callback(err, null);
				});
            }
		);
	}

}