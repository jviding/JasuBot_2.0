JasuBot

#main file
bot.js

#initialise
var bot = new Bot("name_here","server_here","channel_here", callback);
-callback: when a new message is read from the channel, callback is performed with
the new message as a parameter


#commands

1. kickStart
to start the bot and join the channel
 -kickStart();

2. disconnect
to disconnect the bot from the server

3. writeMessage
used with parameters username and message. Username is sender and message
is the message to be sent. Message is sent to IRC.
 -writeMessage(username, string)