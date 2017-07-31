var path = require('path'),
    config = require(path.join(__dirname , 'Frontend', 'project.config.js')),
    requireDir = require('require-dir'),
    chalk = require('chalk'),
    gulp = require('gulp'),
    cp = require('child_process'),
    nodemon = require('gulp-nodemon');

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
console.log(chalk.yellow('\nBuild: %s %s\n'), process.env.NODE_ENV, (process.env.DEBUG === 'true') ? 'in debug mode.' : '');

// register default task
gulp.task('default', gulp.series(gulp.parallel('assets', 'svgicons', 'vendor'), gulp.parallel('styles', 'scripts')));
gulp.task('watch', gulp.parallel('styles:watch', 'scripts:watch', 'assets:watch', 'svgicons:watch'));

function startServer(done) {
    nodemon({
        verbose: false,
        script: './Frontend/server/server.js',
        //args: ['--config ./Frontend/server/nodemon.json'],
        env: {
            'NODE_ENV': process.env.NODE_ENV
        },
        //ignore: ['**/*.js', '**/*.json', config.folders.src.root, config.folders.build.root],
        watch: [
            "/Frontend/server/server.config.js",
            "/Frontend/server/server.js",
            "/package.json"
        ]
    });
}

// // define tasks and add task information
// gulp.task('server', gulp.parallel(startServer, 'watch'));
// var server = gulp.task('server');
// server.displayName = 'server';
// server.description = 'Starts a development server in a new child process.';

// var cp = require('child_process'),
//     gulp = require('gulp'),
//     nodemon = require('nodemon');

// function startServer() {
//     // return nodemon({
//     //     script: './Frontend/server/server.js' 
//     // });
//     // var server = cp.exec('node ./Frontend/server/server.js', {
//     //     cwd: '.',
//     //     env: process.env.NODE_ENV
//     // });
//     // server.stdout.on('data', function(data) {
//     //     console.log(data);
//     // });
//     var server = gls.new('./Frontend/server/server.js');
//         server.start();
// }

// define tasks and add task information
gulp.task('server', gulp.parallel(startServer, 'watch'));
var server = gulp.task('server');
server.displayName = 'server';
server.description = 'Starts a development server in a new child process.';