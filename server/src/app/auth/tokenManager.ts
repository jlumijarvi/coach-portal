/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as userModel from '../models/user';
import * as jsonwebtoken from 'jsonwebtoken';
import * as secret from './secret';
import * as tokenModel from '../models/token';
import * as _ from 'underscore';

export function create(user: userModel.IUser, expiresIn?: string): string {
	var data = {
		id: user.id,
		name: user.username,
		iss: 'http://localhost/4000'
	};
	
	var token = jsonwebtoken.sign(data, secret.secretToken, { expiresIn: expiresIn || '1d' });
	
	return token;
}
