var gulp = require('gulp');
var argv = require('yargs').argv;

require('./tasks/common');

if (argv.client) {
    require('./tasks/client');
}
else if (argv.server) {
    require('./tasks/server');
}
