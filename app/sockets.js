var Bot = require('./jasubot');
var hashTable = require('node-hashtable');
var data = require('./../config/botdata').getData();
var Msg = require('./models/message');

var botname      = data.botname;
var ircServer    = data.ircServer;
var ircChannel   = data.ircChannel;
var quakeServer  = data.quakeServer;
var quakeChannel = data.quakeChannel;

module.exports = function Sockets(io) {

  	var Jasubot = new Bot(botname, ircServer, ircChannel, quakeServer, quakeChannel);
    Jasubot.botSaid(function(item) {
      io.emit('chat message', item);
      saveMsg(item);
    });

  	io.on('connection', function(socket){
  		socket.on('chat message', function(msg){ //Message from client - emit to all
  			io.emit('chat message', msg);
    		sayAndSave(msg); // send message to IRC and save message to database
  		});
  		socket.on('join', function(item) { //A new client joins
  			newClientJoined(socket, item); //Broadcast other clients a new client joined
        msgHistory(item.channel, function(messages) { //Send message history to new client
  				messages.forEach(function(msg) {
  					io.to(socket.id).emit('chat message', msg);
  				});
    			welcomeNewClient(socket.id, item); //Send joining message to new client
	  		});
  		});
  		socket.on('disconnect', function() { //A client disconnects
  			hashTable.get(socket.id, function(item) {
  				if (item === null) {
  					return null;
  				}
  				var msg = {
      				user: null,
      				channel: item.channel,
      				message: 'User < ' + item.user + '> has disconnected.',
      				time: new Date().getTime()
    			};
    			io.emit('chat message', msg); //Tell other clients a client left
    			sayAndSave(msg);
  			});
  		});
	});

	//send message to IRC and save to database
	function sayAndSave(msg) {
    	Jasubot.botSays(msg);
      saveMsg(msg);
	};

  function saveMsg(msg) {
    new Msg(msg).save();
  };

  function msgHistory(channel, callback) {
    Msg.find(function (err, messages, count) {
      callback(messages);
    }).where('channel',channel).limit(300);//.gte('time',new Date().getTime()-10000);
  };

	//new client joined the chat
	function newClientJoined(socket, item) {
		hashTable.set(socket.id, {user: item.user, channel: item.channel});
		var msg = {
			user: null, 
			channel: item.channel, 
			message: 'User < ' + item.user + '> has joined ' + item.channel, 
			time: new Date().getTime()
		};
    	socket.broadcast.emit('chat message', msg);
    	Jasubot.botSays(msg);
	};

	//welcome new user
	function welcomeNewClient(socketId, item) {
		var msg = {
			user: null, 
			channel: item.channel, 
			message: 'You have joined '+item.channel+'.', 
			time: new Date().getTime()
		};
    	io.to(socketId).emit('chat message', msg);
	};

};