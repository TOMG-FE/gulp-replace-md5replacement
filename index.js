var $fs = require('fs');
var $path = require('path');

var $gulpUtil = require('gulp-util');
var $walkSync = require('walk-sync');

var DEVELOPMENT = false;

function substitute(str, obj, reg){
	return str.replace(reg || (/\\?\{\{([^{}]+)\}\}/g), function(match, name){
		if (match.charAt(0) === '\\'){
			return match.slice(1);
		}
		//注意：obj[name] != null 等同于 obj[name] !== null && obj[name] !== undefined
		return (obj[name] != null) ? obj[name] : '';
	});
}

function md5Replacement(options) {

	options = typeof(options) === 'object' ? options : {};

	var conf = {
		// 文件名子匹配正则字符串
		name: 'css/\\w+',

		// 分隔符
		split: '-',

		// md5子匹配正则字符串
		hash: '\\w+',

		// html文件路径匹配模板
		template: '../{{name}}{{split}}{{hash}}.css',

		// md5 文件所在的目录
		cwd: './css',

		// md5 文件选择器
		globs: [
			'**/*.css'
		]
	};

	Object.keys(options).forEach(function(key) {
		conf[key] = options[key] || conf[key];
	});

	var search;
	var replacement;

	var files = $walkSync(conf.cwd, {
		directories: false,
		globs: conf.globs
	});

	if(DEVELOPMENT){
		console.log('files:', files);
	}

	var fileMatch = conf.template.replace(/[^\{\}]+({{(name)}})/, '$1');
	fileMatch = substitute(fileMatch, {
		name: '(' + conf.name + ')',
		split: conf.split,
		hash: '(' + conf.hash + ')'
	});

	var fileReg = new RegExp(fileMatch);
	var md5Map = files.reduce(function(map, file){
		file.replace(fileReg, function(match, name, md5){
			map[name] = md5;
		});
		return map;
	}, {});

	// get htmlMatch
	var htmlMatch = substitute(conf.template, {
		name: '(' + conf.name + ')',
		split: '(' + conf.split + ')',
		hash: '(' + conf.hash + ')'
	});

	function getMd5(name){
		return md5Map[name] || '';
	}

	function setMd5Color(str, md5, color){
		return str.replace(
			new RegExp(md5),
			$gulpUtil.colors[color](md5)
		);
	}

	if(DEVELOPMENT){
		console.log('htmlMatch:', htmlMatch);
	}

	search = new RegExp(htmlMatch, 'mg');
	replacement = function(match, name, split, hash){
		if(DEVELOPMENT){
			console.log('match:', match);
		}

		var replaced = match;
		var md5 = getMd5(name);
		if(md5){
			replaced = substitute(conf.template, {
				name: name,
				split: split,
				hash: md5
			});
		}

		if(DEVELOPMENT){
			console.log('md5:', md5);
			console.log('replaced:', replaced);
		}

		if(match !== replaced){
			$gulpUtil.log(
				$gulpUtil.colors.yellow('Update md5:'),
				setMd5Color(replaced, md5, 'green')
			);
		}

		return replaced;
	};

	return {
		search: search,
		replacement: replacement
	};

}

module.exports = md5Replacement;