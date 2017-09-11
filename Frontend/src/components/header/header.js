'use strict';

var Header = function() {

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