var Menu = require('./getMenu');
var Timer = require('./timer');
var Weather = require('./getWeather');
var irc = require('irc');

function Bot(name, server, channel) {
  var botname = name;
  var ircServer = server;
  var channel = channel;

  var printToWeb;
  var bot;

  function addListeners() {
    bot.addListener('message', function(from, to, text) {
      var msg = {
        user: from,
        channel: to,
        message: text,
        time: new Date().getTime()
      }
      printToWeb(msg);
      readCommand(text);
    });
    Timer.atMidNight(function(){
      printNewsCast();
    });
  };


  function readCommand(inp) {
    if(inp.toLowerCase()==="jasu mitä ruokaa") {
      printMenuToIRC();
    }
    else if(inp.toLowerCase()==="jasu mikä sää") {
      printWeatherToIRC();
    }
    else if(inp.toLowerCase()==="jasu help") {
      botsay("'jasu mikä sää' for weather information.");
      botsay("'jasu mitä ruokaa' for lunch information.");
    }
  };

  function printNewsCast() {
    botsay("Beep.... Beep...");
    botsay("Jausnator preparing to broadcast.");
    botsay("...");
    printStatusToIRC();
  }

  function printMenuToIRC() {
    Menu.menuToday(function(result) {
      result.forEach(function(item) {
        botsay(item);
      });
    });
  };

  function printWeatherToIRC() {
    Weather.weatherStory(function(result) {
      result.forEach(function(item) {
        botsay(item);
      });
    });
  };

  function printStatusToIRC() {
    Weather.weatherToday(function(result) {
      result.forEach(function(item) {
        botsay(item);
      });
      botsay("...");
      botsay("Food service today:");
      Menu.menuToday(function(result) {
        var end = false;
        result.forEach(function(item) {
          botsay(item);
          if(item.indexOf("Chemicum") !== -1) {
            end = true;
          }
        });
        if(end === true) {
          botsay("...");
          botsay("Beep... Over...");
        }
      });
    });
  };

  // Exported commands
  function setMessageReader(callback) {
    printToWeb = callback;
  };
  function writeIRCMessage(message) {
    bot.say(channel, message);
    readCommand(message);
  };

  function startBot() {
    console.log("Bot starting...");
    console.log(botname+" travelling to "+ircServer+"...");
    bot = new irc.Client(ircServer, botname, {
      autoConnect: false
    });
    bot.connect(5, function(input) {
      console.log("Connection to " + ircServer + " established!");
      bot.join(channel, function(input) {
        console.log("Joined channel "+channel);
        addListeners();
      });
    });
  }

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

  return {
    kickStart: startBot,
    setMessageReader: setMessageReader,
    writeMessage: writeIRCMessage
  }
}

module.exports = Bot;