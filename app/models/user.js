var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local : {
		username : String,
		password : String
	},
	facebook : {
		id : String,
		token : String,
		email : String,
		name : String
	}
});

//checking if passport is valid
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);