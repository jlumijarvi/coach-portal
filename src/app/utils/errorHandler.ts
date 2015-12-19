/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';

export function init(err: any, req: express.Request, res: express.Response, next: Function) {
    var status = err.statusCode || 500;
    if (err.message) {
        res.status(status).send(err.message);
    } else {
        res.send(status, err);
    }
    next();
}

export function logErrors(err: any, req: express.Request, res: express.Response, next: Function) {
    var status = err.statusCode || 500;
    console.error(status + ' ' + (err.message ? err.message : err));
    if (err.stack) {
        console.error(err.stack);
    }
    next(err);
}

