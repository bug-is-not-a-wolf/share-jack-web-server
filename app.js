'use strict';

const express = require('express');
const app = express();
const http = require('http');
const httpsServer = require('https').Server(app);
const io = require('socket.io')(httpsServer);
const path = require("path");
const fs = require('fs');

app.use(express.static('public'));

app.get('/',function(req, res){
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

let status = {
    play: false,
    pause: false,
    volume: 1,
    currentTime: 0
};

  
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

let options = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt')
};

https.createServer(options, app).listen(443, function () {
    console.log("Running at Port 443");
});

