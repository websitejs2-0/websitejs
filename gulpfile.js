var path = require('path'),
    config = require(path.join(__dirname , 'Frontend', '.project.config.js')),
    requireDir = require('require-dir'),
    chalk = require('chalk'),
    gulp = require('gulp');

// get tasks from dir
requireDir(config.folders.gulpTasks);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.argv.forEach(function(val, i) {
    if (val === '--env' && process.argv[i + 1] === 'production') {
        process.env.NODE_ENV = process.argv[i + 1];
    }
});

console.clear();
console.log(chalk.yellow('\n\nCurrent environment: %s\n\n'), process.env.NODE_ENV);

// register default task
gulp.task('default', gulp.series(gulp.parallel('assets')));
