var gulp = require('gulp');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var del = require('del');
var sass = require('gulp-sass');

gulp.task('webserver', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('clean', function() {
	return del(['tmp']);
});

gulp.task('index', ['clean'], function() {
	gulp.src('index.html')
		.pipe(gulp.dest('tmp'))
		.pipe(connect.reload());
});

gulp.task('sass', ['clean'], function() {
	gulp.src('style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('styles'))
		.pipe(connect.reload());
});

gulp.task('css', ['clean', 'sass'], function() {
	gulp.src('styles/*.css')
		.pipe(gulp.dest('tmp/styles'))
		.pipe(connect.reload());
});

gulp.task('html', ['clean'], function() {
	gulp.src('layouts/*.html')
		.pipe(gulp.dest('tmp/layouts'))
		.pipe(connect.reload());
});

gulp.task('js', ['clean'], function() {
	gulp.src('scripts/*.js')
		.pipe(gulp.dest('tmp/scripts'))
		.pipe(connect.reload());
});

gulp.task('inject', ['index', 'sass', 'css', 'html', 'js'], function() {
	var target = gulp.src('./index.html');
	var sources = gulp.src(['./styles/*.css', './scripts/*.js'], {read: false});
	return target.pipe(inject(sources))
				.pipe(gulp.dest('./'));	
});

gulp.task('watch', function() {
	// livereload.listen();
	gulp.watch(['./index.html'], ['index']);
	gulp.watch(['layouts/*.html'], ['html']);
	gulp.watch(['styles/*.css'], ['css']);
	gulp.watch(['scripts/*.js'], ['js']);
	gulp.watch(['./style.scss'], ['sass']);
});

gulp.task('default', ['webserver', 'clean', 'index', 'sass', 'css', 'html','js', 'inject', 'watch']);