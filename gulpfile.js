const { src, dest, watch, series, parallel } = require('gulp');

// Styles
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Images
const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');

// JavaScript
const uglify = require('gulp-uglify');

// Tools
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');

// const iconFiles = [
//   './source/favicon.ico',
//   './source/favicon.svg',
//   './source/mask-icon.svg',
//   './source/apple-touch-icon.png',
//   './source/google-touch-icon.png',
//   './source/manifest.json'
// ];

function html(){
  return src('./source/*.html')
    .pipe(dest('./build'))
    .pipe(browserSync.stream());
}

function styles(){
  return src('./source/scss/styles.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      debug: true,
      level: 2,
    }, 
      (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('./build/css'))
    .pipe(browserSync.stream());
}

function scripts(){
  return src('./source/js/*.js')
    .pipe(concat('scripts.js'))
    // .pipe(uglify())
    .pipe(dest('./build/js'))
    .pipe(browserSync.stream());
}

function images(){
  return src('./source/img/*')
    .pipe(imageMin([
      imageMin.gifsicle({interlaced: true}),
      imageMin.mozjpeg({quality: 75, progressive: true}),
      imageMin.optipng({optimizationLevel: 4}),
      imageMin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(dest('./build/img'))
    .pipe(browserSync.stream());
}

function webpImages() {
  return src('build/img/*.{png,jpg}')
    .pipe(webp({quality: 90,
                lossless: false}))
    .pipe(dest('build/img/webp'));
}

function fonts(){
  return src('./source/fonts/*')
    .pipe(dest('./build/fonts'))
    .pipe(browserSync.stream());
}

function watching(){
  browserSync.init({
    server: {
        baseDir: "build/"
    }
  });

  watch('./source/scss/**/*.scss', styles);
  watch('./source/js/**/*.js', scripts);
  watch('./source/*.html', html);
  watch('./source/img/*', images);
  watch('./source/fonts/*', fonts);
}

// function icons(){
//   return src(iconFiles)
//     .pipe(dest('./build'));
// }

function video(){
  return src('./source/video/**/*.mp4')
    .pipe(dest('./build/video'));
}

function clean() {
  return del(['build/*']);
}

exports.dev = series(
  clean,
  parallel(
    html,
    // icons,
    styles,
    scripts,
    fonts,
    series (
      images,
      webpImages
    ),
    video
  ),
  watching
);