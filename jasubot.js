var Bot = require('./ircBot/bot');
var Msg = require('./app/models/message');

function Jasubot(botname, ircServer, ircChannel, quakeServer, quakeChannel, io) {

//"irc.stealth.net"  "irc.quakenet.org"
	//bot	            //nickname, server to connect, channel to join
	var ircbot = new Bot(botname,ircServer,ircChannel);
	var quakebot = new Bot(botname,quakeChannel,quakeChannel);

	ircbot.kickStart();
	ircbot.setMessageReader(function(message) {
		io.emit('chat message', message);
		saveMsg(message);
	});

	quakebot.kickStart();
	quakebot.setMessageReader(function(message) {
		io.emit('chat message', message);
		saveMsg(message);
	});

	function saveMsg(msg) {
		new Msg(msg).save();
		//console.log(msg);
	}

	function botSays(message) {
		if (message['channel'] === ircChannel) {
			ircbot.writeMessage(message['user'], message['message']);
		}
		else if (message['channel'] === quakeChannel) {
			quakebot.writeMessage(message['user'], message['message']);
		}
	};

	return botSays: botSays;

};