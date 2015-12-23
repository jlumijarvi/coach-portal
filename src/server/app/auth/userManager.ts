/// <reference path="../../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import * as tokenManager from '../auth/tokenManager';
import * as validators from '../models/validators';
import * as _ from 'underscore';
import * as _user from '../models/user';
var User = _user.User;


interface CheckPasswordHandler {
    (isValid: boolean, msgs: Array<string>): any;
}
export function checkPasswordStrength(password: string, cb: CheckPasswordHandler) {
    var msgs = [];
    var isValid = true;
    var validator = validators.passwordValidator(8);
    validator = _.isArray(validator) ? validator : [validator];
    validator.forEach((value: any) => {
        var match = value.validator(password);
        if (!match) {
            msgs.push(_.isFunction(value.message) ? value.message() : value.message);
            isValid = false;
        }
    });
    cb(isValid, msgs);
}

export function findUser(username: string, cb: any): void {
    User.findOne({ username: username }, (err, user) => {
        return cb(user);
    });
}

export function authenticate(username: string, password: string, cb: any): void {
    User.findOne({ username: username }, (err, user) => {
        if (!user) {
            cb(null);
        }
        else {
            user.comparePassword(password, (isMatch) => {
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

export function register(username: string, password: string, email:string, cb: any): void {

    var user = new User();
    user.username = username;
    user.password = password;
    user.email = email;

    User.findOne({ username: user.username }, (err, res) => {
        console.log(res);
        if (err) {
            console.log(err);
            return cb(400, null);
        }
        if (res) {
            return cb(409, null);
        }

        user.save((err) => {

            if (err) {
                console.log(err);
                return cb(err, null);
            }

            User.count((err, counter) => {

                if (err) {
                    console.log(err);
                    User.remove({ username: user.username }, () => {
                        return cb(400, null);
                    });
                }

                if (counter > 1) {
                    return cb(null, user);
                }

                // set the first registered user as an admin
                User.update({ username: user.username }, { isAdmin: true }, (err, nbRow) => {
                    if (err) {
                        console.log(err);
                        User.remove({ username: user.username }, () => {
                            return cb(400, null);
                        });
                    }
                    return cb(null, user);
                });
            });
        });
    });
}
