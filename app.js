/**
 * Created by Konstantin on 03.12.2016.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");

status = {
  play: false,
  pause: false,
  volume: 1
};

app.use(express.static('public'));

app.get('/',function(req, res){
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});

io.on('connection', function(socket){
    console.log('Connection established...');
    socket.on('disconnect', function(){
        console.log('Disconnected...');        
    });
    socket.on('play', function () {
       status.play = true;
       status.pause = false;
       console.log('Playing... ' + status.play);
       io.emit('status', status);
    });
    socket.on('pause', function () {
        status.play = false;
        status.pause = true;
        console.log('Stopping... ' + status.pause);
        io.emit('status', status);
    });
    socket.on('volumeChanged', function (data) {
        status.volume = data;
        console.log('Volume was changed to ' + data);
        io.emit('status', status);
    });
});

http.listen(8080);

console.log("Running at Port 8080");