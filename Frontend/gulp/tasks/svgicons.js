var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    del = require('del'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    glob = require('glob'),
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');

/**
 * Cleans assets svg icons folder by removing svg files.
 * @param {function} done Callback.
 */
function cleanSvgIcons(done) {
    del([path.join(config.folders.build.assets.icons.svg, '**/*.svg'), '!' + config.folders.build.assets.icons.svg]).then(function(paths) {
        if (process.env.DEBUG === 'true' && paths.length > 0) {
            gutil.log('Cleaned:\n', paths.join('\n'));
        }
        done();
    });
}

/**
 * Compiles a svg 'spritesheet' prefixed based on folder structure.
 * @param {function} done Callback.
 */
function compileSvgIcons(done) {
    
    // get icon folders to determine filenames
    var iconFolderList = glob.sync(path.join(config.folders.src.assets.icons.svg, '*')),
        numOfFolders = iconFolderList.length,
        finished = 0;

    // add icons of each folder into own spritesheet
    for (var i = 0; i < numOfFolders; i++) {
        
        var folderName = path.relative(config.folders.src.assets.icons.svg, iconFolderList[i]);
        
        gulp.src(path.join(config.folders.src.assets.icons.svg, folderName, '**/*.svg'), { 
            base: path.join(config.folders.src.assets.icons.svg, folderName)
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
            basename: folderName    
        }))
        .pipe(gulp.dest(config.folders.build.assets.icons.svg))
        /* jshint ignore:start */
        .on('finish', function() {
            gutil.log(chalk.yellow('Compiled svg spritesheet: %s.svg'), path.relative(config.folders.build.root, path.join(config.folders.build.assets.icons.svg, path.relative(config.folders.src.assets.icons.svg, iconFolderList[finished]))));
            finished++;
            if (finished === numOfFolders) {
                done();
            }
        });
        /* jshint ignore:end */
        
    }
}

/**
 * Watches svg icons folder for changes.
 */
function watchSvgIcons(done) {
    var watcher = gulp.watch(path.join(config.folders.src.assets.icons.svg), { ignorePermissionErrors: true }),
        inProgress = false;

    watcher.on('all', function() {
        if (inProgress === false) {
            gutil.log(chalk.white('Updating svg icons...'));
            inProgress = true;
            setTimeout(function() {
                cleanSvgIcons(function() {
                    compileSvgIcons(function() {
                        gutil.log(chalk.yellow('Updated svg icons file.'));
                        inProgress = false;
                    });
                });
            }, 2000);
        }
    });
    done();
}

// define tasks and task information
gulp.task('svgicons', gulp.series(cleanSvgIcons, compileSvgIcons));
var svgicons = gulp.task('svgicons');
svgicons.displayName = 'svgicons';
svgicons.description = 'Creates SVG icons spritesheet.';

gulp.task('svgicons:watch', gulp.parallel(watchSvgIcons));
var svgiconsWatch = gulp.task('svgicons:watch');
svgiconsWatch.displayName = 'svgicons:watch';
svgiconsWatch.description = 'Watches svg icon dir for changes.';
