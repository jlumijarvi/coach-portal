/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
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

export function register(username: string, password: string, cb: any): void {

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

				if (counter == 1) {
					User.update({ username: user.username }, { isAdmin: true }, (err, nbRow) => {
						if (err) {
							console.log(err);
							User.remove({ username: user.username }, () => {
								return cb(400, null);
							});
						}
						return cb(null, user);
					});
				}
				else {
					return cb(null, user);
				}
			});
		});
	});
}
