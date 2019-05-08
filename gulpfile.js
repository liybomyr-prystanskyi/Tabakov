// Modules
const gulp           = require('gulp'),
      htmlbeautify   = require('gulp-html-beautify'),
      rename         = require('gulp-rename'),
      mustache       = require('gulp-mustache'),
      wait           = require('gulp-wait'),
      globSass       = require('gulp-sass-glob'),
      sourcemap      = require('gulp-sourcemaps'),
      sass           = require('gulp-sass'),
      grMediaQueries = require('gulp-group-css-media-queries'),
      autoprefixer   = require('gulp-autoprefixer'),
      cleanCSS       = require('gulp-clean-css'),
      rigger         = require('gulp-rigger'),
      uglify         = require('gulp-uglify'),
      imagemin       = require('gulp-imagemin'),
      del            = require('del'),
      browserSync    = require('browser-sync').create(),
      gutil          = require('gulp-util');


// Configurations
let paths  = require('./pathsConf.json'),
    server = require('./serverConfig.json');


// Clear
gulp.task('clear-build', function() {
      return del('build/*');
});

// Mustache to html
gulp.task('mustache-to-html', function(done) {
      let m = mustache('./src/mustache-data.json');
      m.on('error',function(e){
            gutil.log(e);
            m.end();
      });
      return gulp.src(paths.src.html + '*.mustache')
            .pipe(m)
            .pipe(htmlbeautify())
            .pipe(rename({
                  extname: ".html"
            }))
            .pipe(gulp.dest(paths.build.html))
            .pipe(browserSync.stream());
});

// Scss to css
gulp.task('scss-to-css', function() {
      return gulp.src(paths.src.scss + '*.scss')
            .pipe(wait(500))
            .pipe(globSass())
            .pipe(sourcemap.init())
                  .pipe(sass().on('error', sass.logError))
                  .pipe(autoprefixer({
                        browsers: ['last 2 versions'],
                        cascade: false
                  }))
                  .pipe(cleanCSS())
            .pipe(sourcemap.write())
            .pipe(rename({
                  basename: 'style',
                  suffix: '.min'
            }))
            .pipe(gulp.dest(paths.build.css))
            .pipe(browserSync.stream());
});

// CSS vendors to build
gulp.task('css-vendors-to-build', function() {
      return gulp.src(paths.src.cssVendors + '*.css')
            .pipe(gulp.dest(paths.build.cssVendors));
});

// JS vendors to build
gulp.task('js-vendors-to-build', function() {
      return gulp.src(paths.src.jsVendors + '*.js')
            .pipe(gulp.dest(paths.build.jsVendors));
});

// Vendors to build
gulp.task('vendors-to-build', gulp.parallel('css-vendors-to-build','js-vendors-to-build'));

// Scripts
gulp.task('js-to-build', function() {
      return gulp.src(paths.src.js + '*.js')
            .pipe(rigger())
            .pipe(sourcemap.init())
                  .pipe(uglify())
                  .pipe(rename({
                        suffix: '.min'
                  }))
            .pipe(sourcemap.write())
            .pipe(gulp.dest(paths.build.js))
            .pipe(browserSync.stream());
});

// Images
gulp.task('images-to-build', function() {
      return gulp.src(paths.src.img + '/*.*')
            // .pipe(imagemin({ progressive: true }))
            .pipe(gulp.dest(paths.build.img))
            .pipe(browserSync.stream());
});

// Fonts
gulp.task('fonts-to-build', function () {
      return gulp.src(paths.src.fonts + '/*.*')
            .pipe(gulp.dest(paths.build.fonts))
            .pipe(browserSync.stream());
});


// Start Server
gulp.task('server:start', function() {
      browserSync.init(server);
});
  
// Reload Server
gulp.task('server:reload', function(done) {
      browserSync.reload();
      done();
});
  
// Watch
gulp.task('watch', function() {
      // Styles
      gulp.watch([paths.watch.scss], gulp.series('scss-to-css', 'server:reload'));
      // HTML
      gulp.watch([paths.watch.mustache, paths.watch.dataFile], gulp.series('mustache-to-html', 'server:reload'));
      // JS
      gulp.watch([paths.watch.js], gulp.series('js-to-build', 'server:reload'));
      // Images
      gulp.watch([paths.watch.img], gulp.series('images-to-build', 'server:reload'));
      // Fonts
      gulp.watch([paths.watch.fonts], gulp.series('fonts-to-build', 'server:reload'));
});
  
// Build Task
gulp.task('build', gulp.series(
      'clear-build',
      gulp.parallel('vendors-to-build','mustache-to-html','scss-to-css','js-to-build','images-to-build', 'fonts-to-build')
));
  
// Dev Task
gulp.task('dev', gulp.series(
      'vendors-to-build',
      'mustache-to-html',
      'scss-to-css',
      'js-to-build',
      'images-to-build',
      'fonts-to-build',
      gulp.parallel('watch', 'server:start')
));