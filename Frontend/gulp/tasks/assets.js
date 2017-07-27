var path = require('path'),
    config = require(path.join('..', '..', '.project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin');

/**
 * Cleans assets folder by removing jpg/png/gif files.
 * @param {function} done Callback.
 */
function cleanAssets(done) {
    del([path.join(config.folders.build.assets.images, '**/*.{jpg,png,gif}'), '!' + config.folders.build.assets.images]).then(function(paths) {
        if (config.debugMode) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
    done();
}

/**
 * Copies and optimizes assets to build folder.
 * @param {function} done Callback.
 */
function compileAssets(done) {
    gulp.src(path.join(config.folders.src.assets.images, '**/*.{jpg,png,gif}'))
        .pipe(imagemin([], {
            verbose: config.debugMode
        }))
        .pipe(gulp.dest(config.folders.build.assets.images))
        .on('finish', function() { done(); });
}

function watchAssets() {
    console.log(config.folders.src.assets.images);
    var watcher = gulp.watch(path.join(config.folders.src.assets.images, '**/*.{jpg,png,gif}'));

    watcher.on('all', function(e, filePath, stats) {
        
        // on remove, remove file from build dir
        if (e === 'unlink') {
            var pathChunks = path.parse(filePath),
                fileName = pathChunks.base,
                relFilePath = path.relative(config.folders.src.assets.images, pathChunks.dir),
                distFilePath = path.join(config.folders.build.assets.images, relFilePath, fileName);
            
            del(distFilePath).then(function(paths) {
                if (paths.length > 0) {
                    gutil.log(chalk.yellow('Removed %s.'), paths.join(', '));
                }
            });            
        }

    });
}

// define task
gulp.task('assets', gulp.series(cleanAssets, compileAssets));
gulp.task('assets:watch', gulp.parallel(watchAssets));

// add task information
var assets = gulp.task('assets');
assets.displayName = 'Assets';
assets.description = 'Copy and optimize assets.';
