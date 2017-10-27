# Sms Settings Microservice

This is a sms settings microservice from Pip.Services library. 
This microservice keeps settings of sms recipients.

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca

This microservice has optional dependencies on the following microservices:
- [pip-services-activities-node](https://github.com/pip-services-users/pip-services-activities-node) - to log user activities
- [pip-services-msgtemplates-node](https://github.com/pip-services-content/pip-services-msgtemplates-node) - to get message templates
- [pip-services-smsdelivery-node](https://github.com/pip-services-infrastructure/pip-services-smsdelivery-node) - to send sms messages

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-users/pip-clients-smssettings-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class SmsSettingsV1 implements IStringIdentifiable {
    /* Recipient information */
    public id: string;
    public name: string;
    public sms: string;
    public language: string;

    /* SmsSettings management */
    public subscriptions: any;
    public verified: boolean;
    public ver_code: string;
    public ver_expire_time: Date;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}

interface ISmsSettingsV1 {
    getSettingsById(correlationId: string, recipientId: string,
        callback: (err: any, settings: SmsSettingsV1) => void): void;
    getSettingsBySmsSettings(correlationId: string, sms: string,
        callback: (err: any, settings: SmsSettingsV1) => void): void;
    setSettings(correlationId: string, settings: SmsSettingsV1,
        callback?: (err: any, settings: SmsSettingsV1) => void): void;
    setRecipient(correlationId: string, recipientId: string,
        name: string, sms: string, language: string,
        callback?: (err: any, settings: SmsSettingsV1) => void): void;
    setSubscriptions(correlationId: string, recipientId: string, subscriptions: any,
        callback?: (err: any, settings: SmsSettingsV1) => void): void;
    deleteSettingsById(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void;
    resendVerification(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void;
    verifySmsSettings(correlationId: string, recipientId: string, code: string,
        callback?: (err: any) => void): void;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-users/pip-services-smssettings-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 
Example of microservice configuration
```yaml
---
- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-smssettings:persistence:file:default:1.0"
  path: "./data/sms_settings.json"

- descriptor: "pip-services-smssettings:controller:default:default:1.0"
  
- descriptor: "pip-services-smssettings:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "pip-clients-smssettings-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('pip-clients-smssettings-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.SmsSettingsHttpClientV1(config);

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    }
    
    // Work with the microservice
    ...
});
```

Now the client is ready to perform operations
```javascript
// Send sms message to address
client.sendMessage(
    null,
    { 
        to: 'somebody@somewhere.com',
        subject: 'Test',
        text: 'This is a test message. Please, ignore it'
    },
    function (err) {
        ...
    }
);
```

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.

