var gulp = require('gulp');
var config = require('../../gulp.config').client();
var utils = require('../utils')();
var $ = utils.plugins;

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function () {
    return gulp
        .src(config.src + config.sass)
        .pipe($.plumber())
        .pipe($.sass.sync())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.build + 'styles/'));
});

// gulp-sassbeautify seems not be working
gulp.task('format-sass', function () {
    return gulp.src(config.src + config.sass)
        .pipe($.plumber())
        .pipe($.shell([
            'sass-convert <%= file.path %> <%= file.path %>'
        ]));
});

/**
 * Remove all styles from the debug build folder
 * @param  {Function} cb - callback when complete
 */
gulp.task('clean-styles', function () {
    return utils.clean(config.build + config.styles);
});
