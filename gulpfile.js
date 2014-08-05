gulp = require('gulp');
coffee = require('gulp-coffee');
gutil = require('gulp-util');
mocha = require('gulp-mocha');

src = ['src/**/*.coffee']
testSrc = ['test/test.coffee']
test = ['test/test.js']
lib = ['lib/**/*.js']

gulp.task('scripts', function() {
  gulp.src(src)
    .pipe(coffee().on('error', gutil.log))
    .pipe(gulp.dest('./lib'));
});

gulp.task('test-scripts', function() {
  gulp.src(testSrc)
    .pipe(coffee().on('error', gutil.log))
    .pipe(gulp.dest('./test'));
});

gulp.task('test', function() {
  gulp.src(test, { read: false })
    .pipe(mocha())
    .on('error', gutil.log);
});

gulp.task('default', function() {
  gulp.watch(src, ['scripts']);
  gulp.watch(testSrc, ['test-scripts']);
  gulp.watch(test, ['test']);
  gulp.watch(lib, ['test']);
});
