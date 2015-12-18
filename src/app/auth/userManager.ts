/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import * as _ from 'underscore';
import * as tokenManager from '../auth/tokenManager';
import * as _user from '../models/user';
var User = _user.User;

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