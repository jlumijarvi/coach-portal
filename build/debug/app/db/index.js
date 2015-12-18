/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var mongoose = require('mongoose');
var userModel = require('../models/user');
var User = userModel.User;
var mongodbURL = 'mongodb://localhost/carservices';
var mongodbOptions = {};
function init() {
    mongoose.connect(mongodbURL, mongodbOptions, function (err) {
        if (err) {
            console.log('Connection refused to ' + mongodbURL);
            console.log(err);
        }
        else {
            console.log('Connection successful to: ' + mongodbURL);
        }
    });
    // initialize
    if (User.find({ username: 'admin' }).exec().then(function (result) {
        if (!result) {
            var user = new User();
            user.username = 'admin';
            user.password = 'password';
            user.isAdmin = true;
            user.save();
        }
    }))
        ;
}
exports.init = init;
