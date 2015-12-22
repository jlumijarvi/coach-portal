/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as userModel from '../models/user';
import * as validators from '../models/validators';

var SALT_WORK_FACTOR = 10;

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
    created: Date;
    roles: string[];
    verified: boolean;
    locked: boolean;

    comparePassword(password: string, cb: any);
    isInRole(role: string): boolean;
    addToRole(role: string): void;
    removeFromRole(role: string): void;
}

export var UserScema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: validators.ValidationGroup(validators.passwordValidator(8))
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        validate: validators.emailValidator()
    },
    phoneNumber: {
        type: String,
        validate: validators.phoneNumberValidator()
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: [String]
    },
    verified: {
        type: Boolean,
        default: false
    },
    locked: {
        type: Boolean,
        default: false
    }
});

// Password verification
UserScema.method('comparePassword', function(password: string, cb: any) {
    var that = <IUser>this;
    bcrypt.compare(password, that.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(isMatch);
    });
});

UserScema.method('isInRole', function(role: string) {
    var that = <IUser>this;
    return that.roles.some((value) => {
        return value === role;
    });
});

UserScema.method('addToRole', function(role: string) {
    var that = <IUser>this;
    if (!that.isInRole(role)) {
        that.roles.push(role);
    }
});

UserScema.method('removeFromRole', function(role: string) {
    var that = <IUser>this;
    var idx = that.roles.indexOf(role);
    if (idx >= 0) {
        that.roles.splice(idx, 1);
    }
});

// Bcrypt middleware on UserSchema
UserScema.pre('save', function(next) {
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

export var User = mongoose.model<IUser>('User', UserScema);
