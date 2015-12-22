/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as four0four from '../utils/404';

export = (app: express.Express) => {
    
    app.use(errorHandler);
    app.use(require('./v1')('/api/'));
    app.use(require('./v1')());
    app.get('/api/' + '*', four0four.notFoundMiddleware);

    function errorHandler(err: any, req: express.Request, res: express.Response, next: Function) {
        console.log('error in API');
        console.log(err);
        if (err.status === 401) {
            return res.sendStatus(401);
        }
        next(err);
    }
}
