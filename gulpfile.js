var $fs = require('fs');

var $del = require('del');
var $gulp = require('gulp');
var $gulpRev = require('gulp-rev');
var $gulpMd5 = require('gulp-md5');
var $gulpMocha = require('gulp-mocha');
var $runSequence = require('run-sequence');
var $gulpReplace = require('gulp-replace');

var $md5Replacement = require('./index');

$gulp.task('clean', function(callback) {
	$del('./test/dist/');
	setTimeout(callback, 100);
});

$gulp.task('updateFile', function() {
	$fs.writeFileSync('./test/src/js/1.js', Math.random());
	$fs.writeFileSync('./test/src/css/1.css', Math.random());
});

$gulp.task('rev', function() {
	$gulp.src([
		'css/**/*.css'
	], {
		cwd: 'test/src',
		base: 'test/src'
	}).pipe(
		$gulpRev()
	).pipe(
		$gulp.dest('./test/dist')
	);

	$gulp.src([
		'js/**/*.js'
	], {
		cwd: 'test/src',
		base: 'test/src'
	}).pipe(
		$gulpMd5({
			size: 8
		})
	).pipe(
		$gulp.dest('./test/dist')
	);
});

$gulp.task('copy', function(done) {
	return $gulp.src([
		'html/**/*.html'
	], {
		cwd: 'test/src',
		base: 'test/src'
	}).pipe(
		$gulp.dest('./test/dist')
	);
});

$gulp.task('basic-css', function() {
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

$gulp.task('basic-js', function() {
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

$gulp.task('mocha', function() {
	$gulp.src('test/test.js').pipe(
		$gulpMocha()
	);
});

$gulp.task('cdn-css', function() {
	var robj = $md5Replacement({
		name: 'css/\\w+',
		split: '-',
		hash: '\\w+',
		template: 'cdn/{{name}}{{split}}{{hash}}.css',
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

$gulp.task('prepare', function() {
	return $runSequence(
		'clean',
		'copy',
		'rev'
	);
});

$gulp.task('test', function() {
	return $runSequence(
		'copy',
		'basic-css',
		'basic-js',
		'cdn-css',
		'mocha'
	);
});

$gulp.task('default', [
	'test'
]);

