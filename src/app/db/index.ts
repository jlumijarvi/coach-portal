/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as userModel from '../models/user';
var User = userModel.User;

var mongodbURL = 'mongodb://localhost/carservices';
var mongodbOptions = {};

export function init() {

    mongoose.connect(mongodbURL, mongodbOptions, (err) => {
        if (err) {
            console.log('Connection refused to ' + mongodbURL);
            console.log(err);
        }
        else {
            console.log('Connection successful to: ' + mongodbURL);
        }
    });
    
    // initialize
    if (User.find({ username: 'admin' }).exec().then((result) => {
        if (!result) {
            var user = new User();
            user.username = 'admin';
            user.password = 'password';
            user.isAdmin = true;
            user.save();
        }
    }));
}
