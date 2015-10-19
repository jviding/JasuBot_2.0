var Bot = require('./../ircBot/bot');

module.exports = function Jasubot(botname, ircServer, ircChannel, quakeServer, quakeChannel) {

  //bot             //nickname, server to connect, channel to join
  var ircbot = new Bot(botname,ircServer,ircChannel);
  var quakebot = new Bot(botname,quakeServer,quakeChannel);

  var msgToParent = null;

  ircbot.kickStart();
  ircbot.setMessageReader(function(message) {
    if (msgToParent) {
      msgToParent(message);
    }
  });

  quakebot.kickStart();
  quakebot.setMessageReader(function(message) {
    if (msgToParent) {
      msgToParent(message);
    }
  });

  function botSays(message, callback) {
    if (message['channel'] === ircChannel) {
      ircbot.writeMessage(message['user'], message['message']);
    }
    else if (message['channel'] === quakeChannel) {
      quakebot.writeMessage(message['user'], message['message']);
    }
  };

  function botSaid(callback) {
    msgToParent = callback;
  };

  return {
    botSays: botSays,
    botSaid: botSaid
  }

};