const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = module.exports = express();

const sessionSecret = fs.readFileSync('keys/sessionSecret.key').toString();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false}));		// TODO: secret
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/passport_local_mongoose');

app.post('/login',
  passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/'})
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post('/register', function(req, res, next) {
  console.log('registering user');
  User.register(new User({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      res.redirect('/error');
    } else {
      console.log('user registered!');
      res.redirect('/');
    }
  });
});


if (app.get('env') === 'development') {
  User.findByUsername('admin', (err, user) => {
    if (user === null) {
      console.log('Registering default admin/admin user')
      User.register(new User({ username: 'admin' }), 'admin', function (err) {
        if (err) {
          console.log('Error while admin register!', err);
        } else {
          console.log('Admin user registered!');
        }
      });
    }
  });
}