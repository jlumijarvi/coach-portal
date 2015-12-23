/// <reference path="../../../../typings/tsd.d.ts" />

'use strict';

import * as mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
    name: string;
    description: string;
}

export var roleNames = ['admin', 'tenant-admin', 'user'];

export var RoleScema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: roleNames
    },
    description: {
        type: String,
        default: ''
    }
});

export var Role = mongoose.model<IRole>('Role', RoleScema);
