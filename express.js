/**
 * Created by Konstantin on 03.12.2016.
 */
var express = require('express');
var app = express();
var path = require("path");

app.use(express.static('public'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/public/view/admin.html'));
});

app.listen(8080);

console.log("Running at Port 8080");