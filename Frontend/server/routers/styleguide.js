'use strict';

var path = require('path'),
    config = require('../server.config.js'),
    express = require('express'),
    router = express.Router(),
    wjs = require('../../src/js/libs/websitejs'),
    slash = require('slash');

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

router.get('/:elementType(objects|components)/*', function(req, res) {

    // render page
    res.render('styleguide/partial.html', {
        layout: 'master-styleguide',
        meta: {
            title: req.params.elementType + ' | ' + req.params[0]
        },
        theme: { color: '#000000' },
        partial: function() { return req.params[0] },
        name: req.params[0],
        fullPath: path.join(config.folders.src[req.params.elementType], req.params[0] + '.html'),
        paths: config.server.paths
    });

});


module.exports = router;
