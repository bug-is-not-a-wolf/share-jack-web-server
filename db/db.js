/**
 * Created by kostya on 27.12.16.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var db = mongoose.connect("mongodb://jack:black-jack@localhost:27017/share-jack");
var User = require('../db/model/user.js');
var sha3 = require('sha3');
var argon2 = require('argon2themax');

function createUser(userData){
    var user = {
        login: userData.login
    };
    hash(userData.password).then(function (hash) {
      user.password = hash;
      console.log(user);
      return new User(user).save();
    });
}

exports.getUser = function(id) {
    return User.findOne(id)
};

exports.checkUser = function(userData) {
    return User
        .findOne({login: userData.login})
        .then(function (doc) {
            return doc.password;
        })
        .then(function (password) {
            return hash(password);
        })
        .then(function (hash) {
            var sha3Encryptor = new sha3.SHA3Hash();
            sha3Encryptor.update(userData.password);
            var sha3Hash = sha3Encryptor.digest('hex');
            return argon2.verify(hash, sha3Hash);
        })
        .then(function (match) {
            return match;
        })
    };


function hash(plainText) {
    var sha3Encryptor = new sha3.SHA3Hash();
    sha3Encryptor.update(plainText);
    var sha3Hash = sha3Encryptor.digest('hex');
    return argon2.getMaxOptions()
        .then(function() {
            return argon2.generateSalt();
        }).then(function(salt) {
            return argon2.hash(sha3Hash, salt);
        });
}


createUser({login: "jack", password: "123"});
