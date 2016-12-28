/**
 * Created by kostya on 27.12.16.
 */
var sha3 = require('sha3');
var argon2 = require('argon2themax');
// Generate 512-bit digest.
var d = new sha3.SHA3Hash();

var plainText = '1234asdf';


d.update(plainText);
var sha3Hash = d.digest('hex');

console.log(sha3Hash);

var maxOpts;

argon2.getMaxOptions()
    .then(function(options) {
        maxOpts = options;
        return argon2.generateSalt();
    }).then(function(salt) {
    return argon2.hash(sha3Hash, salt, maxOpts);
});

