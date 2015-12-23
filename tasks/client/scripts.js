var gulp = require('gulp');
var config = require('../../gulp.config').client();
var utils = require('../utils')();
var $ = utils.plugins;

gulp.task('scripts', ['clean-scripts'], function () {
    var jsFilter = $.filter('**/*.js', { restore: true });
    var tsFilter = $.filter('**/*.ts', { restore: true });

    return gulp
        .src(config.src + 'app/**/*.*')
        .pipe($.plumber())
        .pipe(jsFilter)
        .pipe(gulp.dest(config.build + 'app/'))
        .pipe(jsFilter.restore)
        .pipe(tsFilter)
        .pipe($.typescript())
        .pipe(gulp.dest(config.build + 'app/'))
});

gulp.task('clean-scripts', function () {
    return utils.clean(config.build + config.scripts);
});
