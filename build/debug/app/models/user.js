/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var SALT_WORK_FACTOR = 10;
var userScema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});
//Password verification
userScema.method('comparePassword', function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(isMatch);
    });
});
// Bcrypt middleware on UserSchema
userScema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
exports.User = mongoose.model('User', userScema);
