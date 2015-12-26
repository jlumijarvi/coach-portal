module.exports = function () {

	var $ = require('gulp-load-plugins')({ lazy: true });
	var del = require('del');

	var utils = {
		clean: clean,
		cleanSync: cleanSync,
		log: log,
		plugins: $,
		base: base,
		concatDirs: concatDirs
	};

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

	function base(f) {
		return f.base;
	}
	
	function concatDirs(prefix, suffix) {
		var ret = [];
		for (var i = 0; i < prefix.length; i++) {
			for (var ii = 0; ii < suffix.length; ii++) {
				ret.push(prefix[i] + suffix[ii]);
			}
		}
		return ret;
	}

	return utils;
};
