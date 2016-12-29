var $fs = require('fs');
var $path = require('path');

var $del = require('del');
var $gulp = require('gulp');
var $gutil = require('gulp-util');
var $gulpRev = require('gulp-rev');
var $gulpMd5 = require('gulp-md5');
var $gulpMocha = require('gulp-mocha');
var $runSequence = require('run-sequence');

var $replaceMd5 = require('./index');

$gulp.task('clean', function(callback){
	$del('./test/dist/');
	setTimeout(callback, 100);
});

$gulp.task('updateFile', function(){
	$fs.writeFileSync('./test/src/js/1.js', Math.random());
	$fs.writeFileSync('./test/src/css/1.css', Math.random());
});

$gulp.task('rev', function(){
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

$gulp.task('copy', function(){
	$gulp.src([
		'html/**/*.html'
	], {
		cwd: 'test/src',
		base: 'test/src'
	}).pipe(
		$gulp.dest('./test/dist')
	);
});

$gulp.task('basic', function(){
	$gulp.src([
		'html/**/*.html'
	], {
		cwd: 'test/src',
		base: 'test/src'
	}).pipe(
		$replaceMd5({
			globs : [
				'**/*.css',
				'**/*.js'
			],
			cwd : 'test/dist'
		})
	);
});

$gulp.task('mocha', function() {
	$gulp.src('test/test.js').pipe(
		$gulpMocha()
	);
});

$gulp.task('prepare', function(){
	return $runSequence(
		'clean',
		'copy',
		'rev'
	);
});

$gulp.task('test', function(){
	return $runSequence(
		'basic',
		'mocha'
	);
});

$gulp.task('default', [
	'test'
]);

