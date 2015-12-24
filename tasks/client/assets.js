var gulp = require('gulp');
var config = require('../../gulp.config').client();
var utils = require('../utils')();

gulp.task('assets', ['images', 'videos', 'data'])

gulp.task('images', ['clean-images'], function () {
    return gulp
        .src(config.src + config.images)
        .pipe(gulp.dest(config.build + 'images/'));
});

gulp.task('clean-images', function () {
    return utils.clean(config.build + config.images);
});

gulp.task('videos', ['clean-videos'], function () {
    return gulp
        .src(config.src + config.videos)
        .pipe(gulp.dest(config.build + 'videos/'));
});

gulp.task('clean-videos', function () {
    return utils.clean(config.build + config.videos);
});

gulp.task('data', ['clean-data'], function () {
    return gulp
        .src(config.src + config.data)
        .pipe(gulp.dest(config.build + 'app/data/'));
});

gulp.task('clean-data', function () {
    return utils.clean(config.build + config.data);
});
