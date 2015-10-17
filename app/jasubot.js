var Bot = require('./../ircBot/bot');
var Msg = require('./models/message');

module.exports = function Jasubot(botname, ircServer, ircChannel, quakeServer, quakeChannel, io) {

  //bot             //nickname, server to connect, channel to join
  var ircbot = new Bot(botname,ircServer,ircChannel);
  var quakebot = new Bot(botname,quakeServer,quakeChannel);

  ircbot.kickStart();
  ircbot.setMessageReader(function(message) {
    io.emit('chat message', message);
    saveMsg(message);
  });

  quakebot.kickStart();
  quakebot.setMessageReader(function(message) {
    io.emit('chat message', message);
    saveMsg(message);
  });

  function saveMsg(msg) {
    new Msg(msg).save();
  };

  function botSays(message) {
    if (message['channel'] === ircChannel) {
      ircbot.writeMessage(message['user'], message['message']);
    }
    else if (message['channel'] === quakeChannel) {
      quakebot.writeMessage(message['user'], message['message']);
    }
    saveMsg(message);
  };

  function botSaid(callback) {
    Msg.find(function (err, messages, count) {
          callback(messages);
    });
  };

  return {
    botSays: botSays,
    botSaid: botSaid
  }

};