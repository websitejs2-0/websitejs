/* globals OrderCtrl, confirm */

'use strict';

/**
 * TODO
 */
var OrderAmountCtrl = function($element) {

    /**
     * TODO
     */
    this.config = {
        maxAmount: 99,
    };

    /**
     * TODO
     */
    this.classNames = {
        inactive: 'inactive',
        btnAddToCart: 'amount-ctrl__add-to-cart',
        btnMin: 'amount-ctrl__min',
        btnPlus: 'amount-ctrl__plus',
        btnRemoveFromCart: 'amount-ctrl__remove-from-cart',
        input: 'amount-ctrl__input',
    };

    /**
     * TODO
     */
    this.elements = {
        $btnMin: $element.find('.' + this.classNames.btnMin),
        $btnPlus: $element.find('.' + this.classNames.btnPlus),
        $input: $element.find('.' + this.classNames.input),
        $btnAddToCart: $element.find('.' + this.classNames.btnAddToCart),
        $btnRemoveFromCart: $element.find('.' + this.classNames.btnRemoveFromCart),
    };

    /**
     * TODO
     */
    this.dataAttrs = {
        itemId: $element.attr('data-item-id'),
        itemTitle: $element.attr('data-item-title'),
        itemPrice: $element.attr('data-item-price'),
        isControllingOrder: $element.attr('data-is-controlling-order')
    }

    /**
     * TODO
     */
    this.createEvents = function() {

        var _this = this;

        // On click remove 1 value btn.
        _this.elements.$btnMin.click(function() {

            if( ! $(this).hasClass(_this.classNames.inactive) ) _this.updateAmount('--');

            _this.updateElements();

        });

        // On click add 1 value btn.
        _this.elements.$btnPlus.click(function() {

            if( ! $(this).hasClass(_this.classNames.inactive) ) _this.updateAmount('++');

            _this.updateElements();

        });

        // On change input field.
        _this.elements.$input.change(function() {

            _this.updateElements();

        });

        // On click add to cart btn.
        _this.elements.$btnAddToCart.click(function() {

            OrderCtrl.createItem({
                "amount": _this.elements.$input.val(),
                "id": _this.dataAttrs.itemId,
                "price": _this.dataAttrs.itemPrice,
                "title": _this.dataAttrs.itemTitle,
            });

        });

        // On click remove from cart btn.
        _this.elements.$btnRemoveFromCart.click(function() {

            if (confirm("Are you sure you want to remove this item from your cart?") == true)
                OrderCtrl.deleteItem(_this.dataAttrs.itemId);

        });

    };

    /**
     * TODO
     */
    this.init = function() {

        var _this = this;

        _this.createEvents();

        _this.updateElements();

    };

    /**
     * TODO
     */
    this.updateAmount = function(action) {

        var _this = this,
            $input = _this.elements.$input;

        if (action === '++') $input.val( + $input.val() + 1 );

        if (action === '--') $input.val( + $input.val() - 1 );

        _this.updateElements();

    };

    /**
     * TODO
     */
    this.updateElements = function() {

        var _this = this,
            $btnMin = _this.elements.$btnMin,
            $btnPlus = _this.elements.$btnPlus,
            $input = _this.elements.$input;

        if ($input.val() > _this.config.maxAmount) $input.val(_this.config.maxAmount);

        if ($input.val() < 1) $input.val(1);

        if ($input.val() < 2) $btnMin.attr('disabled', true);
        else $btnMin.attr('disabled', false);

        if ($input.val() == _this.config.maxAmount) $btnPlus.attr('disabled', true);
        else $btnPlus.attr('disabled', false);

        if (_this.dataAttrs.isControllingOrder)
            OrderCtrl.updateItemAmount('value', _this.dataAttrs.itemId, $input.val());

    };

};

ComponentHandler.register({
    constructor: OrderAmountCtrl,
    classAsString: 'OrderAmountCtrl',
    cssClass: 'js-order-amount-ctrl'
});
