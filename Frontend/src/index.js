'use strict';

// requires
require('bootstrap-sass/assets/javascripts/bootstrap/dropdown.js');
var _ = require('lodash'),
    salute = require('./js/libs/salute.js');

// main logic
$(function() { 
    
    $('.dropdown-toggle').dropdown();

    console.log(salute.getSalute() + ' world!');

});

// window events
$(window).on('resize', _.debounce(function() {

        console.log('Current breakpoint: ', viewport.current());

}, 200));