module.exports = function () {

	var root = __dirname + '/';
	var build = root + 'build/';

    var config = {
		root: root,
		build: build,
		debug: build + 'debug/',
		release: build + 'release/',
		src: root + 'src/',
		ts: '**/*.ts',
		data: 'data/**.*',
		views: '**/*.html',
		debugServer: build + 'debug/app.js',
		releaseServer: build + 'release/app.js',
		defaultPort: 4000
	};

	return config;
};
