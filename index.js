var $fs = require('fs');
var $path = require('path');

var $gutil = require('gulp-util');
var $through = require('through2');
var $walkSync = require('walk-sync');

var PLUGIN_NAME = 'gulp-md5name-replace';

function replaceMd5(options){

	options = typeof(options) === 'object' ? options : {};

	var defaults = {

	};

	var conf = {};
	Object.keys(options).forEach(function(key){
		conf[key] = defaults[key] || options[key];
	});

	return $through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new $gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }

        console.log(file);

        this.push(file);

		callback();

    });

}

module.exports = replaceMd5;
