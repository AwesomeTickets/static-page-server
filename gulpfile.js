var gulp = require('gulp');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var del = require('del');
var sass = require('gulp-sass');
var jade = require('gulp-jade');

gulp.task('webserver', function() {
	connect.server({
		root: 'tmp',
		livereload: true
	});
});

gulp.task('clean', function() {
	return del(['tmp']);
});

gulp.task('sass', function() {
	gulp.src('style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('styles'))
		.pipe(connect.reload());
});

gulp.task('css', ['sass'], function() {
	gulp.src('styles/*.css')
		.pipe(gulp.dest('tmp/styles'))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src('scripts/*.js')
		.pipe(gulp.dest('tmp/scripts'))
		.pipe(connect.reload());
});

gulp.task('static', function() {
	gulp.src(['static/pictures/*.jpg', 'static/pictures/*.JPG', 'static/pictures/*.png', 'static/pictures/*.PNG', 'static/pictures/*.gif'])
		.pipe(gulp.dest('tmp/static/pictures'));
})

gulp.task('inject', ['sass', 'css', 'js'], function() {
	var target = gulp.src('./layout.jade');
	var sources = gulp.src(['./styles/*.css', './scripts/*.js'], {read: false});
	return target.pipe(inject(sources))
				.pipe(gulp.dest('./'));	
});

gulp.task('index', ['inject'], function() {
	gulp.src('*.jade')
		.pipe(jade())
		.pipe(gulp.dest('tmp'))
		.pipe(connect.reload());
});

gulp.task('jade', ['inject'], function() {
	gulp.src('layouts/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('tmp/layouts'))
		.pipe(connect.reload());
})

gulp.task('watch', function() {
	// gulp.watch(['*.jade','layouts/*.jade'], ['index', 'jade']);
	gulp.watch('*.jade', ['index']);
	gulp.watch('layouts/*.jade', ['jade']);
	gulp.watch('styles/*.css', ['css']);
	gulp.watch('scripts/*.js', ['js']);
	gulp.watch('./style.scss', ['sass']);
});

gulp.task('default', ['webserver', 'clean', 'sass', 'css', 'js', 'static', 'inject', 'index', 'jade', 'watch']);