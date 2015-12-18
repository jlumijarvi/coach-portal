/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var _user = require('../models/user');
var User = _user.User;
function authenticate(username, password, cb) {
    User.findOne({ username: username }, function (err, user) {
        if (!user) {
            cb(null);
        }
        else {
            user.comparePassword(password, function (isMatch) {
                if (!isMatch) {
                    cb(null);
                }
                else {
                    cb(user);
                }
            });
        }
    });
}
exports.authenticate = authenticate;
