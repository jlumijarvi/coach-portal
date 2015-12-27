/// <reference path="../../typings/tsd.d.ts" />

'use strict';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as ejs from 'ejs';
import * as _ from 'underscore';
import * as errorHandler from './utils/errorHandler';
import * as four0four from './utils/404';
import * as secret from './auth/secret';
import * as db from './db';

// initialize app
var app = express();
var port = process.env.PORT || 4000;
var environment = process.env.NODE_ENV || 'dev';

var root = __dirname + '/';
var publicDir = (environment === 'production' ? './build/' : './src/client/');

app.use(favicon(publicDir + 'favicons/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compress());
app.use(logger(environment));
app.use(errorHandler.init);
app.use(cookieParser(secret.secretToken));

// register api routes
require('./routes/api')(app);

// register MVC routes
require('./routes')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
    case 'production':
        console.log('** PRODUCTION **');
        app.use(express.static(publicDir));
        // Any deep link calls should return index.html
        app.use('/*', express.static(publicDir + 'index.html'));
        break;
    case 'dev':
    default:
        console.log('** DEVELOPMENT **');
        app.use(express.static(publicDir));
        app.use(express.static('./'));
        // Any deep link calls should return index.html
        app.use('/*', express.static(publicDir + 'index.html'));
        break;
}

app.listen(port, () => {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});

db.init((err) => {
    if (err) {
        console.log('db intialization error');
    }
    else {
        console.log('db intialized');
    }
});
