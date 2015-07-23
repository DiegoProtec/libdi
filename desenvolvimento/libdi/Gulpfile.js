var gulp = require('gulp'),
    minicss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    jade = require('gulp-jade'),
    htmlv = require('gulp-html-validator'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    newer = require('gulp-newer'),
    csso = require('gulp-csso'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    smaps = require('gulp-sourcemaps'),
    map = require('map-stream'),
    merge = require('merge-stream'),
    del = require('del');


// Default task
gulp.task('default', ['clean'], function () {
gulp.start('minifycss');
});

// Clean
gulp.task('clean', function () {
  del.sync(['../../teste/libdi/public/**/*{.css,.js,.png,.jpg,.jpeg,.svg}',
  '../../teste/libdi/views/*.html'], {force: true});
});

//CSS
gulp.task('minifycss', ['images'], function () {
  return gulp.src('./public/stylesheets/css/*.css')
    .pipe(smaps.init())
    .pipe(minicss())
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/libdi/public/stylesheets/'));
});

// Images
gulp.task('images', ['styles'], function () {
  var spriteData = gulp.src('./public/images/**/*')
    .pipe(newer('../../teste/libdi/public/images/'))
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    })
  );
  var imgStream = spriteData.img
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('../../teste/libdi/public/images/'));
  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('../../teste/libdi/public/stylesheets/'));
  return merge(imgStream, cssStream);
});

// Sass
gulp.task('styles', ['minify-html'], function () {
  sass('./public/stylesheets/sass/*.{scss,sass}', 
    {smaps: true, 
      style: 'compact',
      errLogToConsole: true
    })
  .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
  .pipe(smaps.write())
  .pipe(gulp.dest('./public/stylesheets/css/'));
});

//Html
gulp.task('minify-html', ['templates'], function () {
  var opts = {
    conditionals: true,
    spare:true
  }; 
  return gulp.src('./views/html/*.html')
    .pipe(htmlv())
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('../../teste/libdi/views/'));
});

// Converter Jade/HTML
gulp.task('templates', ['minifyjs'], function () {
  return gulp.src('./views/*.jade')
    .pipe(jade({ 
      pretty: true
    }))
    .pipe(gulp.dest('./views/html/'));
});

//JavaScript
gulp.task('minifyjs', ['scripts'], function() {
  return gulp.src('.public/javascripts/*.js')
    .pipe(smaps.init())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(smaps.write())
    .pipe(gulp.dest('../../teste/libdi/public/javascripts/'));
});

gulp.task('scripts', function () {
  return gulp.src('./public/javascripts/*.js')
    .pipe(jshint())
    .pipe(myReporter);
});

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
 
// Watch
gulp.task('watch', function () {
 
// Watch .scss files
gulp.watch('./public/stylesheets/scss/**/*.scss', ['minifycss']);

// Watch .css files
gulp.watch('./public/stylesheets/css/**/*.css', ['minifycss']);
 
// Watch .js files
gulp.watch('./public/javascripts/**/*.js', ['minifyjs']);
 
// Watch image files
gulp.watch('./public/images/**/*', ['images']);
 
// Create LiveReload server
livereload.listen();
 
// Watch any files in dist/, reload on change
gulp.watch(['./public/**/*']).on('change', livereload.changed);
 
}); 