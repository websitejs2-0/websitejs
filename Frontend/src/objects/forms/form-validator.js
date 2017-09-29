'use strict';

var utils = require('../../js/libs/utils'),
    errorMessages = require('./form-validator-messages'),
    customValidations = require('./form-validator-validations');

/**
 * Form Validator class.
 * Validates forms by hooking into HTML5 validation.
 * Add custom validations by adding data atributes.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 0.5
 * 
 * @param {jqueryelement} $element Form to validate.  
 */
var FormValidator = function($element) {
    
    var _this = this;

    this.attrStart = 'data-val-';
    this.$form = $element;
    this.$submitButton = [];
    this.isFormValid = false;
    this.fieldsToValidate = [];

    /**
     * Initializes form validator.
     */
    this.init = function() {
        
        // add data attribute to form to prevent HTML5 validation
        this.$form.attr('novalidate', true);
        
        // set submitbutton
        this.$submitButton = this.$form.find('[type=submit]');
        
        // gather fields to validate
        // and update validation
        this.update();

        // handle submit
        this.$submitButton.on('click', function(e) {
            e.preventDefault();

            if (_this.validate()) {

                // do submit
                _this.$form.submit();

            } else {
                _this.$form.addClass('was-validated');
                _this.updateSubmitButton();
            }
        });

        // get collapsibles
        var collapsibleClass = this.$form.data('collapsible-class') || 'collapse';
        this.collapsibles = this.$form.find($('.' + collapsibleClass));
        this.collapsibles.on('shown.bs.collapse hidden.bs.collapse', function() {
            _this.update();
        });
        return this;
    };

    /**
     * Validates field.
     * @param {htmldomelement} field Field to validate.
     * @returns {boolean} True or false.
     */
    this.validateField = function(field) {
        
        var $feedback = $(field).parents('.form-group, .form-check').find('.has-feedback'),
            validatorAttributes = utils.getElementAttributes($(field), this.attrStart),
            msg = '',
            i;
        
        // first, do default HTML5 validation
        field.setCustomValidity('');
        field.checkValidity();

        if (typeof $(field).attr('requiredgroup') !== 'undefined') {
            
            // requiredgroup validation (needs to have a minimum of one item selected)
            var $groupFields = $(field).parents('.form-group').find('input'),
                isGroupValid = false;
            for (i = 0; i < $groupFields.length; i++) {
                if ($($groupFields[i]).is(':checked')) {
                    isGroupValid = true;
                    break;
                }
            }

            if (isGroupValid) {
                for (i = 0; i < $groupFields.length; i++) {
                    $groupFields[i].setCustomValidity('');
                }
            } else {
                msg = errorMessages.requireGroup || errorMessages.badInput;
                for (i = 0; i < $groupFields.length; i++) {
                    $groupFields[i].setCustomValidity(msg);
                }
            }

        } else if ($(field).val()) {
            
            // custom validations
            for (var attrName in validatorAttributes) {
                
                var aName = attrName.replace(this.attrStart, ''),
                    validation;
    
                // ignore messages
                if (aName.indexOf('-msg') === -1) {
                    validation = aName;
                    
                    // do custom validation, if exists
                    // if false; break the loop and show error
                    if (typeof customValidations[validation] !== 'undefined') {
                        if (!customValidations[validation]($(field), validatorAttributes[attrName])) {
                            // set custom validation
                            msg = $(field).attr(attrName + '-msg') || errorMessages.badInput;
                            field.setCustomValidity(msg);
                            break;  
                        } else {
                            // clear custom validation
                            field.setCustomValidity(''); 
                        }
                    }
                }
            }
        }

        if (field.validity.valid) {
            
            // field is valid
            $(field).closest('.form-group, .form-check').removeClass('has-danger');
            if ($feedback.length > 0) { $feedback.addClass('d-none'); }
        
        } else {
            for (var validationType in field.validity) {
                if (validationType !== 'valid' && field.validity[validationType] === true) {
                    
                    if (validationType !== 'customError') {
                        // create message
                        msg = errorMessages[validationType] || errorMessages.badInput;
                    }
                    
                    // set feedback
                    if ($feedback.length > 0) { 
                        $feedback.text(msg);
                        $feedback.removeClass('d-none');
                    }

                    // set danger style
                    $(field).closest('.form-group, .form-check').addClass('has-danger');
                }
            }
        }
        return field.validity.valid;
    };

    /**
     * Validates form.
     */
    this.validate = function() {

        var isValid = true;

        // get element nodes from form node
        for (var i = 0; i < this.fieldsToValidate.length; i++) {
            if (!this.validateField(this.fieldsToValidate[i])) {
                isValid = false;
                continue;
            }
        }

        return isValid;
    };

    /**
     * Updates fields to validate.
     */
    this.update = function() {
        
        var form = this.$form[0];
        this.fieldsToValidate = [];

        // get element nodes from form node
        for (var i = 0; i < form.elements.length; i++) {
            
            var field = form.elements[i];

            // ignore buttons, fieldsets, disabled, readonly and hidden etc.
            if ((field.nodeName !== 'INPUT' && field.nodeName !== 'TEXTAREA' && field.nodeName !== 'SELECT') || (field.disabled === true || field.readOnly === true || $(field).is(':hidden') === true)) {
                continue;
            }
            
            // add events
            $(field).off('change.validator keyup.validator blur.validator').on('change.validator keyup.validator blur.validator', this.updateField.bind(this));
            
            // add field to validation array
            this.fieldsToValidate.push(field);
        }

        this.updateSubmitButton();
    };

    /**
     * Field event update handler
     */
    this.updateField = function(e) {
        var field = e.target;
        this.validateField(field);
        this.updateSubmitButton();
    };

    /**
     * Updates disabled state of submit button.
     */
    this.updateSubmitButton = function() {
        var isValid = true;
        for (var i = 0; i < this.fieldsToValidate.length; i++) {
            if(!this.fieldsToValidate[i].validity.valid) {
                isValid = false;
                continue;
            }
        }

        if (!isValid) {
            this.$submitButton.addClass('disabled').prop('disabled', true);
        } else {
            this.$submitButton.removeClass('disabled').prop('disabled', false);
        }
    };

};

ComponentHandler.register({
    constructor: FormValidator,
    classAsString: 'FormValidator',
    cssClass: 'js-form-validator'
});