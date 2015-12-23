/// <reference path="../../../../typings/tsd.d.ts" />

'use strict';

import * as fs from 'fs';

export function getJsonFromFile(file: string) {
    var json = getConfig(file);
    return json;
}

export function readJsonFileSync(filepath: string, encoding?: string) {
    if (typeof (encoding) === 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

export function getConfig(file: string) {
    var filepath = __dirname + file;
    return readJsonFileSync(filepath);
}

