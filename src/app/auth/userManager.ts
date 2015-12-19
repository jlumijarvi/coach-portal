/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import * as tokenManager from '../auth/tokenManager';
import * as _ from 'underscore';
import * as _user from '../models/user';
var User = _user.User;

var passwordStrengthRules = [
    {
        name: 'Minimum length',
        re: function() {
            return '^.{' + this.params.minLength.value + ',}$'
        },
        msg: function() {
            return 'Password length has to be at least ' + this.params.minLength.value + ' characters';
        },
        params: {
            minLength: {
                name: 'Minimum length',
                value: 8
            }
        }
    },
    {
        name: 'Must contain uppercase letters',
        re: '.*[A-Z]',
        msg: 'Password must contain uppercase letters'
    },
    {
        name: 'Must contain lowercase letters',
        re: '.*[a-z]',
        msg: 'Password must contain lowercase letters'
    },
    {
        name: 'Must contain digits',
        re: '.*\\d',
        msg: 'Password must contain digits'
    },
    {
        name: 'Must contain special characters',
        re: '.*[!@#$%^&*_]',
        msg: 'Password must contain special characters (!@#$%^&*_)'
    },
    {
        name: 'Must not contain whitespaces',
        re: '^\\S+$',
        msg: 'Password must not contain whitespaces'
    }
];

interface CheckPasswordHandler {
    (isValid: boolean, msgs: Array<string>): any;
}
export function checkPasswordStrength(password: string, cb: CheckPasswordHandler) {
    var msgs = [];
    var isValid = true;
    passwordStrengthRules.forEach((rule: any) => {
        var re = _.isFunction(rule.re) ? rule.re() : rule.re;
        var match = !!password.match(re);
        if (match) {
            match = !rule.inverse;
        }
        if (!match) {
            msgs.push(_.isFunction(rule.msg) ? rule.msg() : rule.msg);
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

export function register(username: string, password: string, cb: any): void {

    checkPasswordStrength(password, (isValid, msgs) => {

        if (!isValid) {
            return cb(400, msgs);
        }

        var user = new User();
        user.username = username;
        user.password = password;

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
                    return cb(400, null);
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
    });
}
