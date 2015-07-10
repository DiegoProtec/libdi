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
  gulp.src('./public/stylesheets/scss**/*.{scss,sass}')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
      }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/stylesheets/css'));
})

// Jade - HTML


// Scripts
gulp.task('scripts', function() {
  return gulp.src('./public/javascripts/*.js')
    .pipe(jshint())
    .pipe(myReporter);
});

// Images
gulp.task('images', function() {
return gulp.src('./public/images/**/*')
.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
.pipe(gulp.dest('./public/images'))
.pipe(notify({ message: 'Tarefa images completada' }));
});
 
// Clean
gulp.task('clean', function(cb) {
del(['./public/stylesheets/scss', './public/javascripts', './public/images'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
gulp.start('styles', 'scripts', 'images');
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