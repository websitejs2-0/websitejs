require('bootstrap-sass/assets/javascripts/bootstrap/dropdown.js');
var _ = require('lodash'),
    salute = require('./js/modules/salute.js');

$(function() { 
    
    $('.dropdown-toggle').dropdown();

    console.log(salute.getSalute() + ' world!');

});

$(window).on('resize', _.debounce(function() {
    console.log('resized');
    //viewport.changed(function() {
        console.log('Current breakpoint: ', viewport.current());
    //});

}, 200));