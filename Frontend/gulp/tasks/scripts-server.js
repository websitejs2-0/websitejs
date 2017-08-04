var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    through = require('through2'),    
    named = require('vinyl-named'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps');

/**
 * Cleans scripts bundle file.
 * @param {function} done Callback.
 */
function cleanServerScripts(done) {
    del([path.join(config.folders.build.js, 'server.{min.js,min.js.map,js}'), '!' + config.folders.build.js]).then(function(paths) {
        if (process.env.DEBUG === 'true' && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Compiles scripts bundle file from source.
 * @param {function} done Callback.
 */
function compileServerScripts(done) {

    gulp.src([path.join(config.folders.src.root, 'server.js')])
        .pipe(named(function() { return 'server.min'; }))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(webpackStream(require(path.join(config.cwd, 'gulp', 'webpack.config.js')), webpack, function(err, stats) {
            if (process.env.DEBUG === 'true') {
                gutil.log(stats.toJson());
            }
            if (err) {
                gutil.log('%s: %s', chalk.red('Webpack issue'), chalk.white(err));
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init({ 
            loadMaps: true 
        }))
        .pipe(through.obj(function(file, enc, cb) {
            // Dont pipe through any source map files as it will be handled
            // by gulp-sourcemaps
            var isSourceMap = /\.map$/.test(file.path);
            if (!isSourceMap) this.push(file);
            cb();
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.folders.build.js))
        .on('finish', function() { done(); });
}

/**
 * Watches scripts, objects and components folders for changes.
 */
function watchServerScripts() {
    gulp.watch([
        path.join(config.folders.src.root, 'server.js'),
        path.join(config.folders.src.objects, '**/*.js'),
        path.join(config.folders.src.components, '**/*.js')
    ], { ignorePermissionErrors: true }, gulp.series('scripts'));
}

// define tasks and add task information
gulp.task('scripts:server', gulp.series(cleanServerScripts, compileServerScripts));
var serverScripts = gulp.task('scripts:server');
serverScripts.displayName = 'scripts:server';
serverScripts.description = 'Compiles server scripts bundle file from source.';

gulp.task('scripts:server:watch', gulp.series(watchServerScripts));
var serverScriptsWatch = gulp.task('scripts:server:watch');
serverScriptsWatch.displayName = 'scripts:server:watch';
serverScriptsWatch.description = 'Watches server scripts, objects and components folders for changes';