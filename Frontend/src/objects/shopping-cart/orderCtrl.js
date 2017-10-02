'use strict';

var Cookies = require('js-cookie');

(function() {

    /**
     * Order control class.
     * @author Peter Bust <peter.bust@valtech.nl>
     */
    var OrderCtrl = function() {

        /**
         * Cookie configurable items.
         */
        this.cookieConfig = {
            name: 'order', // name
            expires: 1 // value in days
        };

        /**
         * Calulate subtotal price for given amount and price.
         * @param {number} amount - Number of items.
         * @param {number} price - Item price.
         * @return {number} Calculated subtotal.
         * @public
         */
        this.calcSubtotal = function(amount, price) {
            return Number(Math.round((price * amount) + 'e2') + 'e-2');
        };

        /**
         * Calculate total price for given items.
         * @param {object} items - Set of items.
         * @return {number} Calculated total.
         * @public
         */
        this.calcTotal = function(items) {
            if (!items) return null;

            var total = 0;
            for (var i = 0; i < items.length; i++) total += items[i].subtotal;

            return Number(Math.round(total + 'e2') + 'e-2');
        };

        /**
         * Creates an order object.
         * @public
         */
        this.create = function() {
            this.order = {};
            this.update();
        };

        /**
         * Either updates the amount of already contained order item or (if not in order) pushes the item in the order object.
         * @param {object} item - Item to add.
         * @public
         */
        this.createItem = function(item) {
            var _this = this,
                notInOrder = true;

            item.price = parseFloat(item.price);
            item.amount = parseInt(item.amount);

            if (_this.order.items.length != 0)
                for (var i = 0; i < _this.order.items.length; i++)
                    if (_this.order.items[i].id === item.id) {
                        _this.order.items[i].amount += item.amount;
                        notInOrder = false;
                    }

            if (notInOrder) _this.order.items.push(item);

            _this.updateCartElements();
            _this.update();
        };

        /**
         * Deletes the cookie.
         * @public
         */
        this.delete = function() {
            Cookies.remove(this.cookieConfig.name);
        };

        /**
         * Removes an item from the order object with given id.
         * @param {string} id - Item id to remove.
         * @public
         */
        this.deleteItem = function(id) {
            var _this = this;

            for (var i = 0; i < _this.order.items.length; i++)
                if (_this.order.items[i].id === id) _this.order.items.splice(i, 1);

            _this.updateCartElements();
            _this.update();
        };

        /**
         * Return the stored (cookie) object, creates one if no cookie yet exists.
         * @return {object} Order object.
         * @public
         */
        this.read = function() {
            if (!Cookies.getJSON(this.cookieConfig.name)) this.create();

            return Cookies.getJSON(this.cookieConfig.name);
        };

        /**
         * Saves order object in a cookie (or overwrites already existing cookie).
         * @public
         */
        this.save = function() {
            Cookies.set(this.cookieConfig.name, this.order, { expires: 1 });
        };

        /**
         * Stringify a price to a (business logic) format.
         * Add two trailing zeros: "9.9" to "9.90" and "9" to "9.00"
         * Replace dot with comma like: "9.99" to "9,99"
         * @param {integer} price - Price to reformat.
         * @return {string} Stringified price.
         * @public
         */
        this.stringifyPrice = function(price) {
            return Number(Math.round(price + 'e2') + 'e-2').toFixed(2).replace('.', ',');
        };

        /**
         * Updates the order object calculated values and reformat required integers for view.
         * @public
         */
        this.update = function() {
            var _this = this,
                totalAmount = 0;

            if (!_this.order.items) _this.order.items = [];

            if (_this.order.items.length != 0) {
                for (var i = 0; i < _this.order.items.length; i++) {
                    var amount = _this.order.items[i].amount,
                        price = _this.order.items[i].price;

                    _this.order.items[i].priceAsString = _this.stringifyPrice(price);
                    _this.order.items[i].subtotal = _this.calcSubtotal(amount, price);
                    _this.order.items[i].subtotalAsString = _this.stringifyPrice(_this.order.items[i].subtotal);

                    totalAmount = totalAmount + amount;
                }

                _this.order.total = _this.calcTotal(_this.order.items);
                _this.order.totalAsString = _this.stringifyPrice(_this.order.total);
                _this.order.totalAmount = totalAmount;
                _this.order.isEmpty = false;
            } else _this.order.isEmpty = true;

            _this.save();
        };

        /**
         * Updates an item amount.
         * @param {string} action - Action to handle, '++' to add 1, '--' to remove 1 or 'value' to update a new amount value.
         * @param {string} id - Item id to update.
         * @param {number} amount - New amount to update in case of action is 'value',
         * @public
         */
        this.updateItemAmount = function(action, id, amount) {
            var _this = this;

            for (var i = 0; i < _this.order.items.length; i++)
                if (_this.order.items[i].id === id) {
                    if (action === '++') _this.order.items[i].amount += 1;
                    if (action === '--') _this.order.items[i].amount -= 1;
                    if (action === 'value') _this.order.items[i].amount = parseInt(amount);
                }

            _this.update();
        };

        /**
         * Updates individual scopes off shopping cart order-amount-ctrl elements.
         * @public
         */
        this.updateCartElements = function() {
            var $elements = $('.js-shopping-cart').find('.js-order-amount-ctrl');
            for (var i = 0; i < $elements.length; i++) {
                $($elements[i]).removeAttr('data-upgraded');
                ComponentHandler.upgradeElement($($elements[i]), 'OrderAmountCtrl');
            }
        };

        /**
         * The order object, bound to view in shopping-cart.js.
         * @public
         */
        this.order = this.read();

        return this;
    };

    window.OrderCtrl = new OrderCtrl();
})();
