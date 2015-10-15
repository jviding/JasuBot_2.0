var DateStr = require('./dateStr');
var http = require('http');

var urlChemi = 'http://hyy-lounastyokalu-production.herokuapp.com/publicapi/restaurant/10';
var urlExa = 'http://hyy-lounastyokalu-production.herokuapp.com/publicapi/restaurant/11';


module.exports = {
  menuToday: function(callback) {
    createMenuStringArray(callback);
  }
}

function createMenuStringArray(callback) {
	var menu = [];
	var exaMenuToday; 
	var cheMenuToday;
	getJsonToday(urlExa, function(result){
		menuToStringArray('Exactum:', result, callback);
		getJsonToday(urlChemi, function(result){
			menuToStringArray('Chemicum:', result, callback);
		});
	});
}

function menuToStringArray(restaurant, data, callback) {
	var array = [];
    array.push(" "+restaurant);
  	data.forEach(function(item) {
      if(item === null) {
        return;
      }
  		else if(item["price"]["name"] === 'Edullisesti') {
  			array.push(" -"+item["name"]);
  		}
  	});
  	if(array.length === 1) {
  		array[0] = " "+restaurant+" (Suljettu)";
  	}
  	callback(array);
}


function getJsonToday(url, callback) {
	http.get(url, function(res) {
    	var body = '';
    	res.on('data', function(chunk) {
        	body += chunk;
    	});
    	res.on('end', function() {
        try {
        	findRightMenu(JSON.parse(body), callback);
        }
        catch(err) {
          callback(['No food data available.']);
        }
    	});
    }).on('error', function(e) {
      	console.log("Got error: ", e);
    });
}
function findRightMenu(data, callback) {
  var dateStr = DateStr.createDate();
  data["data"].forEach(function(item) {
    if(item["date"]===dateStr)
      callback(item["data"]);
  });
}