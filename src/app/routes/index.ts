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

export function init() {

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

    router.get('/ping', function(req, res, next) {
        console.log(req.body);
        res.send('pong');
    });

    router.get('/clearcookies', function(req, res, next) {
        for (var prop in req.cookies) {
            console.log('clearing ' + prop + ': ' + req.cookies[prop]);
            res.clearCookie(prop, { path: '/' });
        }
        res.send('cookies cleared');
    });

    function register(req: express.Request, res: express.Response): any {
        var username = req.body['username'];
        var password = req.body['password'];
        var confirmPassword = req.body['confirm_password'];

        if (username == '' || password == '' || password != confirmPassword) {
            return res.sendStatus(400);
        }
        
        userManager.register(username, password, (err, user) => {
            if (!user) {
                return res.sendStatus(err);
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

    return router;
}
