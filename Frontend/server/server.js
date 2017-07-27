'use strict';

var path = require('path'),
    config = require('./server.config.js'),
    devIp = require('dev-ip'),
    findPort = require('find-free-port'),
    chalk = require('chalk'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    favicon = require('serve-favicon'),
    bs = require('browser-sync').create(),
    app = express();

// define browsersync watches
bs.watch(config.server.filesToWatch).on('change', function(filename, fileinfo) {
    var d = new Date(fileinfo.mtime),
        tz = (d.getTimezoneOffset() / 60) * - 1;
    d.setHours(d.getHours() + tz);
    if (tz >= 0) { 
        tz = '+' + tz;
    } else {
        tz = '-' + tz;
    }
    console.log(chalk.yellow('Changed: %s\\%s %s(%s)'), chalk.yellow(path.relative(__dirname, path.dirname(filename))), chalk.white(path.parse(filename).base), chalk.yellow('@ ' + d.toUTCString()), chalk.yellow(tz));
    bs.reload();
});

// configure handlebars 
var hbs = exphbs.create({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'master'),
    partialsDir: [path.join(__dirname, 'views', 'partials')],
    layoutsDir: [path.join(__dirname, 'views', 'layouts')],
    extname: '.html'
});

// configure server to use handlebars
app.engine('html', hbs.engine);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

// let app use browsersync
app.use(require('connect-browser-sync')(bs));

// set server root as static map
app.use(express.static(config.server.root));

// favicon
app.use(favicon(path.join(config.server.root, 'assets', 'icons', 'favicon.ico')));

// // routers
// var routers = {
//     styleguide: require(path.join(config.paths.routers, 'styleguide'))
// };

// routing
app.get('/', function(req, res) {

    //console.log(res);
    res.render('index', {
        meta: {
            title: config.project.name
        },
        project: {
            title: config.project.name,
            version: config.project.version,
            description: config.project.description
        },
        paths: config.server.paths
    });
});

// app.use('/styleguide', routers.styleguide);

// find free port and set up server
var port = process.env.PORT;
findPort(3000, 3100, '127.0.0.1', function(err, freePort) {
    
    port = freePort;
    
    app.listen(port, function() {

        console.log('\nstarting server...');

        // init browsersync
        bs.init({

            ui: false,
            logSnippet: false,
            reloadDelay: 1000,
            reloadOnRestart: true

        }, function() {

            var ip = devIp();
            console.log('\n');
            console.log(chalk.magenta('server successfully started.'));
            console.log(chalk.magenta('-------------------------------------'));
            console.log(chalk.magenta('   local: http://localhost:%d'), port);
            console.log(chalk.magenta('-------------------------------------'));
            console.log(chalk.magenta('external: http://%s:%d'), ip[0], port);
            console.log(chalk.magenta('-------------------------------------'));

            if (ip.length > 1) {
                console.log(chalk.magenta('     vpn: http://%s:%d'), ip[1], port);
                console.log(chalk.magenta('-------------------------------------'));
            }

            console.log('\n');
        });
    });
});