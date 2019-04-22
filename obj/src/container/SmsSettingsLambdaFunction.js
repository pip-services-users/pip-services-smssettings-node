"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const SmsSettingsServiceFactory_1 = require("../build/SmsSettingsServiceFactory");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
const pip_clients_activities_node_1 = require("pip-clients-activities-node");
class SmsSettingsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("sms_settings", "Sms settings function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-smssettings', 'controller', 'default', '*', '*'));
        this._factories.add(new SmsSettingsServiceFactory_1.SmsSettingsServiceFactory());
        this._factories.add(new pip_clients_sms_node_1.SmsClientFactory());
        this._factories.add(new pip_clients_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new pip_clients_activities_node_1.ActivitiesClientFactory());
    }
}
exports.SmsSettingsLambdaFunction = SmsSettingsLambdaFunction;
exports.handler = new SmsSettingsLambdaFunction().getHandler();
//# sourceMappingURL=SmsSettingsLambdaFunction.js.map