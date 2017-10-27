let _ = require('lodash');
let assert = require('chai').assert;

let pluginOptions = {
    logger: {
        level: 'debug'
    },
    persistence: {
        type: 'memory'
    },
    service: {
        connection: {
            protocol: 'none'
        }
    }
};

suite('SmsSettingsSenecaPlugin', ()=> {
    let seneca;

    suiteSetup((done) => {
        seneca = require('seneca')({ strict: { result: false } });

        // Load Seneca plugin
        let plugin = require('../../src/container/SmsSettingsSenecaPlugin');
        seneca.use(plugin, pluginOptions);

        seneca.ready(done);
    });

    suiteTeardown((done) => {
        seneca.close(done);
    });

    test('Ping', (done) => {
        seneca.act(
            {
                role: 'sms_settings',
                cmd: 'get_settings_by_id',
                recipient_id: '123'
            },
            (err, settings) => {
                assert.isNull(err);
                done();
            }
        );
    });
});