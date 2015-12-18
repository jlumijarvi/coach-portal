/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var express = require('express');
var jwt = require('express-jwt');
var _ = require('underscore');
var csrf = require('csurf');
var secret = require('../auth/secret');
var tokenManager = require('../auth/tokenManager');
var userManager = require('../auth/userManager');
function init() {
    var data = '/../../data/';
    var jwtOptions = {
        secret: secret.secretToken,
        getToken: function (req) {
            return req.cookies['ACCESS-TOKEN'];
        }
    };
    var router = express.Router();
    router.use(csrf({ cookie: true }));
    router.use(function (req, res, next) {
        if (_.isFunction(req.csrfToken)) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
        }
        next();
    });
    router.use(function (err, req, res, next) {
        console.log(err);
        if (err.status === 401) {
            return res.sendStatus(401);
        }
        else if (err.code === 'EBADCSRFTOKEN') {
            return res.sendStatus(err.status);
        }
        next(err);
    });
    router.post('/account/login', login);
    router.post('/account/token', jwt(jwtOptions), token);
    router.get('/ping', function (req, res, next) {
        console.log(req.body);
        res.send('pong');
    });
    router.get('/clearcookies', function (req, res, next) {
        for (var prop in req.cookies) {
            console.log('clearing ' + prop + ': ' + req.cookies[prop]);
            res.clearCookie(prop, { path: '/' });
        }
        res.send('cookies cleared');
    });
    function register(req, res) {
        var username = req.body['username'];
        var password = req.body['password'];
        var confirmPassword = req.body['confirm_password'];
    }
    function login(req, res) {
        // TODO: db
        var username = req.body['username'];
        var password = req.body['password'];
        var remember = 'true' === req.body['remember'];
        if (!username || !password) {
            return res.sendStatus(400);
        }
        userManager.authenticate(username, password, function (user) {
            if (!user) {
                return res.sendStatus(401);
            }
            if (remember) {
                var token = tokenManager.create(user, '10d');
                res.cookie('ACCESS-TOKEN', token.token, { httpOnly: true });
                res.sendStatus(200);
            }
            else {
                var token = tokenManager.create(user, '1d');
                res.json(token);
            }
        });
    }
    function token(req, res) {
        var token = tokenManager.create(req.user, '1d');
        res.json(token);
    }
    return router;
}
exports.init = init;
