const express = require('express');
const app = module.exports = express();

app.use(express.static('public'));

// TODO: you still can use '/view/admin.html' from static route...
app.get('/admin', require('connect-ensure-login').ensureLoggedIn('/login'), (req, res) => {
  res.sendFile('/public/view/admin.html', {root: __dirname});
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile('/public/view/index.html', {root: __dirname});
});

app.get('/user', (req, res) => {
  res.sendFile('/public/view/user.html', {root: __dirname});
});
