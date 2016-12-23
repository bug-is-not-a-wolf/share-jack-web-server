'use strict';

var express = require('express');
var app = express();
var http = require('http');
var httpsServer = require('https').Server(app);
var io = require('socket.io')(httpsServer);
var path = require("path");
var fs = require('fs');


var status = {
    play: false,
    pause: false,
    volume: 1,
    currentTime: 0
};
app.use(express.static('public'));

app.get('/',function(req, res){
    const options = {
        hostname: 'stream.basso.fi',
        port: '3000',
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});

app.get('/stream', (clientReq, clientRes) => {
    const options = {
      hostname: 'stream.basso.fi',
      port: '8000',
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    };
	
    const proxyReq = http.request(options,  (proxyRes) => {
      proxyRes.pipe(clientRes);
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    });

    clientReq.pipe(proxyReq);
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

var options = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt')
};

https.createServer(options, app).listen(443, function () {
    console.log("Running at Port 443");
});

