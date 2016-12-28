'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');
const sha3 = require('sha3');
const argon2 = require('argon2themax');
const User = require('./model/user.js');

mongoose.connect("mongodb://localhost/share-jack");

module.exports.getUser = function (id) {
    return User.findOne(id)
};

module.exports.checkUser = function (userData) {
    return User
        .findOne({login: userData.login})
        .then(doc => doc.password)
        .then(password => hash(password))
        .then(function (hash) {
            var sha3Encryptor = new sha3.SHA3Hash();
            sha3Encryptor.update(userData.password);
            var sha3Hash = sha3Encryptor.digest('hex');
            return argon2.verify(hash, sha3Hash);
        })
        .then(match => match);
};

function hash(plainText) {
    var sha3Encryptor = new sha3.SHA3Hash();
    sha3Encryptor.update(plainText);
    var sha3Hash = sha3Encryptor.digest('hex');
    return argon2.getMaxOptions()
        .then(function () {
            return argon2.generateSalt();
        }).then(function (salt) {
            return argon2.hash(sha3Hash, salt);
        });
}

function createUser(userData) {
    var user = {
        login: userData.login
    };
    hash(userData.password).then(function (hash) {
        user.password = hash;
        console.log(user);
        return new User(user).save();
    });
}
