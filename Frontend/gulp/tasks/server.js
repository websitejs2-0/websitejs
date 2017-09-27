var gulp = require('gulp'),
    chalk = require('chalk'),
    nodemon = require('gulp-nodemon');

/**
 * Starts a development server
 * @param {function} done 
 */
function startServer(done) {
    var stream = nodemon({
        verbose: false,
        script: './Frontend/server/server.js',
        env: {
            'NODE_ENV': process.env.NODE_ENV
        },
        watch: [
            "/Frontend/server/**/*.js",
            "/Frontend/gulp/tasks/server.js",
            "/package.json"
        ]
    });
    
    stream.on('crash', function() {
        stream.emit('exit');
    });

    stream.on('exit', function() {
        console.log(chalk.red('Server killed.'));
    });

    done();
}

gulp.task('server:start', gulp.parallel(startServer));
var server = gulp.task('server:start');
server.displayName = 'server:start';
server.description = 'Starts the development server.';