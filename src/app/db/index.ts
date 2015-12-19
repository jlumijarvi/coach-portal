/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as _ from 'underscore';
import * as userModel from '../models/user';
var User = userModel.User;

var mongodbURL = 'mongodb://localhost/carservices';
var mongodbOptions = {};

var updateOptions = { safe: true, upsert: true };

export function init(cb: any) {

    mongoose.connect(mongodbURL, mongodbOptions, (err) => {
        if (err) {
            console.log('Connection refused to ' + mongodbURL);
            console.log(err);
            return cb(err);
        }
        else {
            console.log('Connection successful to: ' + mongodbURL);
        }
    
        // initialize with admin
        if (User.findOne({ username: 'admin' }).exec().then((result) => {
            var user = result || new User();
            user.username = 'admin';
            user.password = 'password';
            user.created = new Date();
            user.isAdmin = true;
            if (!user.isInRole('admin')) {
                user.roles.push('admin');
            }
            ['admin2', 'admin3'].forEach((value) => {
                user.removeFromRole(value);
            });
            user.save((err, res) => {
                cb(err);
            });
        }, (err) => {
            cb(err);
        }));
    });
}
