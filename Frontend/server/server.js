'use strict';

var path = require('path'),
    fs = require('fs'),
    requireDir = require('require-dir'),
    config = require('./server.config.js'),
    dateFormat = require('../src/js/libs/date-formatter'),
    devIp = require('dev-ip'),
    findPort = require('find-free-port'),
    chalk = require('chalk'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    helpers = require('./hbs-helpers/helpers.js'),
    favicon = require('serve-favicon'),
    bs = require('browser-sync').create(),
    app = express();

// define browsersync watches
bs.watch(config.server.filesToWatch, { ignoreInitial: true }).on('all', function(e, filename, fileinfo) {
    if (e === 'add' || e === 'change') {
        var date = dateFormat.localTimezone(fileinfo.mtime);
        console.log(chalk.yellow('Changed: %s\\%s %s'), chalk.yellow(path.relative(__dirname, path.dirname(filename))), chalk.white(path.parse(filename).base), chalk.yellow('@ ' + date));
        bs.reload();
    }
});

// create partials dir array
var partialsDirs = [path.join(__dirname, 'views', 'partials'), config.folders.src.objects, config.folders.src.components],
    partialsObjectsDirs = fs.readdirSync(config.folders.src.objects),
    partialsComponentsDirs = fs.readdirSync(config.folders.src.components);
for (var i = 0; i < partialsObjectsDirs.length; i++) {
    partialsDirs.push(path.join(config.folders.src.objects, partialsObjectsDirs[i]));
}
for (var j = 0; j < partialsComponentsDirs.length; j++) {
    partialsDirs.push(path.join(config.folders.src.objects, partialsComponentsDirs[j]));
}

// configure handlebars 
var hbs = exphbs.create({
    partialsDir: partialsDirs,
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'master',
    extname: '.html',
    helpers: helpers
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

// routers
var routers = requireDir(config.server.folders.routers);
app.use('/styleguide', routers.styleguide);

// routing
app.get('/', function(req, res) {

    //console.log(res);
    res.render('index', {
        meta: {
            title: config.project.name
        },
        project: config.project,
        theme: { color: '#000000' },
        environment: process.env.NODE_ENV,
        debug: process.env.DEBUG,
        paths: config.server.paths
    });
});

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