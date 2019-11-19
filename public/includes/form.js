window.addEventListener('pagesLoaded', function () {
	var button = document.querySelector('.send-button');
	button.addEventListener('click',function() {
		var form_values = document.querySelectorAll('.text .form input');
		var form_textarea = document.querySelector('.text .form textarea');
		if(form_values[0].value!='' && form_values[1].value!='' && form_values[2].value!='' && form_values[3].value!='' && form_textarea.value!='')
		{
			var form = document.querySelector('.form');
			form.style.display="none";
			var message_sent = document.querySelector('.message_sent');
			message_sent.style.display="block";
			var missing_info = document.querySelector('.missing_info');
			missing_info.style.display="none";
		}
		else
		{
			var missing_info = document.querySelector('.missing_info');
			missing_info.style.display="block";
		}
	})
});