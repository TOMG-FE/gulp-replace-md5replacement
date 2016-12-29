var $fs = require('fs');
var $path = require('path');

var $chai = require('chai');
var $walkSync = require('walk-sync');

var allDistFiles = $walkSync('./test/dist/', {
	directories: false,
	globs : ['**/*.js', '**/*.css']
});

var htmlFiles = $walkSync('./test/dist', {
	directories: false,
	globs : ['**/*.html']
});

var md5map = allDistFiles.reduce(function(map, path){
	var md5;
	path = path.replace(/[-_](\w+)\./, function(match, m1){
		md5 = m1;
		return '.';
	});
	map[path] = md5;
	return map;
}, {});

console.log('md5map:', md5map);

// 获取 html 引用文件路径的 md5 值
function getHtmlMd5(path){
	var regStr = path.replace(/\{([^\{\}]+)\}/, function(match, m1){
		return '[-_]+(\\w+)';
	});

	var reg = new RegExp(regStr);
	var md5;

	htmlFiles.forEach(function(file){
		var filePath = $path.join('./test/dist', file);
		var content = $fs.readFileSync(filePath, 'utf8');
		var match = content.match(reg);
		if(match && match[1]){
			md5 = match[1];
		}
	});

	return md5;
}

// 获取对应 src 目录文件的 md5 值
function getFileMd5(path){
	return md5map[path] || '';
}

describe('basic', function() {

	it('should replace css md5', function() {
		var distMd5 = getFileMd5('css/1.css');
		var htmlMd5 = getHtmlMd5('css/1{hash}.css');
		$chai.expect(distMd5).to.equal(htmlMd5);
	});

	it('should replace js md5', function() {
		var distMd5 = getFileMd5('js/1.js');
		var htmlMd5 = getHtmlMd5('js/1{hash}.js');
		$chai.expect(distMd5).to.equal(htmlMd5);
	});

});

