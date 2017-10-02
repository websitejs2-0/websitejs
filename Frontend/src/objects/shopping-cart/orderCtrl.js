'use strict';

var Cookies = require('js-cookie');

(function() {

    /**
     * TODO
     */
    var OrderCtrl = function() {

        /**
         * TODO
         */
        this.cookieConfig = {
            name: 'order',
            expires: 1
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
         * TODO
         */
        this.create = function() {

            this.order = {};

            this.createItem({
                "amount": 2,
                "id": "0001",
                "price": 2.5,
                "title": "Item 1",
            });

            this.createItem({
                "amount": 1,
                "id": "0002",
                "price": 4,
                "title": "Item 2",
            });

            this.update();

        };

        /**
         * Adds a given item to the order object.
         * @param {object} item - Item to add.
         * @public
         */
        this.createItem = function(item) {

            var _this = this;

            item.price = parseFloat(item.price);
            item.amount = parseInt(item.amount);

            if (!$.isEmptyObject(_this.order.items)) {
                for (var i = 0; i < _this.order.items.length; i++)
                if (_this.order.items[i].id === item.id) {
                    _this.order.items[i].amount += item.amount;
                    _this.updateCartElements();
                    _this.update();
                    return;
                }
            }

            _this.order.items.push(item);
            _this.updateCartElements();
            _this.update();
        };

        /**
         * TODO
         */
        this.delete = function() {

            Cookies.remove(this.cookieConfig.name);

        };

        /**
         * Remove an item from the order object with given id.
         * @param {string} id - Item id to remove.
         * @public
         */
        this.deleteItem = function(id) {

            var _this = this;

            for (var i = 0; i < _this.order.items.length; i++)
                if (_this.order.items[i].id === id) {
                    _this.order.items.splice(i, 1);
                }

            _this.updateCartElements();
            _this.update();
        };

        /**
         * TODO
         */
        this.read = function() {

            return Cookies.getJSON(this.cookieConfig.name);

        };

        /**
         * Save order in a cookie (or overwriting existing cookie).
         * @public
         */
        this.save = function() {

            Cookies.set(this.cookieConfig.name, this.order, { expires: 1 });

        };

        /**
         * Stringify a price to a (business logic) stringfied format.
         * Add two trailing zeros: "9.9" to "9.90" and "9" to "9.00"
         * Replace dot with comma like: "9.99" to "9,99"
         * @param {number} price - Price to reformat.
         * @return {string} Stringified price.
         * @public
         */
        this.stringifyPrice = function(price) {

            return Number(Math.round(price + 'e2') + 'e-2').toFixed(2).replace('.', ',');

        };

        /**
         * Update the order object calculated values and reformat required number values for view.
         * Method updates all instances of ShoppingCart in view as well.
         * @param {object} order - Order object to update.
         * @public
         */
        this.update = function() {

            var _this = this,
                totalAmount = 0;

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
         * Update item amount with given id.
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
         * TODO
         */
        this.updateCartElements = function() {
            var $elements = $('.js-shopping-cart').find('.js-order-amount-ctrl');
            for (var i = 0; i < $elements.length; i++) {
                $($elements[i]).removeAttr('data-upgraded');
                ComponentHandler.upgradeElement($($elements[i]), 'OrderAmountCtrl');
            }
        };

        /**
         * TODO
         */
        this.order = this.read();

        return this;
    };

    window.OrderCtrl = new OrderCtrl();
})();
