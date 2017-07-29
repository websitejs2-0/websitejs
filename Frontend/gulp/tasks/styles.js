var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('gulp-cssnano'),
    strip = require('gulp-strip-comments'),
    rename = require('gulp-rename');

/**
 * Cleans compiled css file.
 * @param {function} done Callback.
 */
function cleanStyles(done) {
    del([path.join(config.folders.build.css, config.cssFileName + '.{min.css,min.css.map,css}'), '!' + config.folders.build.css]).then(function(paths) {
        if (process.env.DEBUG === 'true' && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Compiles css file from sass source.
 * @param {function} done Callback.
 */
function compileStyles(done) {

    var nanoOptions = {
        discardComments: {
            removeAll: true
        },
        zindex: false,
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        autoprefixer: false
    };

    gulp.src(path.join(config.folders.src.root, config.cssFileName + '.{scss,sass}'))
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.init() : gutil.noop())
        .pipe(sass({
            outputStyle: 'expanded',
            defaultEncoding: 'utf-8',
            unixNewlines: false,
            precision: 4,
            compass: false,
            includePaths: ['node_modules'],
            errLogToConsole: true,
            stopOnError: false
        }).on('error', function(err) {
            gutil.log('%s %s, %s: %s', chalk.red('SASS issue in'), chalk.yellow(err.relativePath), chalk.red('line ' + err.line + ', col ' + err.column), chalk.white(err.messageOriginal));
            this.emit('end');
        }))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe((process.env.NODE_ENV !== 'production') ? gulp.dest(config.folders.build.css) : gutil.noop())
        .pipe(cssnano(nanoOptions))
        .pipe(strip())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.write('.') : gutil.noop())
        .pipe(gulp.dest(config.folders.build.css))
        .on('finish', function() { done(); });
}

/**
 * Watches assets images folder for changes.
 */
function watchStyles() {
    // var watcher = gulp.watch(path.join(config.folders.src.assets.images), { ignorePermissionErrors: true });

    // watcher.on('all', function(e, filePath, stats) {
        
    //     // get file (in build folder)
    //     var pathChunks = path.parse(filePath),
    //         fileName = pathChunks.base,
    //         relFilePath = path.relative(config.folders.src.assets.images, pathChunks.dir),
    //         distFilePath = path.join(config.folders.build.assets.images, relFilePath);

    //     if (e === 'unlink' || e === 'unlinkDir') {
    //         // on remove, remove file from build dir
    //         del(path.join(distFilePath, fileName)).then(function(paths) {
    //             if (paths.length > 0) {
    //                 gutil.log(chalk.yellow('Removed %s.'), paths.join(', '));
    //             }
    //         });            
    //     } else {
    //         // on add or change, copy and optimize
    //         gulp.src(path.join(config.folders.src.assets.images, '**/', fileName))
    //             .pipe(imagemin([], {
    //                 verbose: config.debugMode
    //             }))
    //             .pipe(gulp.dest(config.folders.build.assets.images)) 
    //             .on('finish', function() { 
    //                 gutil.log(chalk.yellow('%s %s.'), e, path.join(distFilePath, fileName));
    //             });           
    //     }

    // });
}

// define tasks and add task information
gulp.task('styles', gulp.series(cleanStyles, compileStyles));
var styles = gulp.task('styles');
styles.displayName = 'styles';
styles.description = 'Compiles css file from sass source.';

gulp.task('styles:watch', gulp.parallel(watchStyles));
var stylesWatch = gulp.task('styles:watch');
stylesWatch.displayName = 'styles:watch';
stylesWatch.description = 'Watches sass file, elements and components folders for changes.';