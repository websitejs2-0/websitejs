'use strict';

var path = require('path'),
    slash = require('slash'),
    config = require(path.join('..', 'project.config.js'));

var server = {
    root: config.folders.build.root,

    folders: {
        views: [
            path.join(__dirname, 'views'),
            config.folders.src.objects,
            config.folders.src.components
        ]
    },

    paths: {
        js: path.relative(config.folders.build.root, config.folders.build.js),
        css: path.relative(config.folders.build.root, config.folders.build.css),
        assets: {
            root: path.relative(config.folders.build.root,  config.folders.build.assets.root),
            images: path.relative(config.folders.build.root,  config.folders.build.assets.images),
            icons: {
                root: path.relative(config.folders.build.root, config.folders.build.assets.icons.root),
                svg: slash(path.relative(config.folders.build.root, config.folders.build.assets.icons.svg))
            },
            fonts: path.relative(config.folders.build.root, config.folders.build.assets.fonts)
        }
    },

    filesToWatch: [
        path.join(__dirname, 'views', '**/*.html'),
        path.join(config.folders.build.root, '**/*.{min.js,min.css}'),
        path.join(config.folders.src.objects, '**/*.html'),
        path.join(config.folders.src.components, '**/*.html')        
    ]
};

config.server = server;

module.exports = config;