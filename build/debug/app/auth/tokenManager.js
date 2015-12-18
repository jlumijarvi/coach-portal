/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var jsonwebtoken = require('jsonwebtoken');
var secret = require('./secret');
function create(user, expiresIn) {
    var data = {
        id: user.id,
        name: user.username
    };
    var token = jsonwebtoken.sign(data, secret.secretToken, { expiresIn: expiresIn || '1d' });
    _.extend(data, data, { token: token });
    return data;
}
exports.create = create;
