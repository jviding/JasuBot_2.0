var Timer = require('./timer');
var Menu = require('./getMenu');
var Weather = require('./getWeather');

module.exports = function(name, setBotsay) {

  var name = name;
  var botsay = setBotsay;

  //Set timer
  Timer.atMidNight(function(){
    printNewsCast();
  });

function printNewsCast() {
    botsay("Beep.... Beep...");
    botsay(name + " preparing to broadcast.");
    botsay("...");
    printStatusToIRC();
};

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
}

  return {
      printMenu : printMenuToIRC,
      printWeather : printWeatherToIRC
  }
};