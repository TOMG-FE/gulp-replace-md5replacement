# gulp-replace-md5replacement
replace md5 filename

## Getting Started

```js
var $gulp = require('gulp');
var $gulpReplace = require('gulp-replace');
var $md5Replacement = require('gulp-replace-md5replacement');

$gulp.task('md5', function(){
	var robj = $md5Replacement({
		name: 'js/\\w+',
		split: '_',
		hash: '\\w+',
		template: '../{{name}}{{split}}{{hash}}.js',
		cwd: './test/dist',
		globs: [
			'**/*.js'
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

## Release History

 * 2016-12-29 v0.1.0 发布第一个正式版。

 