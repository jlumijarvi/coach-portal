/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as jwt from 'express-jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import * as _ from 'underscore';
import * as csrf from 'csurf';
import * as jsonfileservice from '../utils/jsonfileservice';
import * as four0four from '../utils/404';
import * as secret from '../auth/secret';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as tokenManager from '../auth/tokenManager';
import * as userManager from '../auth/userManager';

export = (app: express.Express) => {

    var data = '/../../data/';

    var jwtOptions: jwt.Options = {
        secret: secret.secretToken,
        getToken: (req: express.Request) => {
            return req.cookies['ACCESS-TOKEN'];
        }
    };

    var router = express.Router();

    router.use(csrf({ cookie: true }));
    router.use((req, res, next) => {
        if (_.isFunction(req.csrfToken)) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
        }
        next();
    });
    router.use((err: any, req: express.Request, res: express.Response, next: Function) => {
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
    router.post('/account/register', register);

    router.get('/ping', (req, res, next) => {
        console.log(req.body);
        res.send('pong');
    });

    router.get('/clearcookies', (req, res, next) => {
        for (var prop in req.cookies) {
            console.log('clearing ' + prop + ': ' + req.cookies[prop]);
            res.clearCookie(prop, { path: '/' });
        }
        res.send('cookies cleared');
    });

    router.post('/checkuser', (req, res, next) => {
        console.log(req.body);
        userManager.findUser(req.body.username, (user) => {
            res.send({ isAvailable: !user });
        });
    });

    router.post('/checkpassword', (req, res, next) => {
        userManager.checkPasswordStrength(req.body.password, (isValid, msgs) => {
            res.send({ isValid: isValid, msg: msgs });
        });
    });

    function register(req: express.Request, res: express.Response): any {
        var username: string = req.body['username'];
        var password: string = req.body['password'];
        var confirmPassword: string = req.body['confirm_password'];

        if (username == '' || password == '' || password != confirmPassword) {
            return res.status(400).send('Password and confirm password did not match');
        }

        userManager.register(username, password, (err, result) => {
            if (err !== 200) {
                return res.status(err).json(result);
            }
            res.sendStatus(200);
        });
    }

    function login(req: express.Request, res: express.Response): any {

        var username = req.body['username'];
        var password = req.body['password'];
        var remember = 'true' === req.body['remember'];

        if (!username || !password) {
            return res.sendStatus(400);
        }

        userManager.authenticate(username, password, (user) => {
            if (!user) {
                return res.sendStatus(401)
            }

            if (remember) {
                var token = tokenManager.create(user, '10d');
                res.cookie('ACCESS-TOKEN', token, { httpOnly: true });
                res.sendStatus(200);
            }
            else {
                var token = tokenManager.create(user, '1d');
                res.json(token);
            }
        });
    }

    function token(req: express.Request, res: express.Response): void {
        var token = tokenManager.create(req.user, '1d');
        res.json(token);
    }

    // add routes to app
    app.use(router);
}
