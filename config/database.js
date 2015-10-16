var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
    user    : String,
    channel : String,
    message : String,
    time    : Date
});

module.exports = {
	'url' : 'mongodb://localhost/messages'
};

mongoose.model('Message', Message);

