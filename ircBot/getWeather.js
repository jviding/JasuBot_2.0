var DateStr = require('./dateStr');
var http = require('http');

var url = 'http://api.wunderground.com/api/9a7a2a9326a64bf5/forecast/q/CA/Helsinki.json';

module.exports = {
  weatherToday: function(callback) {
    getJsonToday(callback, 0);
  },
  weatherStory: function(callback) {
    getJsonToday(callback, 1);
  }
}

function getJsonToday(callback, opt) {
	http.get(url, function(res) {
    	var body = '';
    	res.on('data', function(chunk) {
        	body += chunk;
    	});
    	res.on('end', function() {
        try {
          createStringArray(JSON.parse(body), opt, callback);
        }
        catch(err) {
          callback(['No weather data available.']);
        }
    	});
    }).on('error', function(e) {
      	console.log("Got error: ", e);
    });
}

function createStringArray(data, opt, callback) {
	var array = [];
  if (opt === 0) {
    var conditions = data['forecast']['simpleforecast']['forecastday'][0]['conditions'];
    var dayhigh = data['forecast']['simpleforecast']['forecastday'][0]['high']['celsius'];
    var daylow = data['forecast']['simpleforecast']['forecastday'][0]['low']['celsius'];
    var windave = data['forecast']['simpleforecast']['forecastday'][0]['avewind']['kph'];
    var windmax = data['forecast']['simpleforecast']['forecastday'][0]['maxwind']['kph'];
    var humidity = data['forecast']['simpleforecast']['forecastday'][0]['avehumidity'];
    array.push("Weather in Helsinki today:");
    array.push("   "+conditions);
    array.push("   Min:  "+checkPlus(daylow)+"°C    Max:  "+checkPlus(dayhigh)+"°C");
    array.push("   Wind: "+toMPS(windave)+"m/s   Max:  "+toMPS(windmax)+"m/s");
    array.push("   Humidity: "+humidity+"%");
    array.push("Type 'jasu mikä sää' for more...")
    callback(array);
  }
  else {
    var firstDay = data['forecast']['txt_forecast']['forecastday'][0];
    var night = data['forecast']['txt_forecast']['forecastday'][1];
    var secondDay = data['forecast']['txt_forecast']['forecastday'][2];
    array.push("Beep! Weather requested...");
    array.push(firstDay['title']+': \n'+firstDay['fcttext_metric']);
    array.push(night['title']+': \n'+night['fcttext_metric']);
    array.push(secondDay['title']+': \n'+secondDay['fcttext_metric']);
    array.push("...")
    callback(array);
  }
}

function checkPlus(val) {
  if (val < 0) {
    return '-'+val;
  }
  else {
    return '+'+val;
  }
}

function toMPS(val) {
  var newVal = (val * 1000) / (60*60);
  return newVal.toFixed(1);
}