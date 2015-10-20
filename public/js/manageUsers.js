var socket = io();

socket.emit('get users');

/*$('form').submit(function(){
    if ($('#m').val() !== '') {
        var msg = {
            user: username,
            channel: channel,
            message: $('#m').val(),
            time: new Date().getTime()
        }
        socket.emit('chat message', msg);
        $('#m').val('');
    }
    return false;
});*/

socket.on('get users', function(user){
    $('#users').append($('<li>').text(user.facebook.email));
});