var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var mocha = require('gulp-mocha');
var gls = require('gulp-live-server');
var open = require('gulp-open');
var clean = require('gulp-clean');

function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}

babelPreset = function(){
  return babel({
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "node": true
          }
        }]
      ]
  });
}

gulp.task('concat', function() {

  var b = browserify({
    entries: './lib/entry.js',
    debug: true
  })
    .external('emmet')
    .transform(babelify.configure({
      presets: ["@babel/preset-env"]
    }));

  return b.bundle()
    .pipe(source('codewave.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task("uglify", function () {
  return gulp.src("./dist/codewave.js")
      .pipe(rename("codewave.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("./dist/"));
});

gulp.task('clean', function() {
  return gulp.src(['./dist'], {read: false, allowEmpty:true})
  .pipe(clean());
});

gulp.task('build',  gulp.series('clean', 'concat', 'uglify', function (done) {
    console.log('Build Complete');
    done();
}));

gulp.task('test', gulp.series('build', function() {
  return gulp.src('./test/tests.js')
    .pipe(mocha({require:['source-map-support/register']}));
}));

gulp.task('test-debug', gulp.series('build', function() {
  return gulp.src('./test/tests.js')
    .pipe(mocha({"inspect-brk":true}));
}));

gulp.task('copy-lib', function() {
  return gulp.src('./dist/codewave.js')
    .pipe(gulp.dest('./demo/js'));
});

gulp.task('serve', function(done) {
  var server = gls.static('demo');
  server.start();

  var watcher = gulp.watch(['./demo/**/*.*'])
  .on('error', swallowError)
  watcher.on('all', function(event,path, stats) {
    console.log('notify',path);
    server.notify({path:path});
  });

  done()
});

gulp.task('open', function(){
  var options = {
    uri: 'http://localhost:3000/index.html'
  };
  return gulp.src(__filename)
  .pipe(open(options));
});

gulp.task('watchCoffee', function() {
  return gulp.watch(['./src/**/*.coffee'], function(done){
    gulp.series('build', 'copy-lib')(function(){done()});
  })
  .on('error', swallowError)
});

gulp.task('watch', gulp.parallel('watchCoffee'));

gulp.task('demo', gulp.series('build', 'copy-lib', 'serve', 'open', 'watch'));



gulp.task('default', gulp.series('build'));