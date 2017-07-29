var path = require('path'),
    config = require(path.join(__dirname , 'Frontend', 'project.config.js')),
    requireDir = require('require-dir'),
    chalk = require('chalk'),
    gulp = require('gulp');

// get tasks from dir
requireDir(config.folders.gulpTasks);

// handle debug and production modues
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DEBUG = process.env.DEBUG || 'false';
process.argv.forEach(function(val) {
    if (val === '--production') {
        process.env.NODE_ENV = val.replace('--', '');
    }
    if (val === '--debug') {
        process.env.DEBUG = 'true';
    }
});

console.clear();
console.log(chalk.yellow('\nCurrent environment: %s %s\n'), process.env.NODE_ENV, (process.env.DEBUG === 'true') ? 'in debug mode.' : '');
console.log(process.env.DEBUG, process.env.DEBUG === 'true');

// register default task
gulp.task('default', gulp.series(gulp.parallel('assets', 'svgicons', 'vendor'), gulp.parallel('styles')));
