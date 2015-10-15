JasuBot

#main file
bot.js

#initialise
var bot = new Bot("name_here","server_here","channel_here");


#commands

1. kickStart
to start the bot and join the channel
 -kickStart();

2. setMessageReader
used with a callback function, that is to be used with a following Json
var message = {
	user: 'sender',
	channel: 'channel_name',
	message: 'message',
	time: 'time in milliseconds'
}
 -setMessageReader(function(message) { *magic* });

3. writeMessage
used with a message to send as the parameter
 -writeMessage(string)