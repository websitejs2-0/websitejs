var path = require('path'),
    config = require(path.join(__dirname , 'Frontend', '.project.config.js')),
    requireDir = require('require-dir'),
    gulp = require('gulp');

// get tasks from dir
var taskFiles = requireDir(config.folders.gulpTasks);

// export/register found tasks
Object.keys(taskFiles).forEach(function(taskName) {
    //exports[taskName] = taskFiles[taskName];
    console.log(taskName, taskFiles[taskName]);
});

// // export/register default (build) task
// const build = gulp.series(gulp.parallel(exports.scripts, exports.sass), gulp.parallel(exports.svgicons, exports.assets));
// export default build;

