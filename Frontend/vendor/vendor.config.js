'use strict';

    //filename of vendor files
var fileName = 'vendor',

    // include script paths
    scripts = [

        // jquery and plugins
        'node_modules/jquery/dist/jquery.min.js',

        // various libs
        'node_modules/js-cookie/src/js.cookie.js'
    ],

    // include style paths
    styles = [

    ],

    // include other components and the destination paths
    other = [

    ];

// create object to export
var vendor = {
    fileName: fileName,
    scripts: scripts,
    styles: styles,
    other: other
};

// export
module.exports = vendor;