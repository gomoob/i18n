'use strict';

var buffer = require('vinyl-buffer'),
    gulp = require('gulp'), 
    gutil = require('gulp-util'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

gulp.task(
    'lib', 
    function() {
        return gulp.src('src/i18n.js')
                   .pipe(gulp.dest('lib'));
    }
);

gulp.task(
    'lib-min', 
    function() {
        return gulp.src('src/i18n.js')
                   .pipe(rename('i18n.min.js'))
                   .pipe(buffer())
                   .pipe(sourcemaps.init({loadMaps: true}))
                   .pipe(uglify())
                   .on('error', gutil.log.bind(gutil, 'Unglify Error'))
                   .pipe(sourcemaps.write('./'))
                   .pipe(gulp.dest('lib'));
    }
);

gulp.task('default', ['lib', 'lib-min']);
