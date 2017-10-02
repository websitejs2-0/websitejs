/* globals OrderCtrl */

'use strict';

var rivets = require('rivets');

/**
 * Shopping cart class.
 * @param {jqueryelement} $element Current shopping-cart node.
 * @author Peter Bust <peter.bust@valtech.nl>
 */
var ShoppingCart = function($element) {

    /**
     * Initializes shopping-cart component.
     * @public
     */
    this.init = function() {
        this.initRivets();

        OrderCtrl.updateCartElements();
    };

    /**
     * Initialize Rivets (data binding solution) by configuring and binding data to element.
     * @public
     */
    this.initRivets = function() {
        rivets.configure({
            templateDelimiters: ['[[', ']]'],
        });

        rivets.bind($element, {
            order: OrderCtrl.order
        });
    };

};

ComponentHandler.register({
    constructor: ShoppingCart,
    classAsString: 'ShoppingCart',
    cssClass: 'js-shopping-cart'
});
