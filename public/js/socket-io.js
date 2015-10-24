var socket = io();

var username;
if (document.getElementById('local_name').innerHTML.trim() != '') {
    username = document.getElementById('local_name').innerHTML;
}
else if (document.getElementById('fb_name').innerHTML.trim() != '') {
    username = document.getElementById('fb_name').innerHTML;
}
else {
    username = '?';
}

socket.emit('join', {user: username, channel: channel});

$('form').submit(function(){
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
});

socket.on('chat message', function(msg){
    if (msg['channel'] === channel || msg['channel'] === 'all') {
        var timestamp = createTime(new Date(msg.time));
        var line;
        if (msg.user !== null) {
            line = timestamp + ' < ' + msg.user + '> ' + msg.message;
        }
        else {
            line = timestamp + ' -!- ' + msg.message;
        }
        $('#messages').append($('<li>').text(line));
    }
    window.scrollTo(0, $(document).height());
});

function createTime(t) {
    var timestamp = '';
    if (t.getHours() < 10) {
        timestamp += '0' + t.getHours() + ':';
    }
    else {
        timestamp += t.getHours() + ':';
    }
    if (t.getMinutes() < 10) {
        timestamp += '0' + t.getMinutes() + ':';
    }
    else {
        timestamp += t.getMinutes() + ':';
    }
    if (t.getSeconds() < 10) {
        timestamp += '0' + t.getSeconds();
    }
    else {
        timestamp += t.getSeconds();
    }
    return timestamp;
}