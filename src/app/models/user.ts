/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as userModel from '../models/user';

var SALT_WORK_FACTOR = 10;

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    isAdmin: boolean;
    created: Date;
    comparePassword(password: string, cb: any);
}

var userScema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});

//Password verification
userScema.method('comparePassword', function(password: string, cb: any) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(isMatch);
    });
});

// Bcrypt middleware on UserSchema
userScema.pre('save', function(next) {
    var user = <IUser>this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

export var User = mongoose.model<IUser>('User', userScema);
