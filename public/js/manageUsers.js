var socket = io();

socket.emit('get users');

socket.on('get users', function(item){
	var row = $('<tr>');
	row.append($('<td>').text(item.user.facebook.email));
	if (item.user.channels.pikku2) {
		row.append($('<td>')
			.append($('<input type="checkbox" id="pikku2' + item.id + '" checked>')
				.click(function () {
					updateP2(item.id);
				})	
			)
		);
	}
	else {
		row.append($('<td>')
			.append($('<input type="checkbox" id="pikku2' + item.id + '">')
				.click(function () {
					updateP2(item.id);
				})	
			)
		);
	}
	if (item.user.channels.tuula62) {
		row.append($('<td>')
			.append($('<input type="checkbox" id="tuula62' + item.id + '" checked>')
				.click(function () {
					updateT62(item.id);
				})	
			)
		);
	}
	else {
		row.append($('<td>')
			.append($('<input type="checkbox" id="tuula62' + item.id + '">')
				.click(function () {
					updateT62(item.id);
				})	
			)
		);
	}

	$('#users').append(row);
});

function updateP2 (id) {
	var bole = document.getElementById('pikku2'+id).checked;
	socket.emit('update user', {id:id, channel: 'pikku2', value:bole});
};

function updateT62 (id) {
	var bole = document.getElementById('tuula62'+id).checked;
	socket.emit('update user', {id:id, channel: 'tuula62', value:bole});
};