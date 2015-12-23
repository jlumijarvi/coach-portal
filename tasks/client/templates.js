var gulp = require('gulp');
var config = require('../../gulp.config').client();
var utils = require('../utils')();
var $ = utils.plugins;

gulp.task('templates', ['clean-templates'], function () {
    return gulp
        .src(config.src + config.templates)
        .pipe($.plumber())
        .pipe(gulp.dest(config.build + 'app/'));
});

gulp.task('clean-templates', function() {
    return utils.clean(config.build + config.templates);
});
