var Bot = require('./../ircBot/bot');

module.exports = function Jasubot(botname, ircServer, ircChannel, quakeServer, quakeChannel) {

  //bot             //nickname, server to connect, channel to join
  var ircbot = new Bot(botname,ircServer,ircChannel);
  var quakebot = new Bot(botname,quakeServer,quakeChannel);

  var msgToParent = null;

  ircbot.kickStart();
  ircbot.setMessageReader(function (message) {
    if (msgToParent) {
      msgToParent(message);
    }
  });

  quakebot.kickStart();
  quakebot.setMessageReader(function (message) {
    if (msgToParent) {
      msgToParent(message);
    }
  });

  function botSays(message, callback) {
    try {
      if (message['channel'] === ircChannel) {
        ircbot.writeMessage(message['user'], message['message']);
      }
      else if (message['channel'] === quakeChannel) {
        quakebot.writeMessage(message['user'], message['message']);
      }
    }
    catch (err) {
      console.log('Bot failed to send a message to ' + message['channel'] + '...\n'+err.message);
    }
  };

  function botSaid(callback) {
    msgToParent = callback;
  };

  function restartBot(channel) {
      if (channel === ircChannel) {
        disconnectBot(ircbot);
        ircbot.kickStart();
      }
      else if (channel === quakeChannel) {
        disconnectBot(quakebot);
        quakebot.kickStart();
      }
  };

  function disconnectBot(bot) {
    try {
      bot.disconnect();
    }
    catch (err) {
      console.log("Disconnecting failed.\n" + err.message);
    }
  };

  return {
    botSays: botSays,
    botSaid: botSaid,
    botRestart: restartBot
  }

};