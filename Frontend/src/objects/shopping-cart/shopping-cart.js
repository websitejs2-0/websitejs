/* globals OrderCtrl */

'use strict';

var rivets = require('rivets');

/**
 * TODO
 */
var ShoppingCart = function($element) {

    this.init = function() {

        // configure Rivets
        rivets.configure({
            templateDelimiters: ['[[', ']]'],
        });

        // bind data to element with Rivets
        rivets.bind($element, { order: OrderCtrl.order });

        OrderCtrl.updateCartElements();

    };

};

ComponentHandler.register({
    constructor: ShoppingCart,
    classAsString: 'ShoppingCart',
    cssClass: 'js-shopping-cart'
});
