'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const audioControlSockets = require('./audio-control-sockets.js');
const auth = require('./authentication.js');
const routes  = require('./routes.js');
const httpsOptions = {
  key: fs.readFileSync('keys/private.key'),
  cert: fs.readFileSync('keys/certificate.crt'),
  ca: fs.readFileSync('keys/ca_bundle.crt')
};

const app = express();
const httpServer = http.createServer(app).listen(80);
const httpsServer = https.createServer(httpsOptions, app).listen(443);

app.all('*', function ensureSecure(req, res, next) {
  if (req.secure) return next();
  res.redirect('https://' + req.hostname + req.url);
});

audioControlSockets(httpsServer);
app.use(auth);
app.use(routes);
