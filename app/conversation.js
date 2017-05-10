var wdc = require('watson-developer-cloud');
var config = require('./config');

var conversation = {};

var wdc_conversation = wdc.conversation({
    username: config.conversation.username,
    password: config.conversation.password,
    version: 'v1',
    version_date: config.conversation.versiond
});

var workspace = config.conversation.workspace;

conversation.call = function(payload, callback) {
    payload.workspace_id = workspace;

    wdc_conversation.message(payload, function(err, res) {
        if (err) {
            console.log('error:' + err);
            return;
        }
        callback(res);
    });
}

module.exports = conversation;