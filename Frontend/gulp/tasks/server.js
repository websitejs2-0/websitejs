var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

/**
 * Starts a development server
 * @param {function} done 
 */
function startServer() {
    nodemon({
        verbose: false,
        script: './Frontend/server/server.js',
        env: {
            'NODE_ENV': process.env.NODE_ENV
        },
        watch: [
            "/Frontend/server/server.config.js",
            "/Frontend/server/server.js",
            "/package.json"
        ]
    });
}

gulp.task('server:start', gulp.parallel(startServer));
var server = gulp.task('server:start');
server.displayName = 'server:start';
server.description = 'Starts the development server.';