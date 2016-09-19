'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');

const lintFiles = ['**/*.js', '!node_modules/**/*'];

gulp.task('lint', () => (
  gulp.src(lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
));

gulp.task('watch', () => {
  gulp.watch(lintFiles, ['lint']);
});
