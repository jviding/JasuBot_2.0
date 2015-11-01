var Timer = require('./functions/timer');
var Menu = require('./functions/getMenu');
var Weather = require('./functions/getWeather');

module.exports = function Commands(botname, callback) {

	var name = botname;
	var botsay = callback;

	//Set timer
	Timer.atMidNight(function(){
		printNewsCast();
	});

	function printNewsCast() {
		var lines = [];
    	lines.push("Beep.... Beep...");
    	lines.push(name + " preparing to broadcast.");
    	lines.push("...");
    	printStatusToIRC(lines);
	};

	function printMenuToIRC(channel) {
		var lines = [];
	  	Menu.menuToday(function (result) {
	    	result.forEach(function (item) {
	      		lines.push(item);
	    	});
	    	botsay(channel, lines);
	  	});
	};

	function printWeatherToIRC(city, channel) {
		var lines = [];
	  	Weather.weatherStory(city, function (result) {
	    	result.forEach(function (item) {
	    	  	lines.push(item);
	    	});
	    	botsay(channel, lines);
	  	});
	};

	function printStatusToIRC(lines) {
	  Weather.weatherToday(function (result) {
	    result.forEach(function (item) {
	      lines.push(item);
	    });
	    lines.push("...");
	    Menu.menuToday(function (result) {
	      result.forEach(function (item) {
	        lines.push(item);
	      });
	      lines.push("...");
	      lines.push("Beep... Over...");
	      botsay('all', lines);
	    });
	  });
	};

	function readCommand(channel, inp) {
		var args = inp.toLowerCase().split(' ');
	    if(args[0] === 'jasu' && args[1] === 'mitä' && args[2] === 'ruokaa') {
	      printMenuToIRC(channel);
	    }
	    else if(args[0] === 'jasu' && args[1] === 'mikä' && args[2] === 'sää' && args[3] === undefined) {
	      printWeatherToIRC('Helsinki', channel);
	    }
	    else if(args[0] === 'jasu' && args[1] === 'mikä' && args[2] === 'sää' && args[3] !== 'pietari') {
	      var city = args[3].charAt(0).toUpperCase() + '' + args[3].toLowerCase().substr(1);
	      printWeatherToIRC(city, channel);
	    }
	    else if(args[0] === 'jasu' && args[1] === 'mikä' && args[2] === 'sää' && args[3] === 'pietari') {
	      printWeatherToIRC('Saint_Petersburg', channel);
	    }
	    else if(args[0] === 'jasu' && args[1] === 'help') {
	    	var lines = [];
	      	lines.push("'jasu mikä sää' for weather information.");
	      	lines.push("'jasu mikä sää <City>' for specific weather information.");
	      	lines.push("'jasu mitä ruokaa' for lunch information.");
	      	botsay(channel, lines);
	    }
  	};

  return {
      command: readCommand
  }
};