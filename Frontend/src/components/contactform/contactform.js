'use strict';

require ('bootstrap/js/dist/collapse');

var ContactForm = function($element) {
    
    this.init = function() {
        console.log('Contactform init!');
        return this;
    };

};

ComponentHandler.register({
    constructor: ContactForm,
    classAsString: 'ContactForm',
    cssClass: 'js-contactform'
});