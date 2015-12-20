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
            user.email = 'john.doe@foo.com';
            user.password = '#,K:s#n$j$s6Rm';
            user.created = new Date();
            user.isAdmin = true;
            if (!user.isInRole('admin')) {
                user.roles.push('admin');
            }
            user.save((err, res) => {
                console.log(err);
                cb(err);
            });
        }, (err) => {
            console.log(err);
            cb(err);
        }));
    });
}
