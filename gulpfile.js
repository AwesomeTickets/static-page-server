var gulp = require('gulp');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var del = require('del');  //用来删除文件的
var sass = require('gulp-sass');
var jade = require('gulp-jade');

gulp.task('webserver', function() {
	connect.server({
		root: 'tmp',  //程序入口处，自动为这个文件夹下的Index.html
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
		.pipe(connect.reload());  //用来实现更改自动刷新
});

gulp.task('css', ['sass'], function() {   //['sass']指sass这个task完成之后再执行css这个task。
	gulp.src('styles/*.css')
		.pipe(gulp.dest('tmp/styles'))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src('scripts/*.js')
		.pipe(gulp.dest('tmp/scripts'))
		.pipe(connect.reload());
});

//目前支持.jpg .JPG .jpeg .png .PNG .gif，若还有其他格式文件再添加
gulp.task('staticPics', function() {
	gulp.src(['static/pictures/*.jpg', 'static/pictures/*.JPG', 'static/pictures/*.png', 'static/pictures/*.PNG', 'static/pictures/*.gif', 'static/pictures/*.jpeg'])
		.pipe(gulp.dest('tmp/static/pictures'));
})

gulp.task('staticFiles', function() {
	gulp.src(['static/*.js', 'static/*.css'])
		.pipe(gulp.dest('tmp/static'));
})

gulp.task('inject', ['sass', 'css', 'js'], function() {
	var target = gulp.src('./layout.jade');
	var sources = gulp.src(['./styles/*.css', './scripts/*.js'], {read: false});
	return target.pipe(inject(sources))
				.pipe(gulp.dest('./'));	
});

//index.jade预编译为tmp/index.html
gulp.task('index', ['inject'], function() {
	gulp.src('index.jade')
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
	gulp.watch('*.jade', ['index']);
	gulp.watch('layouts/*.jade', ['jade']);
	gulp.watch('styles/*.css', ['css']);
	gulp.watch('scripts/*.js', ['js']);
	gulp.watch('./style.scss', ['sass']);
});

gulp.task('default', ['webserver', 'clean', 'sass', 'css', 'js', 'staticPics', 'staticFiles', 'inject', 'index', 'jade', 'watch']);