var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
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
        if (process.env.DEBUG === 'true' && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Copies and optimizes assets to build folder.
 * @param {function} done Callback.
 */
function compileAssets(done) {
    gulp.src(path.join(config.folders.src.assets.images, '**/*.{jpg,png,gif}'))
        .pipe(imagemin([], {
            verbose: (process.env.DEBUG === 'true')
        }))
        .pipe(gulp.dest(config.folders.build.assets.images))
        .on('finish', function() { done(); });
}

/**
 * Watches assets images folder for changes.
 */
function watchAssets() {
    var watcher = gulp.watch(path.join(config.folders.src.assets.images), { ignorePermissionErrors: true });

    watcher.on('all', function(e, filePath) {
        
        // get file (in build folder)
        var pathChunks = path.parse(filePath),
            fileName = pathChunks.base,
            relFilePath = path.relative(config.folders.src.assets.images, pathChunks.dir),
            distFilePath = path.join(config.folders.build.assets.images, relFilePath);

        if (e === 'unlink' || e === 'unlinkDir') {
            // on remove, remove file from build dir
            del(path.join(distFilePath, fileName)).then(function(paths) {
                if (paths.length > 0) {
                    gutil.log(chalk.yellow('Removed %s.'), paths.join(', '));
                }
            });            
        } else {
            // on add or change, copy and optimize
            gulp.src(path.join(config.folders.src.assets.images, '**/', fileName))
                .pipe(imagemin([], {
                    verbose: (process.env.DEBUG === 'true')
                }))
                .pipe(gulp.dest(config.folders.build.assets.images)) 
                .on('finish', function() { 
                    gutil.log(chalk.yellow('%s %s.'), e, path.join(distFilePath, fileName));
                });           
        }

    });
}

// define tasks and add task information
gulp.task('assets', gulp.series(cleanAssets, compileAssets));
var assets = gulp.task('assets');
assets.displayName = 'assets';
assets.description = 'Copy and optimize assets.';

gulp.task('assets:watch', gulp.parallel(watchAssets));
var assetsWatch = gulp.task('assets:watch');
assetsWatch.displayName = 'assets:watch';
assetsWatch.description = 'Watches assets images folder for changes.';