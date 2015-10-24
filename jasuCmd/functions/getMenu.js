var DateStr = require('./dateStr');
var http = require('http');

var urlChemi = 'http://hyy-lounastyokalu-production.herokuapp.com/publicapi/restaurant/10';
var urlExa = 'http://hyy-lounastyokalu-production.herokuapp.com/publicapi/restaurant/11';


module.exports = {
  menuToday: createMenuStringArray
}

function createMenuStringArray(callback) {
  var menuToday = [];
  menuToday.push('Food service today:');
	getJsonToday(urlExa, function (result) {
    console.log('Fetching Exactum menu.');
		menuToStringArray('Exactum', result, function (lines) {
      lines.forEach(function (line) {
        menuToday.push(line);
      });
      getJsonToday(urlChemi, function (result) {
        console.log('Fetching Chemicum menu.');
        menuToStringArray('Chemicum', result, function (lines) {
          lines.forEach(function (line) {
            menuToday.push(line);
          });
          callback(menuToday);
        });
      });
    });
	});
};

function menuToStringArray(restaurant, data, callback) {
  var lines = [];
  lines.push(" "+restaurant+":");
  data.forEach(function (item) {
      if(item === null) {
        return;
      }
  		else if(item["price"]["name"] === 'Edullisesti') {
  			lines.push(" -"+item["name"]);
  		}
  });
  if(data.length === 0) {
  		lines = [" "+restaurant+": (Suljettu)"];
  }
  callback(lines);
};

//Finds a Json object, and performs callback with menu today Json
function getJsonToday(url, callback) {
	http.get(url, function(res) {
    	var body = '';
    	res.on('data', function(chunk) {
        	body += chunk;
    	});
    	res.on('end', function() {
        findRightMenu(JSON.parse(body), callback);
    	});
    }).on('error', function(e) {
      	console.log("Got error: ", e);
    });
}

function findRightMenu(data, callback) {
  var dateStr = DateStr.createDate();
  data["data"].forEach(function (item) {
    if(item["date"] === dateStr) {
      callback(item["data"]);
    }
  });
};