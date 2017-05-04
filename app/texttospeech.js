var watson = require('watson-developer-cloud');
var fs = require('fs');
var config = require('./config');

var TTS = {};

var text_to_speech = watson.text_to_speech({
    version: 'v1',
    username: config.texttospeech.username,
    password: config.texttospeech.password
});

TTS.sintetizar = function(message, callback) {
    	
    	var params = {
        text: message,
        voice: config.texttospeech.voice,
        accept: 'audio/ogg'
    };

    text_to_speech.synthesize(params).on('error', function(error) {
        console.log('Error:', error);
}).pipe(fs.createWriteStream('voice-audio.ogg'))
      .on('finish', function(){
        callback();
        });
}

module.exports = TTS;