'use strict';

// create paths/folders
var path = require('path'),
    pkg = require('../package.json'),
    vendor = require('./vendor/vendor.config.js'),

    project = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        jqversion: pkg.dependencies.jquery.replace('^', ''),
        bsversion: pkg.dependencies['bootstrap'].replace('^', '')
    },

    // current working dir, root folders
    cwd = __dirname,
    gulpTasks = path.join(cwd, 'gulp', 'tasks'),
    srcRoot = path.join(cwd, 'src'),
    buildRoot = path.join(cwd, '..', 'static'),

    // filenames
    vendorFileName = vendor.fileName,

    // source and build folders
    folders = {
        src: {
            root: srcRoot,
            js: path.join(srcRoot, 'js'),
            css: path.join(srcRoot, 'scss'),
            assets: {
                root: path.join(srcRoot, 'assets'),
                images: path.join(srcRoot, 'assets', 'images'),
                icons: {
                    root: path.join(srcRoot, 'assets', 'icons'),
                    svg: path.join(srcRoot, 'assets', 'icons', 'svg')
                },
                fonts: path.join(srcRoot, 'assets', 'fonts')
            },
            objects: path.join(srcRoot, 'objects'),
            components: path.join(srcRoot, 'components'),
        },
        build: {
            root: buildRoot,
            js: path.join(buildRoot, 'js'),
            css: path.join(buildRoot, 'css'),
            assets: {
                root: path.join(buildRoot, 'assets'),
                images: path.join(buildRoot, 'assets', 'images'),
                icons: {
                    root: path.join(buildRoot, 'assets', 'icons'),
                    svg: path.join(buildRoot, 'assets', 'icons', 'svg')
                },
                fonts: path.join(buildRoot, 'assets', 'fonts')
            },
            objects: path.join(buildRoot, 'objects'),
            components: path.join(buildRoot, 'components')
        },
        vendor: {
            src: {
                root: path.join(cwd, 'vendor')
            },
            build: {
                root: path.join(buildRoot, 'vendor'),
                js: path.join(buildRoot, 'js', 'vendor'),
                css: path.join(buildRoot, 'css', 'vendor')
            }
        },
        test: path.join(cwd, 'test')
    };

// create object to export
var config = {
    project: project,
    cwd: cwd,
    vendorFileName: vendorFileName,
    folders: {
        gulpTasks: gulpTasks,
        src: folders.src,
        build: folders.build,
        vendor: {
            src: folders.vendor.src,
            build: folders.vendor.build
        },
        test: folders.test
    },
    vendor: {
        scripts: vendor.scripts,
        styles: vendor.styles,
        other: vendor.other
    }
};

// export
module.exports = config;