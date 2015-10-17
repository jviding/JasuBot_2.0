var irc = require('irc');
var Control = require('./functions/controls');

module.exports = function Bot(name, server, channel) {
  var botname = name;
  var ircserver = server;
  var ircchannel = channel;

  var printToWeb;
  var bot;
  var ctrl;

  function startBot() {
    console.log("Bot starting...");
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

  function addListeners() {
    bot.addListener('message', function(from, to, text) {
      printToWeb({user: from, channel: to, message: text , time: new Date().getTime()});
      readCommand(text);
    });
    bot.addListener('topic', function(channel, topic, changer) {
      if (topic === false) {
        var message = changer + ' has removed the topic of ' + channel + '.';
        printToWeb({user: null, channel: channel, message: message , time: new Date().getTime()});
      }
      else {
        var message = changer + ' changed the topic of ' + channel + ' to: ' + topic;
        printToWeb({user: null, channel: channel, message: message , time: new Date().getTime()});
      }
    });
    bot.addListener('names', function(channel, nicks) {
      printToWeb({user: 'Bot', channel: channel, message: JSON.stringify(nicks), time: new Date().getTime()});
    });
    bot.addListener('notice', function(nick, to, text, message) {
      var message = nick + ': [Notice(' + to + ')]: ' + text;
      printToWeb({user: null, channel: channel, message: message, time: new Date().getTime()});
    });
    bot.addListener('whois', function(nick) {
      printToWeb({user: 'Bot', channel: channel, message: JSON.stringify(nick), time: new Date().getTime()});
    });
    bot.addListener('action', function(from, to, text, message) {
      var message = ' * ' + from + ' ' + text;
      printToWeb({user: null, channel: channel, message: message, time: new Date().getTime()});
    });
    bot.addListener('error', function(message) {
      console.log('error: ', message);
    });
  };

  function readCommand(inp) {
    if(inp.toLowerCase()==="jasu mitä ruokaa") {
      ctrl.printMenu();
    }
    else if(inp.toLowerCase()==="jasu mikä sää") {
      ctrl.printWeather();
    }
    else if(inp.toLowerCase()==="jasu help") {
      botsay("'jasu mikä sää' for weather information.");
      botsay("'jasu mitä ruokaa' for lunch information.");
    }
  };

  // Exported commands
  function setMessageReader(callback) {
    printToWeb = callback;
  };
  function writeIRCMessage(username, message) {
    if (message.split(' ')[0] === '/n' || message.split(' ')[0] === '/names') {
      return bot.send('names', channel);
    }
    else if (message.split(' ')[0] === '/whois' && message.split(' ')[1] != null) {
      return bot.send('whois', message.split(' ')[1]);
    }
    var line = '[' + username + ']: ' + message;
    bot.say(channel, line);
    readCommand(message);
  };

  // Print to web + irc
  function botsay(message) {
    bot.say(channel, message);
    printToWeb({
      user:'Bot',
      channel:channel,
      message:message,
      time: new Date().getTime()
    });
  };

  //set botsay
  ctrl = new Control(name, botsay);

  return {
    kickStart: startBot,
    setMessageReader: setMessageReader,
    writeMessage: writeIRCMessage
  };
};