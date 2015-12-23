var gulp = require('gulp');
var config = require('../../gulp.config').client();
var utils = require('../utils')();
var $ = utils.plugins;

gulp.task('fonts', ['clean-fonts'], function () {
    return gulp.src(config.src + 'fonts.list')
        .pipe($.googleWebfonts())
        .pipe(gulp.dest(config.build + config.fonts));
});

gulp.task('clean-fonts', function () {
    return utils.clean(config.build + config.fonts);
});
