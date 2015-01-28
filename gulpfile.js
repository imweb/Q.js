var gulp = require('gulp')
  , webpack = require('gulp-webpack')
  , config = require('./webpack.config');

gulp.task('default', function () {
  gulp.src(['src/Q.js'])
    .pipe(webpack(config))
    .pipe(gulp.dest('./dist'));
});
