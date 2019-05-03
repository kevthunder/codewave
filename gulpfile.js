require('source-map-support').install();

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify-es').default;
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('coffee', function() {
  return gulp.src(['./src/**/*.coffee'])
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('concat', function() {

  var b = browserify({
    entries: './lib/codewave.js',
    debug: true
  })
    .transform(babelify)

  return b.bundle()
    .pipe(source('codewave.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('coffeeTest', function() {
  return gulp.src('./test/src/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./test/'));
});

gulp.task('build',  gulp.series('coffee', 'concat', function (done) {
    console.log('Build Complete');
    done();
}));

gulp.task('test', gulp.series('build','coffeeTest', function() {
  return gulp.src('./test/tests.js')
    .pipe(mocha({require:['source-map-support/register']}));
}));

gulp.task('test-debug', gulp.series('build','coffeeTest', function() {
  return gulp.src('./test/tests.js')
    .pipe(mocha({"inspect-brk":true, require:['source-map-support/register']}));
}));


gulp.task('default', gulp.series('build'));