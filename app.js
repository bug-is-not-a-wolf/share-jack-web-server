'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');

const httpsOptions = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt'),
    ca: fs.readFileSync('keys/ca_bundle.crt')
};

const app = express();
const httpServer = http.createServer(app).listen(80);
const httpsServer = https.createServer(httpsOptions, app).listen(443);
const io = require('socket.io')(httpsServer);

app.use(express.static('public'));

app.all('*', function ensureSecure(req, res, next) {
    if (req.secure) return next();
    res.redirect('https://' + req.hostname + req.url);
});

app.get('/',function(req, res){
    res.sendFile(path.join(__dirname + '/public/view/main.html'));
});

app.get('/user',function(req, res){
    res.sendFile(path.join(__dirname + '/public/view/user.html'));
});

app.get('/admin',function(req, res){
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});


let status = {
    isPlaying: false,
    volume: 1,
    currentTime: 0
};
let statusChangeTime = Date.now();

io.on('connection', function(socket){
    console.log('Connection established...');

	if(status.isPlaying) {
		let timeDiff = (Date.now() - statusChangeTime) / 1000;
		statusChangeTime = Date.now()
		status.currentTime += timeDiff;
		
		if(status.currentTime >= 214) {		// TODO: change magic number to .currentAudioLength() (seconds)
			status.isPlaying = false;
		}
	}
	
    console.log(status);
    socket.emit('status', status);		
	
	socket.on('disconnect', function () {
        console.log('Disconnected...');
    });
    
	socket.on('play', function (time) {
        status.isPlaying = true;
        status.currentTime = time;
		statusChangeTime = Date.now()

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
