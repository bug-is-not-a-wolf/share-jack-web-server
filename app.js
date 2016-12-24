'use strict';
const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');

const httpsOptions = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt')
};

const app = express();
const httpsServer = https.createServer(httpsOptions, app).listen(443);
const io = require('socket.io')(httpsServer);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});

let status = {
    play: false,
    pause: false,
    volume: 1,
    currentTime: 0
};

io.on('connection', function (socket) {
    console.log('Connection established...');
    console.log(status);
    //io.emit('status', status);
    socket.on('disconnect', function () {
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
    socket.on('volumeChanged', function (volume, time) {
        status.volume = volume;
        status.currentTime = time;
        console.log('Volume was changed to ' + volume);
        io.emit('status', status);
    });
});
