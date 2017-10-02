/* globals OrderCtrl, confirm */

'use strict';

/**
 * Order amount controller class.
 * @param {jqueryelement} $element Current js-order-amount-ctrl node.
 * @author Peter Bust <peter.bust@valtech.nl>
 */
var OrderAmountCtrl = function($element) {

    /**
     * Configurable options
     */
    this.config = {
        maxAmount: 99
    };

    /**
     * Required class names.
     */
    this.classNames = {
        btnAddToCart: 'amount-ctrl__add-to-cart',
        btnMin: 'amount-ctrl__min',
        btnPlus: 'amount-ctrl__plus',
        btnRemoveFromCart: 'amount-ctrl__remove-from-cart',
        inactive: 'inactive',
        input: 'amount-ctrl__input'
    };

    /**
     * Required dom elements.
     */
    this.elements = {
        $btnAddToCart: $element.find('.' + this.classNames.btnAddToCart),
        $btnMin: $element.find('.' + this.classNames.btnMin),
        $btnPlus: $element.find('.' + this.classNames.btnPlus),
        $btnRemoveFromCart: $element.find('.' + this.classNames.btnRemoveFromCart),
        $input: $element.find('.' + this.classNames.input)
    };

    /**
     * Required data attributes.
     */
    this.dataAttrs = {
        isControllingOrder: $element.attr('data-is-controlling-order'),
        itemId: $element.attr('data-item-id'),
        itemPrice: $element.attr('data-item-price'),
        itemTitle: $element.attr('data-item-title')
    };

    /**
     * Initializes js-order-amount-ctrl component.
     * @public
     */
    this.init = function() {
        this.setEvents();
        this.updateElements();
    };

    /**
     * Set custom event handlers for user interaction.
     * @public
     */
    this.setEvents = function() {
        var _this = this;

        _this.elements.$btnMin.unbind().click(function() {
            if (!$(this).hasClass(_this.classNames.inactive)) _this.updateAmount('--');
            _this.updateElements();
        });

        _this.elements.$btnPlus.unbind().click(function() {
            if(!$(this).hasClass(_this.classNames.inactive)) _this.updateAmount('++');
            _this.updateElements();
        });

        _this.elements.$input.unbind().change(function() {
            _this.updateElements();
        });

        _this.elements.$btnAddToCart.unbind().click(function() {
            OrderCtrl.createItem({
                "amount": _this.elements.$input.val(),
                "id": _this.dataAttrs.itemId,
                "price": _this.dataAttrs.itemPrice,
                "title": _this.dataAttrs.itemTitle,
            });
        });

        _this.elements.$btnRemoveFromCart.unbind().click(function() {
            if (confirm("Are you sure you want to remove this item from your cart?") == true)
                OrderCtrl.deleteItem(_this.dataAttrs.itemId);
        });

    };

    /**
     * Updates the input amount by requested action.
     * @param {string} action Requested action.
     * @public
     */
    this.updateAmount = function(action) {
        var _this = this,
            $input = _this.elements.$input;

        if (action === '++') $input.val( + $input.val() + 1 );

        if (action === '--') $input.val( + $input.val() - 1 );

        _this.updateElements();
    };

    /**
     * Checks all states of elements dependent by user input.
     * @public
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

        if (_this.dataAttrs.isControllingOrder) OrderCtrl.updateItemAmount('value', _this.dataAttrs.itemId, $input.val());
    };

};

ComponentHandler.register({
    constructor: OrderAmountCtrl,
    classAsString: 'OrderAmountCtrl',
    cssClass: 'js-order-amount-ctrl'
});
