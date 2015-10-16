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
		successRedirect : '/pikku2',
		failureRedirect : '/signup',
		failureFlash : true
	}));

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
	res.redirect('/pikku2');
}