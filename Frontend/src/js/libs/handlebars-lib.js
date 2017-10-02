'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    Handlebars = require('handlebars'),
    hbshelpers = require('../../../server/hbs-helpers/helpers.js');

/**
 * TODO.
 */
var HandlebarsLib = function() {

    // register handlebars helpers
    Handlebars.registerHelper(hbshelpers);

    /**
     * Register Handlebar partials for directrly reuse in templates.
     * @param {array} partials List of file paths to register as partials.
     */
    this.registerPartials = function(partials) {

        for (var i = 0; i < partials.length; i++) {
            var template = fs.readFileSync(partials[i], 'utf8'),
                name = path.parse(partials[i]).name;
            Handlebars.registerPartial(name, template);
        }

    };

};

module.exports = new HandlebarsLib();
