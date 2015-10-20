module.exports = function(app, passport) {

	//HOME PAGE
	app.get('/', notLoggedIn, function(req, res) {
		res.render('index.ejs');
	});

	//LOGIN
	/*app.get('/login', notLoggedIn, function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/login', notLoggedIn, passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));*/

	//SIGNUP - must be logged in with social app first to create local account
	/*app.get('/signup', isLoggedIn, function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
	app.post('/signup', isLoggedIn,  passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));*/

	//FACEBOOK ROUTES
	app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
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
		isAllowed(res, req.user.channels.pikku2);
		res.render('pikku2.ejs', {
			user : req.user
		});
	});

	//#tuula62
	app.get('/tuula62', isLoggedIn, function(req, res) {
		isAllowed(res, req.user.channels.tuula62);
		res.render('tuula62.ejs', {
			user : req.user
		});
	});

	//JasuBot
	app.get('/jasubot', isLoggedIn, function(req, res) {
		res.render('jasubot.ejs', {
			user : req.user
		});
	});

	//admin
	app.get('/admin', isLoggedAdmin, function(req, res) {
		res.render('admin.ejs');
	});

	//AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
	
	//locally
	/*app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', {message: req.flash('loginMessage')});
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash : true
	}));*/

	//Facebook
	/*app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));*/

	//UNLINK ACCOUNTS

	//local
    /*app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.username = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });*/

    //Facebook
    /*app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });*/

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
};

//route middleware to make sure a user is logged in as admin
function isLoggedAdmin(req, res, next) {
	//if user is admin, carry on
	if (req.isAuthenticated() && req.user.admin) {
		return next();
	}
	//if they aren't, redirect them to the home page
	res.redirect('/');
};

//route middleware to make sure a user is authorized
function isAllowed(res, allowed) {
	//if not authorized, redirect to the home page
	if (!allowed) {
		res.redirect('/');
	}
};

//route middleware to make sure a user is not logged in
function notLoggedIn(req, res, next) {
	//if user is not authenticated in the session, carry on
	if (!req.isAuthenticated()) {
		return next();
	}
	//if they are, redirect them to the home page
	res.redirect('/profile');
};