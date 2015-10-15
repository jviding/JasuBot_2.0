document.getElementById('bookmark').addEventListener('click',function() {
	var toSlide = document.getElementById('channellist');
		if (toSlide.style.width == '0px') {
        	toSlide.style.width = '95%'
          	document.getElementById('arrow').innerHTML = "&#8594;";
        }
        else {
          	toSlide.style.width = '0px';
          	document.getElementById('arrow').innerHTML = "&#8592;";
        }
}, false );
document.getElementById('joined').innerHTML = "Channel: "+channel;