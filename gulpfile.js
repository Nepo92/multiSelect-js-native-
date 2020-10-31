const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const webpCSS = require('gulp-webp-css');
const imageMin = require('gulp-imagemin');
const compress = require('gulp-uglify-es').default;

gulp.task('del', function() {
  return del(['dist'])
});

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    notify: false
  })
});

gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(webpHTML())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**/*.+(ttf||woff||woff2)'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass', function() {
  return gulp.src(['app/sass/**/*.+(sass|scss)', '!' + 'app/sass/**/_*.+(sass||scss)'])
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .pipe(autoprefixer({
      overrideBrowserslist:  ['last 5 versions'],
      cascade: true
    }))
    .pipe(webpCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('img', function() {
  return gulp.src(['app/img/**/*.+(svg||webp||png||jpg||jpeg||gif)'])
    .pipe(imageMin({progressive: true}))
    .pipe(gulp.dest('dist/img'))
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function() {
  return gulp.src(['app/js/**/*.js', 'app/js/_*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(compress())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('spriteSVG', function() {
  return gulp.src('app/sprite.svg')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('watch', function() {
  gulp.watch('app/**/*.html', gulp.parallel('html'));
  gulp.watch('app/sass/**/*.+(scss||sass)', gulp.parallel('sass'));
  gulp.watch(['app/img/**/*.+(svg||webp||png||jpg||jpeg||gif)'], gulp.parallel('img'));
  gulp.watch(['app/js/**/*.js', 'app/js/_*.js'], gulp.parallel('js'));
  gulp.watch(['app/fonts/**/*.+(ttf||woff||woff2)', 'app/fonts/_*.+(ttf||woff||woff2)'], gulp.parallel('fonts'));
})

gulp.task('default', gulp.parallel('server', 'watch', 'html', 'fonts', 'sass', 'img', 'js'));