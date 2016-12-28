'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');

const httpsOptions = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt'),
    ca: fs.readFileSync('keys/ca_bundle.crt')
};

const app = express();
const httpServer = http.createServer(app).listen(80, () => console.log('Server is listening...'));
const httpsServer = https.createServer(httpsOptions, app).listen(8080, () => console.log('Server is listening...'));
const io = require('socket.io')(httpsServer);
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/view/main.html");
});

app.post('/admin', urlencodedParser, function (req, res) {
    let login = req.body.login;
    let password = req.body.pass;
    console.log("sign in: " + login);
    if (login && password) {
        db.checkUser({login: login, password: password})
            .then(function (result) {
                if (result === true) {
                    return res.redirect('/admin')
                }
                return res.redirect('/error');
            });
    }
    return res.redirect('/');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + "/public/view/admin.html");
});

app.get('/error', function (req, res) {
    res.sendFile(__dirname + "/public/view/error.html");
});

app.all('*', function ensureSecure(req, res, next) {
    if (req.secure) return next();
    res.redirect('https://' + req.hostname + req.url);
});

let status = {
    isPlaying: false,
    volume: 1,
    currentTime: 0
};
let statusChangeTime = Date.now();

io.on('connection', function (socket) {
    console.log('Connection established...');

    if (status.isPlaying) {
        let timeDiff = (Date.now() - statusChangeTime) / 1000;
        statusChangeTime = Date.now();
        status.currentTime += timeDiff;

        if (status.currentTime >= 214) {		// TODO: change magic number to .currentAudioLength() (seconds)
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
        statusChangeTime = Date.now();

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
