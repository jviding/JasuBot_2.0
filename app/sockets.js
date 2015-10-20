var Bot = require('./jasubot');
var hashTable = require('node-hashtable');
var data = require('./../config/botdata').getData();
var Msg = require('./models/message');
var User = require('./models/user');

var botname      = data.botname;
var ircServer    = data.ircServer;
var ircChannel   = data.ircChannel;
var quakeServer  = data.quakeServer;
var quakeChannel = data.quakeChannel;

module.exports = function Sockets(io) {

  	var Jasubot = new Bot(botname, ircServer, ircChannel, quakeServer, quakeChannel);
    Jasubot.botSaid(function (item) {
      io.emit('chat message', item);
      saveMsg(item);
    });

  	io.on('connection', function (socket){
  		socket.on('chat message', function (msg){ //Message from client - emit to all
  			io.emit('chat message', msg);
    		sayAndSave(msg); // send message to IRC and save message to database
  		});
  		socket.on('join', function (item) { //A new client joins
        msgHistory(item.channel, function (message) { //Send message history to new client
  				io.to(socket.id).emit('chat message', message);
  			},
        function () {
          newClientJoined(socket, item); //Broadcast other users new user joined
          welcomeNewClient(socket, item); //Send joining message to new client
        });
  		});
  		socket.on('disconnect', function () { //A client disconnects
  			hashTable.get(socket.id, function (item) {
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
  			});
  		});
      socket.on('get users', function () {
        findUsers(function (user) {
          io.to(socket.id).emit('get users', {user: user, id: user.id});
        });
      });
      socket.on('update user', function (item) {
        updateUser(item.id, item.channel, item.value);
      });
      socket.on('restart bot', function (channel) {
        Jasubot.botRestart(channel);
      });
	});

	//send message to IRC and save to database
	function sayAndSave(msg) {
    if (msg.channel != 'jasubot') {
      Jasubot.botSays(msg);
    }
      saveMsg(msg);
	};

  function saveMsg(msg) {
    new Msg(msg).save();
  };

  function msgHistory(channel, callback, end) {
    Msg.count(function (err, count) {
      var toSkip = 0;
      if (count > 500) { // if > 500 messages, show only last 500
        toSkip = count - 500;
      }
      Msg.find(function (err, messages, done) {
        messages.forEach(function (message) {
          callback(message);
        });
        end();
      }).where('channel', channel).skip(toSkip);
    }).where('channel', channel);
  };

  function findUsers(callback) {
    User.find(function (err, users) {
      users.forEach(function (user) {
        callback(user);
      });
    });
  };

  function updateUser(id, channel, value) {
    User.findById(id, function (err, user) {
      user.channels[channel] = value;
      user.save();
    });
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
	};

	//welcome new user
	function welcomeNewClient(socket, item) {
		var msg = {
			user: null, 
			channel: item.channel, 
			message: 'You have joined '+item.channel+'.', 
			time: new Date().getTime()
		};
    	io.to(socket.id).emit('chat message', msg);
	};

};