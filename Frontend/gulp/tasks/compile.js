var path = require('path'),
    config = require(path.join('..', '..', 'project.config.js')),
    fs = require('fs-extra'),
    del = require('del'),
    chalk = require('chalk'),
    glob = require('glob'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    Handlebars = require('handlebars'),
    hbshelpers = require('../../server/hbs-helpers/helpers.js');

// register handlebars helpers
Handlebars.registerHelper(hbshelpers);

// register partials
var objects = glob.sync(path.join(config.folders.src.objects, '**/*.object.html')),
    components = glob.sync(path.join(config.folders.src.components, '**/*.html')),
    partials = objects.concat(components);

for (var i = 0; i < partials.length; i++) {
    var template = fs.readFileSync(partials[i], 'utf8'),
        name = path.parse(partials[i]).name;
    Handlebars.registerPartial(name, template);
}


/**
 * Compiles views by compiling handlebars.
 * @param {function} done Callback. 
 */
function compileView(done) {

    // get arguments
    var args = process.argv.slice(3);
    
    if (args.length < 1) {
        console.log(chalk.red('\nCompile Error: At least specify a type to compile (--c, --component).'));
        console.log(chalk.red('Or use "gulp compile --ch" to show help.'));
        console.log('\n');
    } else {

        switch(args[0]) {
            case '--ch':
            case '--chelp': {
                console.log('\n\nTo use gulp compile specify the following parameters:');
                console.log('%s\t%s', chalk.yellow('--component <componentname>'), chalk.white('Compiles component of given name'));
                console.log('%s\t\t\t\t%s', chalk.yellow('--c'), chalk.white('Compiles all components'));
                console.log('\n\n');
                break;
            }
            case '--c':
            case '--component': {
                
                if (typeof args[1] !== 'undefined') {
                    if (typeof Handlebars.partials[args[1]] !== 'undefined') {
                        var file = path.join(config.folders.build.components, args[1], args[1] + '.html'),
                            tpl = Handlebars.compile(Handlebars.partials[args[1]]);

                        fs.outputFile(file, tpl(), function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        gutil.log('Compiled: %s', chalk.yellow(file));
                    }
                } else {

                    for (var component in Handlebars.partials) {
                        var pat = /\.object/g;
                        if (!pat.exec(component)) {
                            /* jshint ignore:start */
                            var file = path.join(config.folders.build.components, component, component + '.html'),
                                tpl = Handlebars.compile(Handlebars.partials[component]);
                            fs.outputFile(file, tpl(), function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            }); 
                            gutil.log('Compiled: %s', chalk.yellow(file));
                            /* jshint ignore:end */                           
                        }
                    }

                }

                break;
            }
            default: {
                console.log(chalk.red('\nCompile Error: At least specify a type to compile (--c, --component).'));
                console.log(chalk.red('Or use "gulp compile --ch" to show help.'));
                console.log('\n'); 
                break;
            }
        }

    }

    done();
}

// define tasks and add task information
gulp.task('compile', gulp.series(compileView));
var compile = gulp.task('compile');
compile.displayName = 'compile';
compile.description = 'Compiles handlebars templates to html files.';