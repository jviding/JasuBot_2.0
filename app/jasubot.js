var Bot = require('./../ircBot/bot');
var Commands = require('./../jasuCmd/main');

module.exports = function Jasubot(botname, ircServer, ircChannel, quakeServer, quakeChannel, callback) {

  var cmd = new Commands(botname, function (channel, messages) {
    messages.forEach(function (message) {
      var line = {user:null, channel:channel, message:message, time: new Date().getTime()};
      callback(line);
      botSays(line);
    });
  });

  //bot             //nickname, server to connect, channel to join
  var ircbot = new Bot(botname,ircServer,ircChannel, function (message) {
    callback(message);
    cmd.command(message.channel, message.message);
  });
  var quakebot = new Bot(botname,quakeServer,quakeChannel, function (message) {
    callback(message);
    cmd.command(message.channel, message.message);
  });

  ircbot.kickStart();
  quakebot.kickStart();

  function botSays(message) {
    try {
      if (message['channel'] === ircChannel) {
        ircbot.writeMessage(message['user'], message['message']);
      }
      else if (message['channel'] === quakeChannel) {
        quakebot.writeMessage(message['user'], message['message']);
      }
      else if (message['channel'] === 'all') {
        ircbot.writeMessage(message['user'], message['message']);
        quakebot.writeMessage(message['user'], message['message']);
      }
      cmd.command(message['channel'], message['message']);
    }
    catch (err) {
      console.log('Bot failed to send a message to ' + message['channel'] + '...\n'+err.message);
    }
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
    botRestart: restartBot
  }

};