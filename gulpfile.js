'use strict';

var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './main.js',
    debug: true,
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() { 
  gulp.watch(['./main.js'], ['javascript']);
});