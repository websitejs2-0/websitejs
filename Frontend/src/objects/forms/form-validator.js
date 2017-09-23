'use strict';

/**
 * Form Validator class.
 * Validates forms.
 * @param {jqueryelement} $element Form to validate.  
 */
var FormValidator = function($element) {
    
    var _this = this;

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
        this.updateSubmitButton();
        
        // gather fields to validate
        // and update validation
        this.update();

        // handle submit
        this.$submitButton.on('click', function(e) {
            e.preventDefault();
            _this.validateFields();
            _this.validate();

            if (_this.isFormValid) {
                
                // do submit
                _this.$form.submit();

            } else {
                _this.$form.addClass('was-validated');
                _this.updateSubmitButton();
            }
        });

        return this;
    };
    
    /**
     * Validates all registered fields to validate.
     */
    this.validateFields = function() {
        for (var i = 0; i < this.fieldsToValidate.length; i++) {
            var field = this.fieldsToValidate[i];
            _this.validateField(field);
        }
    };

    /**
     * Validates field.
     * @param {htmldomelement} field Field to validate.
     * @returns {boolean} True or false.
     */
    this.validateField = function(field) {
        var ret = true;
        console.log(field);
        if (field.validity.valid) {
            ret = true;
        } else {
            for (var validationType in field.validity) {
                if (validationType !== 'valid' && field.validity[validationType] === true) {
                    console.log(validationType);
                    ret = false;
                }
            }
        }

        if (!ret) {
            $(field).closest('.form-group, .form-check').addClass('has-danger');
        } else {
            $(field).closest('.form-group, .form-check').removeClass('has-danger');
        }

        return ret;
    };

    /**
     * Validates form and updates submit button.
     */
    this.validate = function() {
        var isValid = true;
        for (var i = 0; i < this.fieldsToValidate.length; i++) {
            var field = this.fieldsToValidate[i];
            if (!field.validity.valid) {
                isValid = false;
            }
        } 
        this.isFormValid = isValid; 
        
        // update submitbutton
        this.updateSubmitButton();
    };

    /**
     * Updates fields to validate.
     */
    this.update = function() {
        
        this.fieldsToValidate = this.$form.find('[required]:enabled:visible:not(:hidden)');
        
        if (this.fieldsToValidate.length !== 0) {

            // add blur events to fields
            this.fieldsToValidate.off('change.validator blur.validator').on('change.validator blur.validator', function() {
                _this.validateField(this);
                _this.validate();
            });
            
        } else {

            // nothing to validate; form is valid
            this.isFormValid = true;
            
            // update submitbutton
            this.updateSubmitButton();
        } 
    };

    /**
     * Updates disabled state of submit button.
     */
    this.updateSubmitButton = function() {
        if (!this.isFormValid) {
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