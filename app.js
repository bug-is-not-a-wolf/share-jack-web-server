'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({ secret: '1l90QN1re7IQJO3jM3wVS2m-zMNWqonM', resave: false, saveUninitialized: false}));		// TODO: secret
app.use(passport.initialize());
app.use(passport.session());

app.all('*', function ensureSecure(req, res, next) {
    if (req.secure) return next();
    res.redirect('https://' + req.hostname + req.url);
});

const adminUser = {id : 1, login : 'admin', password : 'admin'};

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);
//  User.findById(id, function(err, user) {
//    done(err, user);
//  });
  if(id = adminUser.id) {
	  done(null, adminUser);
  } else {
	  done('err');
  }
});

const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(
  function(username, password, done) {
	console.log(username, password);
	const isValidAdmin = (username == adminUser.login && password == adminUser.password);
    return done(null, isValidAdmin ? adminUser : false );
}));  // TODO:
/*  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }*/

app.post('/login',
  passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/'})
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/admin',
  require('connect-ensure-login').ensureLoggedIn('/'),	// TODO: you still can use '/view/admin.html'
  (req, res) => {
    res.sendFile('/public/view/admin.html', {root: __dirname});
});

app.get('/', (req, res) => {
    res.sendFile('/public/view/index.html', {root: __dirname});
});

app.get('/user', (req, res) => {
    res.sendFile('/public/view/user.html', {root: __dirname});
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
