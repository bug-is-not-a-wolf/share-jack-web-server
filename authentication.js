const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = module.exports = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({ secret: '1l90QN1re7IQJO3jM3wVS2m-zMNWqonM', resave: false, saveUninitialized: false}));		// TODO: secret
app.use(passport.initialize());
app.use(passport.session());

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
