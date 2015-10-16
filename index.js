var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
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
app.use(session({secret:'iloveboiledpotatoes'}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash());

//routes
require('./app/routes')(app, passport);

//launch
http.listen(port, function(){
  console.log('Server listening on port: 3000');
});

/*
var Msg = mongoose.model('Message');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/tuula', function(req, res){
  res.sendFile(__dirname + '/tuula.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    //botSays(msg);
    //saveMsg(msg);
  });
  socket.on('join', function() {
  	//Msg.find( function (err,messages,count){
  		//messages.forEach(function(msg) {
  			//io.to(socket.id).emit('chat message', msg);
  			//console.log(msg);
  			//msg.remove();
  		//});
	  //});
  });
});*/
/*
var Bot = require('./ircBot/bot');
//bot	//nickname, server to connect, channel to join
var jasubot = new Bot("Jausnator","irc.stealth.net","#bottitesti");
var tuulabot = new Bot("Jausnator","irc.quakenet.org","#tuula62a");

jasubot.kickStart();
jasubot.setMessageReader(function(message) {
	io.emit('chat message', message);
	saveMsg(message);
});

tuulabot.kickStart();
tuulabot.setMessageReader(function(message) {
	io.emit('chat message', message);
	saveMsg(message);
});

function saveMsg(msg) {
	new Msg(msg).save();
	//console.log(msg);
}

function botSays(message) {
	if (message['channel'] === '#bottitesti') {
		jasubot.writeMessage(message['message']);
	}
	else if (message['channel'] === '#tuula62a') {
		tuulabot.writeMessage(message['message']);
	}
};*/