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
    smaps = require('gulp-sourcemaps'),
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
  gulp.src('./public/stylesheets/sass/**/*.{scss,sass}')
    .pipe(smaps.init())
    .pipe(sass({
      errLogToConsole: true
      }))
    .pipe(smaps.write())
    .pipe(gulp.dest('./public/stylesheets/css/'))
    .pipe(notify({ message: 'Tarefa sass completada' }));
})

// Jade - HTML
gulp.task('templates', function() {
    return gulp.src('./public/views/jade/*.jade')
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('../../teste/libdi/public/views/'))
    .pipe(notify({ message: 'Tarefa templates completada' }));
});

// Images
gulp.task('images', function() {
return gulp.src('./public/images/**/*')
.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
.pipe(gulp.dest('../../teste/libdi/public/images/'))
.pipe(notify({ message: 'Tarefa images completada' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('./public/*.js')
    .pipe(jshint())
    .pipe(myReporter);
});

//Minifica CSS
gulp.task('minifycss', function() {
  return gulp.src('./public/stylesheets/css/*.css')
    .pipe(smaps.init())
    .pipe(minifycss())
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/libdi/public/stylesheets/'));
});

//Minifica JS
gulp.task('minifyjs', function() {
  return gulp.src('.public/javascripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('../../teste/libdi/public/javascripts/'))
    .pipe(notify({ message: 'Tarefa minifyjs completada' }));
});
 
// Clean
gulp.task('clean', function(cb) {
del(['../../teste/libdi/stylesheets/*', 
	'../../teste/libdi/public/javascripts/*', 
	'../../teste/libdi/public/images/*', 
	'../../teste/libdi/views/*'], {force: true}, cb);
});

// Default task
gulp.task('default', ['clean'], function() {
gulp.start('styles', 'templates', 'images', 'scripts', 'minifycss', 'minifyjs');
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