var root = __dirname + '/';
var build = root + 'build/';
var src = root + 'src/';
var client = src + 'client/';
var server = src + 'server/';

module.exports = function () {

    var config = {
        root: root,
        build: build,
        client: client,
        server: server,
        src: src,
        ts: '**/*.ts',
        js: '**/*.js',
        sass: client + 'styles/**/*.scss',
        styles: client + 'styles/**/*.css',
        scripts: client + 'app/**/*.js',
        index: client + 'index.html',
        logo: client + 'images/logo.png',
        templates: client + 'app/**/*.html',
        views: server + 'views/**/*.html',
        fonts: root + 'bower_components/font-awesome/fonts/**/*.*',
        temp: build + '.tmp/',
        bower: {
            json: function () { return require(root + 'bower.json'); },
            directory: root + 'bower_components/',
            jsonPath: root + 'bower.json'
        },
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
        defaultPort: 4000,
        port: function() {
            return process.env.PORT || config.defaultPort;
        }
    };

    return config;
}
