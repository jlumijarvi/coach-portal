var gulp = require('gulp');
var del = require('del');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({ lazy: true });

var envenv = $.util.env;
var port = process.env.PORT || config.defaultPort;

function clean(files) {
    log('Deleting ' + files);
    return del(files);
}

function cleanSync(files) {
    log('Deleting ' + files);
    return del.sync(files);
}

function log(msg) {
    var color = $.util.colors.blue;
    return $.util.log(color(msg));
}

function watch(files, task) {
    return $.watch(files, $.batch(function (events, done) {
        gulp.start(task, done).on('error', function (err) {
            log(err);
            this.emit('end');
        });
    }));
}

function serve(isDev) {
    var opts = {
        script: config.server,
        delayTime: 3000,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'production'
        },
        watch: [config.build]
    };

    return $.nodemon(opts)
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
        })
        .on('start', function () {
            log('*** nodemon started');
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

gulp.task('scripts', ['clean-scripts'], function () {

    return gulp
        .src(config.src + config.ts)
        .pipe($.plumber())
        .pipe($.typescript({ module: 'commonjs' }))
        .pipe(gulp.dest(config.build))
});

gulp.task('clean-scripts', function () {
    return clean([config.build + 'api/']);
});

gulp.task('data', ['clean-data'], function () {
    return gulp
        .src(config.src + config.data)
        .pipe(gulp.dest(config.build + 'data/'));
});

gulp.task('clean-data', function () {
    return clean(config.build + config.data);
});

gulp.task('favicon', ['clean-favicon'], function () {
    return gulp
        .src(config.src + 'public/favicon.ico')
        .pipe(gulp.dest(config.build + 'public/'));
});

gulp.task('clean-favicon', function () {
    return clean(config.build + 'public/favicon.ico');
});

gulp.task('views', ['clean-views'], function () {
    return gulp
        .src(config.src + 'public/**/*.*')
        .pipe(gulp.dest(config.build + 'public/'));
});

gulp.task('clean-views', function () {
    return clean(config.build + 'views');
});

gulp.task('clean', function () {
    return clean(config.build);
});

gulp.task('watch', function () {
    watch(config.src + config.ts, ['tsconfig', 'scripts']);
    watch(config.src + config.views, ['views']);
    watch(config.src + config.data, ['data']);
});

gulp.task('start', function (done) {
    serve(true);
    done();
});

gulp.task('tsconfig', function () {
    return gulp
        .src(config.src + config.ts)
        .pipe($.tsconfigUpdate());
});

gulp.task('tsdhack', function () {
    gulp.src('typings/requirejs/require.d.ts')
        .pipe($.replace('declare var require: Require;', 'declare var require: NodeRequire;'))
        .pipe(gulp.dest(function(f) {
            return f.base;
        }));
});

gulp.task('build', ['tsconfig', 'scripts', 'data', 'views', 'favicon']);
gulp.task('build-start', ['build', 'watch'], function () {
    return gulp.start('start');
});

gulp.task('clean-build', ['clean'], function () {
    gulp.start('build');
});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);
