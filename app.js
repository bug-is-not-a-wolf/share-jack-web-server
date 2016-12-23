/**
 * Created by Konstantin on 03.12.2016.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var options = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt')
};
var https = require('https').Server(options, app);
var io = require('socket.io')(https);
var path = require("path");

var status = {
    play: false,
    pause: false,
    volume: 1,
    currentTime: 0
};
app.use(express.static('public'));

app.get('/',function(req, res){
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});

io.on('connection', function(socket){
    console.log('Connection established...');
    console.log(status);
    //io.emit('status', status);
    socket.on('disconnect', function(){
        console.log('Disconnected...');
    });
    socket.on('play', function (time) {
       status.play = true;
       status.pause = false;
       status.currentTime = time;
       console.log('Playing... ' + status.play);
       io.emit('status', status);
    });
    socket.on('pause', function (time) {
        status.play = false;
        status.pause = true;
        status.currentTime = time;
        console.log('Stopping... ' + status.pause);
        io.emit('status', status);
    });
    socket.on('volumeChanged', function (volume , time) {
        status.volume = volume;
        status.currentTime = time;
        console.log('Volume was changed to ' + volume);
        io.emit('status', status);
    });
});




https.listen(3000, function () {
    console.log("Running at Port 3000");
});

