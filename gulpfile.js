var gulp = require('gulp');
var argv = require('yargs').argv;
var browserSync = require('browser-sync');
var vinylPaths = require('vinyl-paths');

var utils = require('./gulp.utils')();
var config = require('./gulp.config')();

var $ = utils.plugins;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);


/**
 * Transpile typescript.
 * Update tsconfig.json
 */
gulp.task('scripts', ['tsconfig', 'clean-scripts'], function () {
    return typescript(config.src, false);
});

/**
 * Clean transpiled js
 */
gulp.task('clean-scripts', function () {
    return utils.clean(config.src + config.js);
});

gulp.task('scripts-server', function () {
    utils.cleanSync(config.server + config.js);
    return typescript(config.server);
});

gulp.task('scripts-client', function () {
    utils.cleanSync(config.client + config.js);
    return typescript(config.client);
});

/**
 * Update tsconfig.json
 */
gulp.task('tsconfig', function () {
    return gulp
        .src(config.src + config.ts)
        .pipe($.tsconfigUpdate());
});

/**
 * Compiles sass into css. Autoformat sass files.
 */
gulp.task('styles', ['format-sass', 'clean-styles'], function () {
    return gulp
        .src(config.sass)
        .pipe($.plumber())
        .pipe($.sass.sync())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.client + 'styles/'));
});

/**
 * Clean compiled css.
 */
gulp.task('clean-styles', function () {
    return utils.clean(config.styles);
});

/**
 * Auto-format sass files.
 */
gulp.task('format-sass', function () {
    return gulp
        .src(config.sass)
        .pipe($.plumber())
        .pipe($.shell([
            'sass-convert <%= file.path %> <%= file.path %>'
        ]));
});

/**
 * Create favicons based on logo. Index.html is automatically injected. Prettify index.html in the end. 
 */
gulp.task('favicons', ['create-favicons'], function () {
    return gulp
        .src(config.index)
        .pipe($.replace('favicons\\', 'favicons/'))
        .pipe($.replace('\\favicons', '/favicons'))
        .pipe($.prettify({ indent_size: 2 }))
        .pipe(gulp.dest(utils.base));
});

/**
 * Create favicons based on logo.
 */
gulp.task('create-favicons', ['clean-favicons'], function () {
    return gulp
        .src(config.logo)
        .pipe($.plumber())
        .pipe($.favicons(config.faviconOptions))
        .pipe(gulp.dest(config.client + 'favicons/'));
});

/**
 * Cleans created favicons.
 */
gulp.task('clean-favicons', function () {
    return utils.clean(config.client + 'favicons/');
});

/**
 * This hack is needed so that typescript plays nicely with requirejs.
 */
gulp.task('tsdhack', function () {
    return gulp
        .src('./typings/requirejs/require.d.ts')
        .pipe($.replace('declare var require: Require;', 'declare var require: NodeRequire;'))
        .pipe(gulp.dest(utils.base));
});

gulp.task('inject', ['scripts-client', 'styles'], function () {
    var sources = [
        config.styles,
        config.client + 'app/app.js',
        config.scripts
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
});

gulp.task('prebuild', ['inject', 'favicons', 'scripts-server']);

gulp.task('clean', ['clean-scripts', 'clean-styles', 'clean-favicons', 'clean-build'], function () {
    return utils.clean(config.build);
});

gulp.task('watch', function () {
    watch(config.server + config.ts, function() {
        typescript(config.server);
    });
    watch(config.client + config.ts, ['inject']);
    watch(config.client + config.sass, ['inject']);
    watch(config.bower.jsonPath, ['bower', 'inject']);
    watch(config.logo, ['favicons']);
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

gulp.task('serve-client', ['browser-sync', 'watch']);

gulp.task('serve-dev', ['prebuild'], function () {
    gulp.start('watch');
    return serve(true);
});

gulp.task('serve-production', ['build'], function () {
    return serve(false);
});

/**
 * Build everything. Optimize client side code and put into build folder. 
 */
gulp.task('build', ['clean-build'], function (done) {
    var counter = 2;
    return gulp.start('optimize', 'fonts').on('task_stop', function (ev) {
        if (!(ev.task === 'optimize' || ev.task === 'fonts')) {
            return;
        }
        if (--counter === 0) {
            gulp
                .src([
                    config.client + '**/*.*',
                    '!' + config.client + '**/*.html',
                    '!' + config.client + '**/*.js',
                    '!' + config.client + '**/*.ts',
                    '!' + config.client + '**/*.css',
                    '!' + config.client + '**/*.scss'
                ])
                .pipe($.if('images/**/*.*', $.imagemin({ optimizationLevel: 4 })))
                .pipe(gulp.dest(config.build));

            done();
        }
        if (ev.task === 'optimize') {
            utils.clean(config.temp);
        }
    });
});

gulp.task('clean-build', function () {
    return utils.clean(config.build);
});

gulp.task('templatecache', ['clean-templatecache'], function () {
    return gulp
        .src(config.templates)
        .pipe($.minifyHtml())
        .pipe($.angularTemplatecache({ root: '/app/', module: 'app' })) // templates.js
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-templatecache', function () {
    return utils.clean(config.temp);
});

gulp.task('fonts', ['clean-fonts'], function () {
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts/'));
});
gulp.task('clean-fonts', function () {
    return utils.clean(config.build + 'fonts/');
});

gulp.task('optimize', ['prebuild', 'templatecache'], function () {

    // we need to inject the template cache
    var sources = [
        config.styles,
        config.client + 'app/app.js',
        config.scripts,
        '../../build/.tmp/templates.js'
    ];
    var srcOptions = {
        read: false,
        cwd: config.client
    };

    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        bowerJson: config.bower.json(),
        directory: config.bower.directory
    };

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(sources, srcOptions), { addRootSlash: false }))
        .pipe(wiredep(wiredepOptions))
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

function watch(files, task) {
    return $.watch(files, $.batch(function (events, done) {
        if (typeof task === 'function') {
            task();
            this.emit('end');
        }
        else {
            gulp.start(task, done).on('error', function (err) {
                utils.log(err);
                this.emit('end');
            });
        }
    }));
}

function typescript(dir, sourceMaps) {
    utils.log('Transpile files in ' + dir);
    return gulp
        .src(dir + config.ts)
        .pipe($.plumber())
        .pipe($.if(!!sourceMaps, $.sourcemaps.init()))
        .pipe($.typescript({ module: 'commonjs' }))
        .pipe($.if(!!sourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(dir))
}

function serve(isDev) {
    var opts = {
        script: config.server + 'app.js',
        delayTime: 3000,
        env: {
            'PORT': config.port(),
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
