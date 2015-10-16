var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	user    : String,
    channel : String,
    message : String,
    time    : Date
});

//create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);