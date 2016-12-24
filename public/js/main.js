$(function() {
    $('#sign').on('click', function () {
		let login = $('#login').val();
        let password = $('#password').val();

		if(login == 'user' && password == 'user') {
            window.location.pathname = '/user.html';
        } else if(login == 'admin' && password == 'admin') {
            window.location.pathname = '/admin.html';
        } else {
            window.location.pathname = '/error.html';
        }
    });
});

