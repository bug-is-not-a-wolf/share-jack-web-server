var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;