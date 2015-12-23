var gulp = require('gulp');
var config = require('../gulp.config').common();
var utils = require('./utils')();

var $ = utils.plugins;

gulp.task('publish', function () {
    return gulp
        .src(config.build + '**/*.*')
        .pipe($.zip('publish.zip'))
        .pipe(gulp.dest(config.build));
});

gulp.task('clean-all', function () {
    utils.log('Cleaning everything...')
    return utils.clean(config.build);
});

gulp.task('tsconfig', function () {
    return gulp
        .src(config.src + config.ts)
        .pipe($.tsconfigUpdate());
});
