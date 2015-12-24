var gulp = require('gulp');
var config = require('../gulp.config').client();
var utils = require('./utils')();
var browserSync = require('browser-sync');
var requireDir = require('require-dir');
var argv = require('yargs').argv;

var $ = utils.plugins;
var tasks = requireDir('./client');

function inject() {
    var sources = [
        config.build + config.styles,
        config.build + 'app/app.js',
        config.build + config.scripts
    ];
    var srcOptions = {
        read: false,
        cwd: config.build
    };

    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        bowerJson: config.bower.json(),
        directory: config.bower.directory,
        ignorePath: '../../'
    };

    return gulp
        .src(config.src + config.index)
        .pipe($.inject(gulp.src(sources, srcOptions), { addRootSlash: false }))
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest(config.build));
}

function watch(files, task) {
    return $.watch(files, $.batch(function (events, done) {
        gulp.start(task, done).on('error', function (err) {
            utils.log(err);
            this.emit('end');
        });
    }));
}

gulp.task('clean', function () {
    return utils.clean(config.build);
});

gulp.task('inject', ['scripts', 'templates', 'styles', 'assets', 'bower'], function () {
    return inject();
});

gulp.task('build', ['favicons'], function () {
    gulp
        .src(config.build + config.index)
        .pipe($.prettify({ indent_size: 2 }))
        .pipe(gulp.dest(function (f) {
            return f.base;
        }));
});

gulp.task('clean-build', ['clean'], function (done) {
    gulp.start('build');
});

gulp.task('bower', ['clean-bower'], function () {
    return gulp
        .src(config.bower.directory + '**/*.*')
        .pipe(gulp.dest(config.build + 'bower_components'));
});

gulp.task('clean-bower', function () {
    return utils.clean(config.build + 'bower_components');
});

gulp.task('watch', function () {
    if (argv.r) {
        return;
    }

    watch(config.src + config.index, ['inject']);
    watch(config.src + config.logo, ['favicons']);
    watch(config.src + config.templates, ['templates']);
    watch(config.src + config.ts, ['tsconfig', 'inject']);
    watch(config.src + config.js, ['inject']);
    watch(config.src + config.sass, ['inject']);
    watch(config.src + config.images, ['images']);
    watch(config.src + config.videos, ['videos']);
    watch(config.src + config.data, ['data']);
    watch(config.bower.jsonPath, ['bower', 'inject']);
});

gulp.task('build-watch', ['build'], function () {
    gulp.start('watch');
});

// Static server
gulp.task('browser-sync', function () {

    var baseDir = argv.r ? '../build/public/' : './build/public-dev/';

    var options = {
        server: {
            baseDir: baseDir
        },
        startPath: '/'
    };

    options.logLevel = 'debug';
    options.logPrefix = 'coach-portal';

    browserSync.init(options);
});

gulp.task('favicons', ['clean-favicons', 'inject'], function () {
    return gulp
        .src(config.logo).pipe($.favicons(config.faviconOptions))
        .pipe(gulp.dest(config.build + 'favicons/'));
});

gulp.task('clean-favicons', function () {
    return utils.clean(config.build + 'favicons/');
});

gulp.task('start', ['browser-sync', 'watch']);

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);
