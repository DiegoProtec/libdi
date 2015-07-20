var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    smaps = require('gulp-sourcemaps'),
    map = require('map-stream'),
    jade = require('gulp-jade'),
    prefix = require('gulp-autoprefixer'),
    minifyHTML = require('gulp-minify-html'),
    del = require('del'),
    csso = require('gulp-csso'),
    merge = require('merge-stream'),
    spritesmith = require('gulp.spritesmith');

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
gulp.task('styles', function () {
    sass('./public/stylesheets/sass/**/*.{scss,sass}', 
      {smaps: true, 
        style: 'compact',
        errLogToConsole: true
      })
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(smaps.write())
    .pipe(gulp.dest('./public/stylesheets/css/'));
});

// Jade - HTML
gulp.task('templates', function () {
  return gulp.src('./views/*.jade')
    .pipe(jade({ 
    	pretty: true
    }))
    .pipe(gulp.dest('./views/html/'));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('./public/*.js')
    .pipe(jshint())
    .pipe(myReporter);
});

// Images
gulp.task('images', function () {
  var spriteData = gulp.src('./public/images/**/*').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  var imgStream = spriteData.img
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('../../teste/libdi/public/images/'));
  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('./public/stylesheets/'));
  return merge(imgStream, cssStream);
});

//Minifica ---------------------------------------------------------------------------------------
//Html
gulp.task('minify-html', ['templates'], function () {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./views/html/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('../../teste/libdi/views/'));
});

//CSS
gulp.task('minifycss', ['styles'], function () {
  return gulp.src('./public/stylesheets/**/*.css')
    .pipe(smaps.init())
    .pipe(minifycss())
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/libdi/public/stylesheets/'));
});

//JavaScript
gulp.task('minifyjs', ['scripts'], function() {
  return gulp.src('.public/javascripts/*.js')
    .pipe(smaps.init())
      .pipe(uglify())
      //.pipe(concat('all.min.js'))
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/libdi/public/javascripts/'));
});
 //------------------------------------------------------------------------------------------------

// Clean
gulp.task('clean', function () {
  del.sync(['../../teste/libdi/public/**/*{css,js,png,jpg,jpeg,svg}',
  '../../teste/libdi/views/*.html'], {force: true});
});

// Default task
gulp.task('default', ['clean'], function () {
gulp.start('images', 'minify-html', 'minifycss', 'minifyjs');
});
 
// Watch
gulp.task('watch', function () {
 
// Watch .scss files
gulp.watch('./public/stylesheets/scss/**/*.scss', ['styles']);
 
// Watch .js files
gulp.watch('./public/javascripts/**/*.js', ['scripts']);
 
// Watch image files
gulp.watch('./public/images/**/*', ['images']);
 
// Create LiveReload server
livereload.listen();
 
// Watch any files in dist/, reload on change
gulp.watch(['./public/**/*']).on('change', livereload.changed);
 
}); 