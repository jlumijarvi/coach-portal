var root = __dirname + '/';
var build = root + 'build/';
var client = root + 'src/client/';
var server = root + 'src/server/';

exports.common = function () {
    var config = {
        root: root,
        build: build,
        client: client,
        server: server,
        src: root + 'src/',
        ts: '**/*.ts',
        js: '**/*.js',
        sass: 'styles/**/*.scss',
        styles: 'styles/**/*.css',
        scripts: 'app/**/*.js',
        bower: {
            json: function () { return require('./bower.json'); },
            directory: './bower_components/',
            jsonPath: './bower.json'
        },
        index: client + 'index.html',
        faviconOptions: {
            background: '#fff',
            path: 'favicons/',
            display: "standalone",
            orientation: "portrait",
            version: '1.0',
            logging: false,
            online: false,
            html: client + 'index.html',
            replace: true
        },
        logo: client + 'images/logo.png',
        templates: client + 'app/**/*.html',
        fonts: root + 'bower_components/font-awesome/fonts/**/*.*',
        temp: build + '.tmp/',
        defaultPort: 4000
    };

    return config;
}

exports.server = function () {

    var config = {
        root: root,
        build: build,
        src: root + 'src/server/',
        ts: '**/*.ts',
        data: 'data/**.*',
        views: 'views/**/*.html',
        server: build + 'app.js',
        defaultPort: 4000
    };

    return config;
};

exports.client = function () {

    var clientBuild = build + 'public-dev/';

    var config = {
        root: root,
        build: clientBuild,
        optimized: build + 'public/',
        src: root + 'src/client/',
        index: 'index.html',
        favicon: 'favicon.ico',
        templates: 'app/**/*.html',
        ts: 'app/**/*.ts',
        js: 'app/**/*.js',
        scripts: 'app/**/*.js',
        less: 'styles/**/*.less',
        sass: 'styles/**/*.scss',
        styles: 'styles/**/*.css',
        images: 'images/**/*.*',
        videos: 'videos/**/*.*',
        data: 'app/data/**/*.*',
        fonts: 'fonts/**/*.*',
        bower: {
            json: function () { return require(root + 'bower.json'); },
            directory: root + 'bower_components/',
            jsonPath: root + 'bower.json'
        },
        temp: build + '.tmp/',
        logo: root + 'src/client/images/logo.png',
        faviconOptions: {
            background: '#fff',
            path: 'favicons/',
            display: "standalone",
            orientation: "portrait",
            version: '1.0',
            logging: false,
            online: false,
            html: clientBuild + 'index.html',
            replace: true
        }
    };

    return config;
};
