/// <reference path="../typings/tsd.d.ts" />
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mvc = require('./app/routes');
var api = require('./app/routes/api');
var errorHandler = require('./app/utils/errorHandler');
var secret = require('./app/auth/secret');
var db = require('./app/db');
// initialize app
var app = express();
var port = process.env.PORT || 4000;
var environment = process.env.NODE_ENV;
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(errorHandler.init);
app.use(cookieParser(secret.secretToken));
db.init();
// register api routes
app.use(api.init());
// register MVC routes
app.use(mvc.init());
console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);
switch (environment) {
    case 'release':
        console.log('** RELEASE **');
        app.use(express.static('./build/release/public'));
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/release/public/index.html'));
        break;
    default:
        console.log('** DEBUG **');
        app.use(express.static('./build/debug/public'));
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/debug/public/index.html'));
        break;
}
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});
