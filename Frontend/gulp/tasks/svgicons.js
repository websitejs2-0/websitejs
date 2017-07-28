var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');

/**
 * Cleans assets svg icons folder by removing svg files.
 * @param {function} done Callback.
 */
function clean(done) {
    del([path.join(config.folders.build.assets.icons.svg, '**/*.svg'), '!' + config.folders.build.assets.icons.svg]).then(function(paths) {
        if (config.debugMode && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Compiles a svg 'spritesheet' prefixed based on folder structure.
 * @param {function} done Callback.
 */
function compile(done) {
    gulp.src(path.join(config.folders.src.assets.icons.svg, '**/*.svg'), { 
        base: config.folders.src.assets.icons.svg 
    })
        .pipe(svgmin())
        .pipe(rename(function(path) {
            var name = path.dirname.split(path.sep);
            if (name[0] !== '.' && name[0] !== '..') {
                name.push(path.basename);
                path.basename = name.join('-');
            }
        }))        
        .pipe(svgstore())
        .pipe(rename({
            basename: 'svgicons'    
        }))
        .pipe(gulp.dest(config.folders.build.assets.icons.svg))
        .on('finish', function() { done(); });
}

/**
 * Watches svg icons folder for changes.
 */
function watch() {
    var watcher = gulp.watch(path.join(config.folders.src.assets.icons.svg), { ignorePermissionErrors: true }),
        inProgress = false;

    watcher.on('all', function(e, filePath, stats) {
        if (inProgress === false) {
            gutil.log(chalk.white('Updating svg icons...'));
            inProgress = true;
            setTimeout(function() {
                clean(function() {
                    compile(function() {
                        gutil.log(chalk.yellow('Updated svg icons file.'));
                        inProgress = false;
                    });
                });
            }, 2000);
        }
    });
}

// define tasks and task information
gulp.task('svgicons', gulp.series(clean, compile));
var svgicons = gulp.task('svgicons');
svgicons.displayName = 'svgicons';
svgicons.description = 'Creates SVG icons spritesheet.';

gulp.task('svgicons:watch', gulp.parallel(watch));
var svgiconsWatch = gulp.task('svgicons:watch');
svgiconsWatch.displayName = 'svgicons:watch';
svgiconsWatch.description = 'Watches svg icon dir for changes.';
