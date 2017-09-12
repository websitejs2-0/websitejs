'use strict';

var Header = function($element) {

    this.init = function() {
        console.log('Header init!');
        return this;
    };

};

ComponentHandler.register({
    constructor: Header,
    classAsString: 'Header',
    cssClass: 'js-header'
});