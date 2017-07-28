var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    filter = require('gulp-filter'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    strip = require('gulp-strip-comments'),
    concat = require('gulp-concat'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename');

/**
 * Cleans compiled vendor files.
 * @param {function} done Callback.
 */
function clean(done) {
    del([
        path.join(config.folders.vendor.build.root, '**/*.*'), '!' + config.folders.vendor.build.root,
        path.join(config.folders.vendor.build.js, config.vendorFileName + '.{min.js,min.js.map,js}'), '!' + config.folders.vendor.build.js,
        path.join(config.folders.vendor.build.css, config.vendorFileName + '.{min.css,min.css.map,css}'), '!' + config.folders.vendor.build.css
    ]).then(function(paths) {
        if (config.debugMode && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Compiles vendor js files.
 * @param {function} done Callback.
 */
function compileVendorScripts(done) {

    // define sources
    var sources = [];
    if (config.vendor.scripts.length > 0) {
        sources = config.vendor.scripts;
    }
    sources = sources.concat([
        path.join(config.folders.vendor.src.root, '**/*.js'), 
        '!' + path.join(config.folders.vendor.src.root, 'vendor.config.js')
    ]);

    // define filter
    var filterMinified = filter(['**', '!**/*.min.js'], { restore: true });

    gulp.src(sources)
        .pipe(sourcemaps.init())
        .pipe(cached('vendorscripts'))
        .pipe(filterMinified)
        .pipe(uglify())
        .pipe(filterMinified.restore)
        .pipe(strip())
        .pipe(remember('vendorscripts'))
        .pipe(concat(config.vendorFileName + '.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.folders.vendor.build.js))
        .on('finish', function() { done(); });
}

/**
 * Compiles vendor css files.
 * @param {function} done Callback.
 */
function compileVendorStyles(done) {
   
    // define sources
    var sources = [];
    if (config.vendor.styles.length > 0) {
        sources = config.vendor.styles;
    }
    sources = sources.concat([
        path.join(config.folders.vendor.src.root, '/**/*.css')
    ]);

    // define filter
    var filterMinified = filter(['**', '!**/*.min.css'], { restore: true });

    gulp.src(sources)
        .pipe(sourcemaps.init())
        .pipe(cached('vendorstyles'))
        .pipe(filterMinified)
        .pipe(postcss([
            autoprefixer(),
            cssnano({
                discardComments: {
                    removeAll: true
                },
                zindex: false,
                discardUnused: false,
                mergeIdents: false,
                reduceIdents: false,
                safe: true
            })
        ]))
        .pipe(filterMinified.restore)
        .pipe(strip())
        .pipe(remember('vendorstyles'))
        .pipe(concat(config.vendorFileName + '.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.folders.vendor.build.css))
        .on('finish', function() { done(); });
}

// define tasks and task information
gulp.task('vendor', gulp.series(clean, gulp.parallel(compileVendorScripts, compileVendorStyles)));
var vendor = gulp.task('vendor');
vendor.displayName = 'vendor';
vendor.description = 'Creates compiled vendor file.';