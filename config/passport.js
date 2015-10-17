var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
//load up the user model
var User = require('../app/models/user');
//load the auth variables
var configAuth = require('./auth');

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

	//FACEBOOK
	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		passReqToCallback : true
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			if (!req.user) {
				User.findOne({'facebook.id' : profile.id}, function(err, user) {
					if (err) {
						return done(err);
					}
					if (user) {
						return done(null, user);
					}
					else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.givenName = profile.name.givenName;
						newUser.facebook.familyName = profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;

						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			}
			else {
				var user = req.user;

				user.facebook.id = profile.id;
				user.facebook.token = token;
				newUser.facebook.givenName = profile.name.givenName;
				newUser.facebook.familyName = profile.name.familyName;
				user.facebook.email = profile.emails[0].value;

				user.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, user);
				});
			}
		});
	}));
};