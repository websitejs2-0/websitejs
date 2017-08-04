'use strict';

var path = require('path'),
    glob = require('glob'),
    slash = require('slash');

/**
 * WebsiteJS project related utils.
 * @author Rocco Janse, rocco.janse@valtech.nl
 */
var wjs = {

    getFiles: function(objPath) {

        var files = [],
            fileList = glob.sync(path.join(objPath, '**', '!(*.object|*.component).html'));

        for(var i = 0; i < fileList.length; i++) {
            var filePath = path.relative(objPath, fileList[i]),
                pathParsed = path.parse(filePath),
                file = {
                    fileName: pathParsed.base,
                    name: pathParsed.name,
                    ext: pathParsed.ext,
                    baseType: pathParsed.dir.split(path.sep)[0],
                    type: pathParsed.dir,
                    path: fileList[i],
                    relPath: slash(filePath)
                };
            files.push(file);
        }

        return files;
    }

};

module.exports = wjs;