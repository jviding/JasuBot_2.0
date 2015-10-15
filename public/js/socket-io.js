var socket = io();
socket.emit('join');

$('form').submit(function(){
    if ($('#m').val() !== '') {
        var msg = {
            user: 'Jausnator',
            channel: channel,
            message: $('#m').val(),
            time: new Date().getTime()
        }
        socket.emit('chat message', msg);
        console.log(msg);
        $('#m').val('');
    }
    return false;
});

socket.on('chat message', function(msg){
    console.log(msg);
    if (msg['channel'] === channel) {
        $('#messages').append($('<li>').text(msg.user+': '+msg['message']));
    }
    window.scrollTo(0, $(document).height());
});