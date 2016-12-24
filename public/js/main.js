/**
 * Created by Konstantin on 03.12.2016.
 */
$(function() {

    var login = $('#login').val();
    var password = $('#password').val();

    $('#sign').on('click', function () {
       if(login == 'user' && password == 'user') {
           window.location = "https://localhost/user";
       } else if(login == 'admin' && password == 'admin') {
           window.location = "https://localhost/admin";
       } else {
           window.location = "https://localhost/error";
       }
    });
});

