/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as userModel from '../models/user';
import * as jsonwebtoken from 'jsonwebtoken';
import * as secret from './secret';
import * as tokenModel from '../models/token';

export function create(user: userModel.IUser, expiresIn?: string): tokenModel.IToken {
	var data = {
		id: user.id,
		name: user.username
	};

	var token = jsonwebtoken.sign(data, secret.secretToken, { expiresIn: expiresIn || '1d' });
	_.extend(data, data, { token: token });
	
	return <tokenModel.IToken>data;
}
