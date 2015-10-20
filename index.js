var express = require('express');
var app = express();
var port = 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session')
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var flash    = require('connect-flash');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var configDB = require('./config/database');
var sockets = require('./app/sockets');

//configuration
require('./config/passport')(passport);
mongoose.connect(configDB.url); //connect to database 

//set up express application
app.use(morgan('dev')); //log every request to console
app.use(cookieParser());//read cookies
app.use(bodyParser());  //get information from html forms

app.set('view engine', 'ejs'); //set up ejs for templating
app.use(express.static(__dirname + '/public'));

//for passport
app.use(session({secret:'this_to_be_changed_for_production'}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash());

//routes
require('./app/routes')(app, passport);

//launch
http.listen(port, function(){
  console.log('Server listening on port: 3000');
});

//start socket.io
sockets(io);