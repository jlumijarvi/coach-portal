var gulp = require('gulp');
var argv = require('yargs').argv;
var browserSync = require('browser-sync');

var utils = require('./gulp.utils')();
var _config = require('./gulp.config');

var $ = utils.plugins;
var config = _config.common();

var envenv = $.util.env;
var port = process.env.PORT || config.defaultPort;

gulp.task('scripts', ['clean-scripts'], function () {

    return gulp
        .src(config.src + config.ts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.typescript({ module: 'commonjs' }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.src))
});

gulp.task('tsconfig', function () {
    return gulp
        .src(config.src + config.ts)
        .pipe($.tsconfigUpdate());
});

gulp.task('clean-scripts', function () {
    return utils.clean(config.src + config.js);
});

gulp.task('styles', ['clean-styles'], function () {
    return gulp
        .src(config.client + config.sass)
        .pipe($.plumber())
        .pipe($.sass.sync())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.client + 'styles/'));
});

// gulp-sassbeautify seems not be working
gulp.task('format-sass', function () {
    return gulp.src(config.client + config.sass)
        .pipe($.plumber())
        .pipe($.shell([
            'sass-convert <%= file.path %> <%= file.path %>'
        ]));
});

gulp.task('clean-styles', function () {
    return utils.clean(config.client + config.styles);
});

gulp.task('favicons', ['compile-favicons'], function () {
    return gulp
        .src(config.index)
        .pipe($.prettify({ indent_size: 2 }))
        .pipe(gulp.dest(utils.base));
});

gulp.task('compile-favicons', ['clean-favicons'], function () {
    return gulp
        .src(config.logo)
        .pipe($.plumber())
        .pipe($.favicons(config.faviconOptions))
        .pipe(gulp.dest(config.client + 'favicons/'));
});

gulp.task('clean-favicons', function () {
    return utils.clean(config.client + 'favicons/');
});

gulp.task('tsdhack', function () {
    return gulp
        .src('./typings/requirejs/require.d.ts')
        .pipe($.replace('declare var require: Require;', 'declare var require: NodeRequire;'))
        .pipe(gulp.dest(utils.base));
});

gulp.task('inject', ['scripts', 'styles'], function () {
    return inject();
});

gulp.task('build', ['favicons'], function() {
    gulp.start('inject');
});

gulp.clean('clean', ['clean-scripts', 'clean-styles', 'clean-favicons'], function() {
    return utils.clean(config.build);
});

gulp.task('watch', function () {
    watch(config.src + config.ts, ['tsconfig', 'inject']);
    watch(config.src + config.sass, ['inject']);
    watch(config.bower.jsonPath, ['bower', 'inject']);
    watch(config.src + config.logo, ['favicons']);
});

gulp.task('build-watch', ['build'], function () {
    gulp.start('watch');
});

gulp.task('browser-sync', function () {

    var options = {
        server: {
            baseDir: config.client
        },
        startPath: '/'
    };

    options.logLevel = 'debug';
    options.logPrefix = 'coach-portal';

    browserSync.init(options);
});

gulp.task('start', ['browser-sync', 'watch']);

gulp.task('start-server', function () {
    serve(true);
});


// Build optimization tasks
gulp.task('release', ['templatecache'], function () {
    return gulp
        .src([
            config.client + '**/*.*',
            '!' + config.client + '**/*.ts',
            '!' + config.client + '**/*.scss',
            '!' + config.client + '_index.html'
        ])
        .pipe($.if('images/**/*.*', $.imagemin({ optimizationLevel: 4 })))
        .pipe(gulp.dest(config.build));
});

gulp.task('templatecache', ['clean-templatecache'], function () {
    return gulp
        .src(config.client + config.templates)
        .pipe($.minifyHtml())
        .pipe($.angularTemplatecache({ root: '/app/', module: 'app' })) // templates.js
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-templatecache', function () {
    return utils.clean(config.temp);
});

gulp.task('optimize', ['release'], function () {

    // we need to inject the template cache
    var sources = [
        config.client + 'app/app.js',
        config.client + config.scripts,
        '../.tmp/templates.js'
    ];
    var options = {
        read: false,
        addRootSlash: false
    };

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(sources, { cwd: config.client }), options))
        .pipe($.useref())
        .pipe($.if('app/**/*.js', $.ngAnnotate()))
        .pipe($.if('**/*.js', $.uglify()))
        .pipe($.if('**/*.js', $.rev()))
        .pipe($.if('**/*.css', $.csso()))
        .pipe($.if('**/*.css', $.rev()))
        .pipe($.revReplace())
        .pipe($.if('**/*.html', $.minifyHtml()))
        .pipe(gulp.dest(config.build));
});

gulp.task('clean-optimize', ['clean-templatecache'], function () {
    return utils.clean(config.build);
});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

function inject() {
    var sources = [
        config.client + config.styles,
        config.client + 'app/app.js',
        config.client + config.scripts
    ];
    var srcOptions = {
        read: false,
        cwd: config.client
    };

    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        bowerJson: config.bower.json(),
        directory: config.bower.directory,
        ignorePath: '../..'
    };

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(sources, srcOptions), { addRootSlash: false }))
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest(config.client));
}

function watch(files, task) {
    return $.watch(files, $.batch(function (events, done) {
        gulp.start(task, done).on('error', function (err) {
            utils.log(err);
            this.emit('end');
        });
    }));
}

function serve(isDev) {
    var opts = {
        script: config.server + 'app.js',
        delayTime: 3000,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'production'
        },
        watch: [config.server]
    };

    return $.nodemon(opts)
        .on('restart', function (ev) {
            utils.log('*** nodemon restarted');
            utils.log('files changed:\n' + ev);
        })
        .on('start', function () {
            utils.log('*** nodemon started');
        })
        .on('crash', function () {
            utils.log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            utils.log('*** nodemon exited cleanly');
        });
}
