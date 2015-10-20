var socket = io();

function restartIrc() {
	socket.emit('restart bot', '#pikku2');
};

function restartQuake() {
	socket.emit('restart bot', '#tuula62');
};
