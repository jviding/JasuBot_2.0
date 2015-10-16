module.exports = function(app, passport) {

	//HOME PAGE
	app.get('/', function(req, res) {
		res.render('index.html');
	});

	//LOGIN
	app.get('/login', function(req, res) {
		res.render('login.html');
	});

	//SIGNUP
	app.get('/signup', function(req, res) {
		res.render('signup.html');
	});

	//#pikku2
	app.get('/pikku2', isLoggedIn, function(req, res) {
		res.render('/pikku2.html', {
			user : req.user
		});
	});

	//#tuula62
	app.get('/tuula62', isLoggedIn, function(req, res) {
		res.render('/tuula62.html', {
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