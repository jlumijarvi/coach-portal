var root = __dirname + '/';
var build = root + 'build/';

exports.common = function () {
    var config = {
        root: root,
        build: build,
        src: root + 'src/',
        ts: '**/*.ts'
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
