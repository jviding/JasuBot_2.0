var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

	//for serializing the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	//for deserializing the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	//LOCAL SIGNUP
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({'local.username' : username}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
				}
				else {
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));

	//LOCAL LOGIN
	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({'local.username' : username}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, req.flash('loginMessage', 'No user found.'));
				}
				if (!user.validPassword(password)) {
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
				}
				// all is well, return successful user
				return done(null, user);
			});
		});
	}));
};