/// <reference path="../../../typings/tsd.d.ts" />

'use strict';

export class TaskCounter {
    tasks: number = 0;
    cb: any;
    
    constructor(cb) {
        this.cb = cb;
    }
    
    inc = () => {
        ++this.tasks;
    }
    dec = (err?, ...params): boolean => {
        --this.tasks;
        if (this.tasks == 0) {
            return !!params && params.length > 0 ? this.cb(err, params) : this.cb(err);
        }
        return true;
    }
}
