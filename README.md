# gulp-replace-md5replacement
replace md5 filename

## Getting Started

```js
var $gulp = require('gulp');
var $gulpReplace = require('gulp-replace');
var $md5Replacement = require('gulp-replace-md5replacement');

$gulp.task('md5', function(){
	var robj = $md5Replacement({
		name: 'css/\\w+',
		split: '-',
		hash: '\\w+',
		template: '../{{name}}{{split}}{{hash}}.css',
		cwd: './test/dist',
		globs: [
			'**/*.css'
		]
	});

	return $gulp.src([
		'html/**/*.html'
	], {
		cwd: 'test/dist',
		base: 'test/dist'
	}).pipe(
		$gulpReplace(robj.search, robj.replacement)
	).pipe(
		$gulp.dest('./test/dist')
	);
});
```

## options

#### options.debug

Type: `Boolean`

Default: false

是否为调试模式，开启调试模式会在控制台输出流程数据

#### options.name

Type: `String`

Default: 'css/\\w+'

用于匹配文件名的正则字符串

#### options.split

Type: `String`

Default: '-'

文件名与md5的分隔符

#### options.hash

Type: `String`

Default: '\\w+'

用于匹配md5的正则字符串

#### options.append

Type: `Boolean`

Default: false

是否追加 md5，设为 true 会对没有加 md5 的静态链接添加对应的 md5 后缀

#### options.template

Type: `String`

Default: '../{{name}}{{split}}{{hash}}.css'

html文件路径匹配模板

#### options.cwd

Type: `String`

Default: './css'

md5 文件所在的目录，用于 walk-sync 组件遍历文件

#### options.globs

Type: `Array`

Default: [ '**/*.css' ]

md5 文件匹配规则，用于 walk-sync 组件遍历文件

## Release History

 * 2017-02-08 v0.1.2 实现md5后缀追加
 * 2016-12-29 v0.1.0 发布第一个正式版

 