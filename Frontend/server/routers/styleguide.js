'use strict';

var path = require('path'),
    config = require('../server.config.js'),
    express = require('express'),
    router = express.Router(),
    wjs = require('../libs/websitejs'),
    slash = require('slash'),
    glob = require('glob');

// // middleware
// router.use(function (req, res, next) {
//     next();
// });

// routes
router.get('/', function(req, res) {

    // get project objects
    var objects = wjs.getFiles(config.folders.src.objects),
        components = wjs.getFiles(config.folders.src.components)
    
    // render page
    res.render('styleguide/styleguide', {
        meta: {
            title: config.project.name
        },
        project: config.project,
        theme: { color: '#000000' },
        environment: process.env.NODE_ENV,
        debug: process.env.DEBUG,
        paths: config.server.paths,
        pages: [{
            name: 'homepage',
            type: 'homepage',
            path: 'pages/homepage.html'
        },{
            name: 'dealerpage',
            type: 'dealerpage',
            path: 'pages/dealerpage.html'
        }],
        components: components,
        objects: objects
    });
});

router.get('/objects/icons/icons', function(req, res) {
    
    var folders = [];

    // get icon info
    var iconFolderList = glob.sync(path.join(config.folders.src.assets.icons.svg, '*')),
        numOfFolders = iconFolderList.length;

    // for each folder (spritesheet)
    for (var i = 0; i < numOfFolders; i++) {
            
        var folderName = path.relative(config.folders.src.assets.icons.svg, iconFolderList[i]),
            folder = {
                name: folderName,
                icons: []
            },
            iconList = glob.sync(path.join(config.folders.src.assets.icons.svg, folderName, '**/*.svg'));
        
        // for each icon in folder (spritesheet)
        for (var j = 0; j < iconList.length; j++) {

            var filePath = path.relative(path.join(config.folders.src.assets.icons.svg, folderName), iconList[j]),
                iconId = filePath.replace(path.sep, '-').replace('.svg', ''),
                icon = {
                    id: iconId,
                    title: iconId
                };

            folder.icons.push(icon);
        }
        folders.push(folder);
    }

    // render page
    res.render('styleguide/partial.html', {
        layout: 'master-styleguide',
        meta: {
            title: 'icons | icon overview'
        },
        theme: { color: '#000000' },
        partial: function() { return 'icons'; },
        folders: folders,
        paths: config.server.paths
    });
});

router.get('/objects/icons/:folderName/:iconId', function(req, res) {

        // render page
        res.render('styleguide/partial.html', {
            layout: 'master-styleguide',
            meta: {
                title: 'icons | ' + req.params.folderName + ' | ' + req.params.iconId
            },
            theme: { color: '#000000' },
            partial: function() { return 'icon-detail'; },
            icon: {
                id: req.params.iconId,
                folderName: req.params.folderName
            },
            paths: config.server.paths
        });
});

router.get('/:elementType(objects|components)/*', function(req, res) {

    // render page
    res.render('styleguide/partial.html', {
        layout: 'master-styleguide',
        meta: {
            title: req.params.elementType + ' | ' + req.params[0]
        },
        theme: { color: '#000000' },
        partial: function() { return req.params[0]; },
        name: req.params[0],
        fullPath: path.join(config.folders.src[req.params.elementType], req.params[0] + '.html'),
        paths: config.server.paths
    });

});



module.exports = router;
