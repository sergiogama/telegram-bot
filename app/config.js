
var config = {};

config.conversation = {};
config.texttospeech = {};
config.speechtotext = {};
config.telegram = {};

// Config Conversation
config.conversation.workspace = 'workspace';
config.conversation.username = 'username';
config.conversation.password = 'password';
config.conversation.versiond = '2017-04-04';

// Config Text to Speech
config.texttospeech.username = 'username';
config.texttospeech.password = 'password';
config.texttospeech.voice = "pt-BR_IsabelaVoice";

// Config Speech to Text
config.speechtotext.username = 'username';
config.speechtotext.password = 'password';

// Telegram apikey
config.telegram.apikey = "apikey";

module.exports = config;