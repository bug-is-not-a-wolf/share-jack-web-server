'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');
const sha3 = require('sha3');
const argon2 = require('argon2themax');
const User = require('./model/user.js');

argon2.getMaxOptions(); // caching

const sha3Hash = sha3.SHA3Hash();

function calcSha3(plaintext, salt) {
    return sha3Hash.update(plaintext + salt).digest('hex');
}

function hash(plaintext, salt) {
    let hash1 = calcSha3(plaintext, salt);
    return argon2.getMaxOptions()
        .then(options => argon2.hash(hash1, salt, options));
}

mongoose.connect("mongodb://localhost/share-jack");

module.exports.getUser = id => User.findOne(id);

module.exports.checkUser = userData => {
    return User.findOne({login: userData.login})
        .then(doc => {
            let hash1 = calcSha3(doc.login, doc.salt);
            return argon2.verify(doc.password, hash1);
        });
};

module.exports.createUser = userData => {
    console.log("sign up: " + userData.login);
    argon2.generateSalt()
        .then(salt => ({
            login: userData.login,
            password: hash(userData.password, salt),
            salt: salt
        }))
        .then(user => new User(user).save());
};
