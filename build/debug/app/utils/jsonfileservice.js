/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var fs = require('fs');
function getJsonFromFile(file) {
    var json = getConfig(file);
    return json;
}
exports.getJsonFromFile = getJsonFromFile;
function readJsonFileSync(filepath, encoding) {
    if (typeof (encoding) === 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}
exports.readJsonFileSync = readJsonFileSync;
function getConfig(file) {
    var filepath = __dirname + file;
    return readJsonFileSync(filepath);
}
exports.getConfig = getConfig;
