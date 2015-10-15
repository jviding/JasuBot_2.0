var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
    user    : String,
    channel : String,
    message : String,
    time    : Date
});

mongoose.model('Message', Message);
mongoose.connect('mongodb://localhost/messages');

