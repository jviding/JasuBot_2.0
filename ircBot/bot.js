var irc = require('irc');

module.exports = function Bot(name, server, channel, callback) {
  var botname = name;
  var ircserver = server;
  var ircchannel = channel;

  var newMessageRead = callback;
  var bot;

  function startBot() {
    console.log(botname+" starting...");
    console.log(botname + " travelling to " + ircserver + "...");
    bot = new irc.Client(ircserver, botname, {
      userName: botname,
      realName: 'mr.Robot',
      autoRejoin: true,
      autoConnect: false
    });
    bot.connect(5, function(input) {
      console.log("Connection to " + ircserver + " established!");
      bot.join(channel, function(input) {
        console.log("Joined channel " + ircchannel);
        addListeners();
      });
    });
  };

  function disconnectBot() {
    console.log("Disconnecting from " + server + "...");
    bot.disconnect("Disconnected from " + server + ".");
  };

  function addListeners() {
    bot.addListener('message', function(from, to, text) {
      newMessageRead({user: from, channel: to, message: text , time: new Date().getTime()});
    });
    bot.addListener('topic', function(channel, topic, changer) {
      if (topic === false) {
        var message = changer + ' has removed the topic of ' + channel + '.';
        newMessageRead({user: null, channel: channel, message: message , time: new Date().getTime()});
      }
      else {
        var message = changer + ' changed the topic of ' + channel + ' to: ' + topic;
        newMessageRead({user: null, channel: channel, message: message , time: new Date().getTime()});
      }
    });
    bot.addListener('names', function(channel, nicks) {
      newMessageRead({user: null, channel: channel, message: JSON.stringify(nicks), time: new Date().getTime()});
    });
    bot.addListener('notice', function(nick, to, text, message) {
      var message = nick + ': [Notice(' + to + ')]: ' + text;
      newMessageRead({user: null, channel: channel, message: message, time: new Date().getTime()});
    });
    bot.addListener('whois', function(nick) {
      newMessageRead({user: null, channel: channel, message: JSON.stringify(nick), time: new Date().getTime()});
    });
    bot.addListener('action', function(from, to, text, message) {
      var message = ' * ' + from + ' ' + text;
      newMessageRead({user: null, channel: channel, message: message, time: new Date().getTime()});
    });
    bot.addListener('error', function(message) {
      console.log('error: ', message);
    });
  };

  // Exported commands
  function writeIRCMessage(username, message) {
    if (message.split(' ')[0] === '/n' || message.split(' ')[0] === '/names') {
      return bot.send('names', channel);
    }
    else if (message.split(' ')[0] === '/whois' && message.split(' ')[1] != null) {
      return bot.send('whois', message.split(' ')[1]);
    }
    if (username === null) {
      bot.say(channel, message);
    }
    else {
      var line = '[' + username + ']: ' + message;
      bot.say(channel, line);
    }
  };

  // Print to web + irc
  function botsay(message) {
    bot.say(channel, message);
    newMessageRead({ user: null, channel: channel, message: message, time: new Date().getTime()});
  };

  return {
    kickStart: startBot,
    disconnect: disconnectBot,
    writeMessage: writeIRCMessage
  };
};