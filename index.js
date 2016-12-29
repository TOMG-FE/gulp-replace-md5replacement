var $fs = require('fs');
var $path = require('path');

var $gutil = require('gulp-util');
var $walkSync = require('walk-sync');

function md5Replacement(options) {

	options = typeof(options) === 'object' ? options : {};

	var defaults = {
		cwd: './',
		globs: [
			'**/*.js'
		]
	};

	var conf = {};
	Object.keys(options).forEach(function(key) {
		conf[key] = defaults[key] || options[key];
	});

	var search;
	var replacement;

	return {
		search: search,
		replacement: replacement
	};

}

module.exports = md5Replacement;