module.exports = function(app, passport) {

	//HOME PAGE
	app.get('/', notLoggedIn, function(req, res) {
		res.render('index.ejs');
	});

	//LOGIN
	app.get('/login', notLoggedIn, function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	//SIGNUP
	app.get('/signup', notLoggedIn, function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//FACEBOOK ROUTES
	app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	//profile
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	//#pikku2
	app.get('/pikku2', isLoggedIn, function(req, res) {
		res.render('pikku2.ejs', {
			user : req.user
		});
	});

	//#tuula62
	app.get('/tuula62', isLoggedIn, function(req, res) {
		res.render('tuula62.ejs', {
			user : req.user
		});
	});

	//AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
	
	//locally
	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', {message: req.flash('loginMessage')});
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash : true
	}));

	//Facebook
	app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	//LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	//if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}
	//if they aren't, redirect them to the home page
	res.redirect('/');
}

//route middleware to make sure a user is not logged in
function notLoggedIn(req, res, next) {
	//if user is not authenticated in the session, carry on
	if (!req.isAuthenticated()) {
		return next();
	}
	//if they are, redirect them to the home page
	res.redirect('/profile');
}