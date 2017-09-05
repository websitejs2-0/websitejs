'use strict';

var _ = require('lodash');

// responsive toolkit bootstrap 4 support
viewport.use('Bootstrap4', {
    'xs': $('<div class="d-xs-block d-sm-none"></div>'),
    'sm': $('<div class="d-none d-sm-block d-md-none"></div>'),
    'md': $('<div class="d-none d-md-block d-lg-none"></div>'),
    'lg': $('<div class="d-none d-lg-block d-xl-none"></div>'),
    'xl': $('<div class="d-none d-xl-block"></div>')
});

// main logic
$(function() { 
    
    console.log('Loaded.');

});

// window events
$(window).on('resize', _.debounce(function() {
console.log('RESIZED');
        console.log('Current breakpoint: ', viewport.current());

}, 200));