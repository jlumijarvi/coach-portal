/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';

export function notFoundMiddleware(req: express.Request, res: express.Response, next: Function) {
    send404(req, res, 'API endpoint not found');
}

export function send404(req: express.Request, res: express.Response, description: string) {
    var data = {
        status: 404,
        message: 'Not Found',
        description: description,
        url: req.url
    };
    res.status(404)
        .send(data)
        .end();
}
