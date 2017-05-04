var watson = require('watson-developer-cloud');
var request = require('request');
var config = require('./config');

var STT = {};

var speech_to_text = watson.speech_to_text({
    version: 'v1',
    username: config.speechtotext.username,
    password: config.speechtotext.password
});

STT.telegramVoice = function(link, callback) {
    paramsTelegram = {
        model: 'pt-BR_BroadbandModel',
        content_type: 'audio/ogg;codecs=opus',
        continuous: true,
        interim_results: false
    };

    var recognizeStream = speech_to_text.createRecognizeStream(paramsTelegram);
    recognizeStream.setEncoding('utf8');
    recognizeStream.on('results', function(data) {
        if (data && data.results && data.results.length > 0 && data.results[0].alternatives && data.results[0].alternatives.length > 0) {
            var result = data.results[0].alternatives[0].transcript;
            callback(null, result);
        }
    });

    ['data', 'error', 'connection-close'].forEach(function(eventName) {
        recognizeStream.on(eventName, console.log.bind(console, eventName + ' event: '));
    });

    //pipe voice message to recognizer -> send to watson
    request(link).pipe(recognizeStream);
}

module.exports = STT;