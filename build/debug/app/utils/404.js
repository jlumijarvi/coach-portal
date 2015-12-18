/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
function notFoundMiddleware(req, res, next) {
    send404(req, res, 'API endpoint not found');
}
exports.notFoundMiddleware = notFoundMiddleware;
function send404(req, res, description) {
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
exports.send404 = send404;
