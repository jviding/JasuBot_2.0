var DateStr = require('./dateStr');

module.exports = {
	atMidNight: function(callback){
		doTheInterval(callback);
	}
}

function doTheInterval(callback) {
	var interval = 1000;
	var date = DateStr.createDate();
	var iv = setInterval(checkDayChange, interval);

	function checkDayChange() {
		var newDate = DateStr.createDate();
		if(newDate !== date) {
			date = newDate;
			interval = 1000 * 60 * 12;
			callback();
		}
		else {
			splitInterval();
		}
		clearInterval(iv);
		iv = setInterval(checkDayChange, interval);
	};

	function splitInterval() {
		if(interval > 1000*60){
			interval = interval/2;
		}
		else {
			interval = 1000*20;
		}
	};

};


