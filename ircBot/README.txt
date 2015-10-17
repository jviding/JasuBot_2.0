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
used with a callback function, which will be used with a following Json parameter
var message = {
	user: 'sender',
	channel: 'channel_name',
	message: 'message',
	time: 'time in milliseconds'
}
 -setMessageReader(function(message) { *magic* });

3. writeMessage
used with parameters username and message. Username is sender and message
is the message to be sent. Message is sent to IRC.
 -writeMessage(username, string)