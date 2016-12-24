var express = require('express');
var app = express();
var fs = require('fs');
var options = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt')
};
var httpsServer = require('https').Server(options, app);
      // TODO: fix some server-side troubles...  // TODO: Write meaningful TODO
var io = require('socket.io')(httpsServer);
var path = require("path");

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});

var status = {
    isPlaying: false,
    volume: 1,
    currentTime: 0	// TODO: update the current time for new clients
};


io.on('connection', function (socket) {
    console.log('Connection established...');
    console.log(status);
    socket.emit('status', status);		
	
	socket.on('disconnect', function () {
        console.log('Disconnected...');
    });
    
	socket.on('play', function (time) {
        status.isPlaying = true;
        status.currentTime = time;
        console.log('Playing... ');
        io.emit('status', status);
    });
    
	socket.on('pause', function (time) {
        status.isPlaying = false;
        status.currentTime = time;
        console.log('Stopping... ');
        io.emit('status', status);
    });
	
    socket.on('volumeChanged', function (volume, time) {
        status.volume = volume;
        status.currentTime = time;
        console.log('Volume was changed to ' + volume);
        io.emit('status', status);
    });
});

httpsServer.listen(443, function () {
    console.log('Running at Port', httpsServer.address().port);
});

