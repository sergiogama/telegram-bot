var express = require('express');
var cfenv = require('cfenv');
var watson = require('watson-developer-cloud');
var tbot = require('node-telegram-bot-api');

var config = require('./app/config');
var conversation = require('./app/conversation');
var tts = require('./app/texttospeech');
var stt = require('./app/speechtotext');

var app = express();
app.use(express.static('./public'));
var appEnv = cfenv.getAppEnv();

var telegramBot = new tbot(config.telegram.apikey, {
    polling: true
});

var dict = new Dictionary();
telegramBot.on('message', function(msg) {
    if (msg['voice']) {
        var chatId = msg.chat.id;
        telegramBot.getFileLink(msg.voice.file_id).then(function(voiceUrl) {
            stt.telegramVoice(voiceUrl, function(err, resposta) {
                var payload = {
                    workspace_id: {},
                    context: {},
                    input: {
                        text: resposta.toString()
                    }
                };
                payload.context = dict.find(chatId);

                conversation.call(payload, function(res) {
                    dict.add(chatId, res.context);
                    tts.sintetizar(res.output.text[0], function() {
                        telegramBot.sendVoice(chatId, 'voice-audio.ogg');
                    });
                });
            });
        });
    } else {
        var chatId = msg.chat.id;
        var payload = {
            workspace_id: {},
            context: {},
            input: msg
        };
        payload.context = dict.find(chatId);
        if (payload.input.text.toLowerCase() == "/start") {
            dict.remove(chatId);
            payload.context = {}
        }
        conversation.call(payload, function(resposta) {
            dict.add(chatId, resposta.context);
            telegramBot.sendMessage(chatId, resposta.output.text[0]);
        });
    }

});

function Dictionary() {
    //www.java2s.com
    this.datastore = new Array();
    this.add = add;
    this.datastore = new Array();
    this.find = find;
    this.remove = remove;
}

function add(key, value) {
    this.datastore[key] = value;
}

function find(key) {
    return this.datastore[key];
}

function remove(key) {
    delete this.datastore[key];
}

app.listen(3000, function() {
    console.log("server starting on " + appEnv.url);
});