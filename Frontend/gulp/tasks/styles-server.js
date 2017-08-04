var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    cssglob = require('gulp-css-globbing'),
    sass = require('gulp-sass'),
    sasslint = require('gulp-sass-lint'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename');

/**
 * Cleans compiled css file.
 * @param {function} done Callback.
 */
function cleanServerStyles(done) {
    del([path.join(config.folders.src.root, 'server.{min.css,min.css.map,css}'), '!' + config.folders.build.css]).then(function(paths) {
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
function compileServerStyles(done) {

    gulp.src(path.join(config.folders.src.root, 'server.{scss,sass}'))
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.init() : gutil.noop())
        .pipe(cssglob({ 
            extensions: ['.scss'], 
            ignoreFolders: ['.', './scss'] 
        }))
        .pipe(sasslint({
            configFile: './.sass-lint.yml'
        }))
        .pipe(sasslint.format())
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
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            },
            zindex: false,
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            autoprefixer: false
        }).on('error', function(err) {
            gutil.log('%s: %s', chalk.red('CSSNano issue'), chalk.white(err.messageOriginal));
            this.emit('end');
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe((process.env.NODE_ENV !== 'production') ? sourcemaps.write('.') : gutil.noop())
        .pipe(gulp.dest(config.folders.build.css))
        .on('finish', function() { done(); });
}

/**
 * Watches sass file, objects and components folders for changes.
 */
function watchServerStyles() {
    gulp.watch([
        path.join(config.folders.src.root, 'server.{scss,sass}'),
        path.join(config.folders.src.css, '**/*.{scss,sass}'),
        path.join(config.folders.src.objects, '**/*.{scss,sass}'),
        path.join(config.folders.src.components, '**/*.{scss,sass}')
    ], { ignorePermissionErrors: true }, gulp.parallel('styles'));
}

// define tasks and add task information
gulp.task('styles:server', gulp.series(cleanServerStyles, compileServerStyles));
var serverStyles = gulp.task('styles:server');
serverStyles.displayName = 'styles:server';
serverStyles.description = 'Compiles css for the server.';

gulp.task('styles:server:watch', gulp.parallel(watchServerStyles));
var serverStylesWatch = gulp.task('styles:server:watch');
serverStylesWatch.displayName = 'styles:server:watch';
serverStylesWatch.description = 'Watches server sass file, objects and components folders for changes.';
