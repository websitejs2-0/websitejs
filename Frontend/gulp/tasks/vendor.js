var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    reload = require('require-again'),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
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
 * Cleans compiled vendor scripts files.
 * @param {function} done Callback.
 */
function cleanVendorScripts(done) {
    del([
        //path.join(config.folders.vendor.build.root, '**/*.*'), '!' + config.folders.vendor.build.root,
        path.join(config.folders.vendor.build.js, config.vendorFileName + '.{min.js,min.js.map,js}'), '!' + config.folders.vendor.build.js,
    ]).then(function(paths) {
        if (process.env.DEBUG === 'true' && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Cleans compiled vendor style files.
 * @param {function} done Callback.
 */
function cleanVendorStyles(done) {
    del([
        //path.join(config.folders.vendor.build.root, '**/*.*'), '!' + config.folders.vendor.build.root,
        path.join(config.folders.vendor.build.css, config.vendorFileName + '.{min.css,min.css.map,css}'), '!' + config.folders.vendor.build.css
    ]).then(function(paths) {
        if (process.env.DEBUG === 'true' && paths.length > 0) {
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
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.init() : gutil.noop())
        .pipe(filterMinified)
        .pipe(uglify())
        .pipe(filterMinified.restore)
        .pipe(strip())
        .pipe(concat(config.vendorFileName + '.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.write('.') : gutil.noop())
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
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.init() : gutil.noop())
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
        .pipe(concat(config.vendorFileName + '.min.css'))
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.write('.') : gutil.noop())
        .pipe(gulp.dest(config.folders.vendor.build.css))
        .on('finish', function() { done(); });
}

/**
 * Watches vondors folder and configuration for changes.
 */
function watchVendor() {

    var configWatcher = gulp.watch(path.join(config.folders.vendor.src.root, 'vendor.config.js'), { ignorePermissionErrors: true });
    configWatcher.on('all', function() {

        // reload only vendor config (reload pkg needs relative path from working dir)
        var vendor = reload(path.join('..', '..', 'vendor', 'vendor.config.js'));
        config.vendor = vendor;

        gutil.log(chalk.white('Updating vendor packages...'));
        cleanVendorScripts(function() {
            compileVendorScripts(function() {
                gutil.log(chalk.yellow('Updated vendor scripts.'));
            });
        });
        cleanVendorStyles(function() {
            compileVendorStyles(function() {
                gutil.log(chalk.yellow('Updated vendor styles.'));
            });
        });
    });

    var foldersWatcher = gulp.watch([path.join(config.folders.vendor.src.root), '!' + path.join(config.folders.vendor.src.root, 'vendor.config.js')], { ignorePermissionErrors: true });
    foldersWatcher.on('all', function(e, filePath) {

        if (e === 'add' || e === 'change' || e === 'unlink') {
            
            gutil.log(chalk.white('Updating vendor packages...'));
            
            if (path.parse(filePath).ext === '.js') {
                cleanVendorScripts(function() {
                    compileVendorScripts(function() {
                        gutil.log(chalk.yellow('Updated vendor scripts.'));
                    });
                });                
            }
            if (path.parse(filePath).ext === '.css') {
                cleanVendorStyles(function() {
                    compileVendorStyles(function() {
                        gutil.log(chalk.yellow('Updated vendor styles.'));
                    });
                });                
            }
        }
    });
}

// define tasks and task information
gulp.task('vendor', gulp.series(gulp.parallel(cleanVendorScripts, cleanVendorStyles), gulp.parallel(compileVendorScripts, compileVendorStyles)));
var vendor = gulp.task('vendor');
vendor.displayName = 'vendor';
vendor.description = 'Creates compiled vendor file.';

gulp.task('vendor:watch', gulp.parallel(watchVendor));
var vendorWatch = gulp.task('vendor:watch');
vendorWatch.displayName = 'vendor:watch';
vendorWatch.description = 'Watches vendor config and folders for changes.';