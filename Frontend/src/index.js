require('../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js');
var cookie = require('../../node_modules/js-cookie/src/js.cookie.js');

$(function() { 
    
    $('.dropdown-toggle').dropdown();

    $collapsible = $('#collapseExample');

    $('[href="#collapseExample"], [data-target="#collapseExample"]').on('click', function(e) {
        e.preventDefault();
        $collapsible.collapse('toggle');
    });

    $('[data-toggle = "tooltip"]').tooltip(); 

    console.log('COOKIE!@@@@@!!!!!!!@!@!!@', cookie);
});

$(window).resize(
    viewport.changed(function() {
        console.log('Current breakpoint: ', viewport.current());
    })
);