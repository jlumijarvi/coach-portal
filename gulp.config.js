module.exports = function () {

	var root = __dirname + '/';
	var build = root + 'build/';

    var config = {
		root: root,
		build: build,
		src: root + 'src/',
		ts: '**/*.ts',
		data: 'data/**.*',
		views: '**/*.html',
		server: build + 'app.js',
		defaultPort: 4000
	};

	return config;
};
