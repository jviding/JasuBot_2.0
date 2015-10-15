require('./database');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//database
var mongoose = require('mongoose');
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
    saveMsg(msg);
  });
  socket.on('join', function() {
  	Msg.find( function (err,messages,count){
  		messages.forEach(function(msg) {
  			io.to(socket.id).emit('chat message', msg);
  			//console.log(msg);
  			//msg.remove();
  		});
	});
  });
});

http.listen(3000, function(){
  console.log('Server listening on *:3000');
});
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
*/
function saveMsg(msg) {
	new Msg(msg).save();
	//console.log(msg);
}
/*
function botSays(message) {
	if (message['channel'] === '#bottitesti') {
		jasubot.writeMessage(message['message']);
	}
	else if (message['channel'] === '#tuula62a') {
		tuulabot.writeMessage(message['message']);
	}
};*/