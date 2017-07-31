// var cp = require('child_process'),
//     gulp = require('gulp'),
//     nodemon = require('nodemon');

// function startServer() {
//     // return nodemon({
//     //     script: './Frontend/server/server.js' 
//     // });
//     return cp.exec('node ./Frontend/server/server.js');
// }

// // define tasks and add task information
// gulp.task('server:start', gulp.parallel(startServer, 'watch'));
// var server = gulp.task('server:start');
// server.displayName = 'server:start';
// server.description = 'Starts a development server in a new child process.';