var gulp = require('gulp')
  , uglify = require('gulp-uglify')
  , maxmin = require('maxmin')
  , map = require('map-stream')
  , webpack = require('gulp-webpack')
  , config = require('./webpack.config');

function Size() {
  this._max = undefined;
  this._min = undefined;
}
Size.prototype.max = function () {
  var self = this;
  return map(function (file, cb) {
    self._max = file.contents;
    cb(null, file);
  });
};
Size.prototype.min = function (rename) {
  var self = this;
  return map(function (file, cb) {
    self._min = file.contents;
    rename &&
      (file.path = rename(file.path));
    cb(null, file);
  });
};
Size.prototype.print = function () {
  var self = this;
  setTimeout(function () {
    console.log(maxmin(self._max, self._min, true));
  }, 0);
}

var size = new Size();


gulp.task('dist', function (done) {
  gulp.src(['./src/Q.js'])
    .pipe(webpack(config))
    .pipe(size.max())
    .pipe(gulp.dest('./dist'))
    .on('end', function () {
      done();
    });
});

gulp.task('default', ['dist'], function (done) {
  gulp.src(['./dist/Q.js'])
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(size.min(function (path) {
      return path.replace(/\.js$/, '.min.js');
    }))
    .pipe(gulp.dest('./dist'))
    .on('end', function () {
      size.print();
      done();
    });
});
