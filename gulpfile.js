var gulp = require('gulp');
var connect = require('gulp-connect');
// var inject = require('gulp-inject');
var del = require('del');  //用来删除文件的
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');

gulp.task('webserver', function() {
	connect.server({
		root: 'site',  //程序入口处，自动为这个文件夹下的Index.html
		livereload: true
	});
});

gulp.task('clean', function() {
	return del(['site']);
});

gulp.task('sass', function() {
	gulp.src('style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('styles'))
		.pipe(connect.reload());  //用来实现更改自动刷新
});

//['sass']指sass这个task完成之后再执行css这个task。
gulp.task('css', ['sass'], function() {
	gulp.src('styles/*.css')
		.pipe(gulp.dest('site/styles'))
		.pipe(connect.reload());
});

// 加入了babel和browserify，可以编写ES6
gulp.task('js', function() {
	gulp.src('scripts/*.js')
		.pipe(babel({
				presets: ['es2015']
		}))
		.pipe(browserify())
		.pipe(gulp.dest('site/scripts'))
		.pipe(connect.reload());
});

gulp.task('staticFiles', function() {
	gulp.src(['static/*.js', 'static/*.css', 'static/*.map', 'static/*.png'])
		.pipe(gulp.dest('site/static'));
})


gulp.task('staticSlick', function() {
	gulp.src(['static/slick/*.css', 'static/slick/*.js', 'static/slick/*.gif'])
		.pipe(gulp.dest('site/static/slick'));
})

gulp.task('staticPicsExport', function() {
	gulp.src(['static/pictures/export/*'])
		.pipe(gulp.dest('site/static/pictures/export'));
})
gulp.task('staticPicsAssets', function() {
	gulp.src(['static/pictures/assets/*', 'static/pictures/assets/*/*'])
		.pipe(gulp.dest('site/static/pictures/assets'));
})

gulp.task('staticFonts', function() {
	gulp.src(['static/fonts/*'])
		.pipe(gulp.dest('site/fonts'));
})

// gulp-inject自动注入依赖，这个项目中赞不需要
// gulp.task('inject', ['sass', 'css', 'js'], function() {
// 	var target = gulp.src('./layout.jade');
// 	var sources = gulp.src(['./styles/*.css', './scripts/*.js'], {read: false});
// 	return target.pipe(inject(sources))
// 				.pipe(gulp.dest('./'));
// });

//index.jade预编译为site/index.html
gulp.task('index', function() {
	gulp.src('index.jade')
		.pipe(jade())
		.pipe(gulp.dest('site'))
		.pipe(connect.reload());
});

gulp.task('jade', function() {
	gulp.src('layouts/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('site/layouts'))
		.pipe(connect.reload());
})

gulp.task('ico', function() {
	gulp.src('favicon.ico')
		.pipe(gulp.dest('site'));
})

gulp.task('watch', function() {
	// gulp.watch('index.jade', ['index']);
	gulp.watch('layouts/*.jade', ['jade']);
	gulp.watch('styles/*.css', ['css']);
	gulp.watch('scripts/*.js', ['js']);
	// gulp.watch('style.scss', ['sass']);
});

gulp.task('default', ['webserver', 'clean', 'sass', 'css', 'js', 'staticFiles', 'staticSlick', 'staticPicsExport', 'staticPicsAssets', 'staticFonts', 'index', 'jade', 'ico', 'watch']);
gulp.task('build', ['sass', 'css', 'js', 'staticFiles', 'staticSlick', 'staticPicsExport', 'staticPicsAssets', 'staticFonts', 'index', 'jade', 'ico']);
