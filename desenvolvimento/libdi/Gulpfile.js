var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    smaps = equire('gulp-sourcemaps'),
    map = require('map-stream'),
    jade = require('gulp-jade'),
    del = require('del');

var myReporter = map(function (file, cb) {
  if (!file.jshint.success) {
    console.log('JSHINT falhou na '+file.path);
    file.jshint.results.forEach(function (err) {
      if (err) {
        console.log(' '+file.path + ': linha ' + err.line + ', coluna ' + err.character + ', código ' + err.code + ', ' + err.reason);
      }
    });
  }
  cb(null, file);
});

// Sass 
gulp.task('styles', function() {
  gulp.src('./public/stylesheets/**/*.{scss,sass}')
    .pipe(smaps.init())
    .pipe(sass({
      errLogToConsole: true
      }))
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/public/stylesheets'));
    .pipe(notify({ message: 'Tarefa sass completada' }));
})

// Jade - HTML
gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  gulp.src('./public/views/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('../../teste/public/views/'))
    .pipe(notify({ message: 'Tarefa templates completada' }));
});

// Images
gulp.task('images', function() {
return gulp.src('./public/images/**/*')
.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
.pipe(gulp.dest('../../teste/public/images/'))
.pipe(notify({ message: 'Tarefa images completada' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('./public/javascripts/*.js')
    .pipe(jshint())
    .pipe(myReporter);
    .pipe(notify({ message: 'Tarefa scripts completada' }));
});

//Minifica CSS
gulp.task('minifycss', function() {
  return gulp.src('../../teste/public/stylesheets/css/*.css')
    .pipe(smaps.init())
    .pipe(minifyCss())
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/public/stylesheets'));
    .pipe(notify({ message: 'Tarefa minifycss completada' }));
});
 
// Clean
gulp.task('clean', function(cb) {
del(['./public/stylesheets/scss', './public/javascripts', './public/images'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
gulp.start('styles', , 'templates', 'images', 'scripts', 'minifycss');
});
 
// Watch
gulp.task('watch', function() {
 
// Watch .scss files
gulp.watch('./public/stylesheets/scss/**/*.scss', ['styles']);
 
// Watch .js files
gulp.watch('./public/javascripts/**/*.js', ['scripts']);
 
// Watch image files
gulp.watch('./public/images/**/*', ['images']);
 
// Create LiveReload server
livereload.listen();
 
// Watch any files in dist/, reload on change
gulp.watch(['./public/**']).on('change', livereload.changed);
 
}); 