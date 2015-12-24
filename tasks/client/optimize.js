var gulp = require('gulp');
var config = require('../../gulp.config').client();
var utils = require('../utils')();
var vinylPaths = require('vinyl-paths');
var $ = utils.plugins;

gulp.task('release', ['templatecache'], function () {
    return gulp
        .src([
            config.build + '**/*.*',
            '!' + config.build + 'app/**/*.*',
            '!' + config.build + 'styles/**/*.css',
            '!' + config.build + 'bower_components/**/*.*'
        ])
        .pipe($.if('images/**/*.*', $.imagemin({ optimizationLevel: 4 })))
        .pipe(gulp.dest(config.optimized));
});

gulp.task('optimize', ['release'], function () {

    // we need to inject the template cache
    var sources = [
        config.build + 'app/app.js',
        config.build + config.scripts,
        '../.tmp/templates.js'
    ];
    var options = {
        read: false,
        addRootSlash: false
    };

    return gulp
        .src(config.build + config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(sources, { cwd: config.build }), options))
        .pipe($.useref())
        .pipe($.if('app/**/*.js', $.ngAnnotate()))
        .pipe($.if('**/*.js', $.uglify()))
        .pipe($.if('**/*.js', $.rev()))
        .pipe($.if('**/*.css', $.csso()))
        .pipe($.if('**/*.css', $.rev()))
        .pipe($.revReplace())
        .pipe($.if('**/*.html', $.minifyHtml()))
        .pipe(gulp.dest(config.optimized));
});

gulp.task('clean-optimize', ['clean-templatecache'], function() {
    return utils.clean(config.optimized);
});

gulp.task('templatecache', ['clean-templatecache'], function () {
    return gulp
        .src(config.build + config.templates)
        .pipe($.minifyHtml())
        .pipe($.angularTemplatecache({ root: '/app/', module: 'app' })) // templates.js
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-templatecache', function () {
    return utils.clean(config.temp);
});
