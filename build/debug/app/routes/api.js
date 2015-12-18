/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var express = require('express');
var jwt = require('express-jwt');
var cors = require('cors');
var secret = require('../auth/secret');
var jsonfileservice = require('../utils/jsonfileservice');
var four0four = require('../utils/404');
var tokenManager = require('../auth/tokenManager');
var userManager = require('../auth/userManager');
var _user = require('../models/user');
var User = _user.User;
var expiresIn = '1d';
function init() {
    var api = '/api/';
    var jwtOptions = {
        secret: secret.secretToken
    };
    var data = '/../../data/';
    var router = express.Router();
    router.use(cors());
    router.post(api + 'authenticate', authenticate);
    router.post(api + 'token', jwt(jwtOptions), token);
    router.get(api + 'getuserinfo', jwt(jwtOptions), getUserInfo);
    router.get(api + 'customer/:id', jwt(jwtOptions), getCustomer);
    router.get(api + 'customers', jwt(jwtOptions), getCustomers);
    router.get(api + '*', four0four.notFoundMiddleware);
    router.use(function (err, req, res, next) {
        console.log('error in API');
        console.log(err);
        if (err.status === 401) {
            return res.sendStatus(401);
        }
        next(err);
    });
    function authenticate(req, res) {
        var username = req.headers['username'];
        var password = req.headers['password'];
        if (!username || !username) {
            return res.sendStatus(400);
        }
        userManager.authenticate(username, password, function (user) {
            if (!user) {
                return res.send(401);
            }
            var token = tokenManager.create(user);
            res.json(token);
        });
    }
    function token(req, res) {
        var token = tokenManager.create(req.user, expiresIn);
        return res.json(token);
    }
    function getUserInfo(req, res) {
        return res.json(req.user);
    }
    function getCustomer(req, res) {
        var id = req.params.id;
        var msg = 'customer id ' + id + ' not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
            var customer = json.filter(function (c) {
                return c.id === parseInt(id);
            });
            if (customer && customer[0]) {
                res.send(customer[0]);
            }
            else {
                four0four.send404(req, res, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }
    function getCustomers(req, res) {
        console.log(req.user);
        var msg = 'customers not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
            if (json) {
                res.send(json);
            }
            else {
                four0four.send404(req, res, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }
    return router;
}
exports.init = init;
