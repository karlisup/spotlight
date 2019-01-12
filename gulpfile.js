var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create();
	
gulp.task('css', function() {
	return gulp.src('scss/*.scss')
		.pipe(sass({
	            // outputStyle: 'compressed'
        	}).on('error', sass.logError)
		)
		.pipe(gulp.dest('./public/assets/css/'))
		.pipe(browserSync.stream())
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: "./public/"
		}
	});
});

gulp.task('watch', function(){
    gulp.watch('scss/**/*.scss', gulp.series('css'));
});

gulp.task('default', gulp.series('watch', 'browserSync'));
