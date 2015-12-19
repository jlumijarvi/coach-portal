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
    roles: string[];
    comparePassword(password: string, cb: any);
    isInRole(role: string): boolean;
    addToRole(role: string): void;
    removeFromRole(role: string): void;
}

var userScema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    roles: { type: [String] }
});

//Password verification
userScema.method('comparePassword', function(password: string, cb: any) {
    var that = <IUser>this;
    bcrypt.compare(password, that.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(isMatch);
    });
});

userScema.method('isInRole', function(role: string) {
    var that = <IUser>this;
    return that.roles.some((value) => {
        return value === role;
    });
});

userScema.method('addToRole', function(role: string) {
    var that = <IUser>this;
    if (!that.isInRole(role)) {
        that.roles.push(role);
    }
});

userScema.method('removeFromRole', function(role: string) {
    var that = <IUser>this;
    var idx = that.roles.indexOf(role);
    if (idx >= 0) {
        that.roles.splice(idx, 1);
    }
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
