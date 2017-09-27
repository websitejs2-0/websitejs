'use strict';

/**
 * Form Validator custom validations
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var CustomValidations = {

    /**
     * Checks if value of current field is equal to otherfield's value.
     * @param {jqueryelement} $field Current field.
     * @param {string} otherField CSS selector of other field.
     * @returns {boolean} true or false.
     */
    'equal': function($field, otherField) {
        return $field.val() === $(otherField).val();
    },

    /**
     * Checks if value is a valid phone number for various countries.
     * @param {jqueryelement} $field Current field.
     * @param {string} [countryCode=nl] Optional countrycode (nl).
     * @returns {boolean} true or false
     */
    'telephone': function($field, countryCode) {

        var bool = false,
            tel = null,
            mobile = null,
            code = countryCode || 'nl';

        switch(code) {
            default: {
                tel = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\+31|0|0031)[\s\-]?[1-9][0-9][-]?[1-9][0-9]{6}))$/;
                mobile = /^(((\+31|0|0031)[\s\-]?6){1}[1-9]{1}[0-9]{7})$/i;
                bool = (tel.test($field.val()) || mobile.test($field.val()));
                break;
            }
        }
        return bool;
    },

    /**
     * Checks if value is a valid zipcode for various countries.
     * @param {jqueryelement} $field Current field.
     * @param {string} [countryCode=nl] Optional countrycode (be/de/nl).
     * @returns {boolean} true or false
     */
    'zipcode': function($field, countryCode) {
        
        var bool = false,
            code = countryCode || 'nl';

        switch(code) {
            case 'be': {
                bool = (/^[1-9]{1}[0-9]{3}$/i.test($field.val())) ? false : true;
                break;
            }
            case 'de': {
                bool = (/^[1-9]{1}[0-9]{4}$/i.test($field.val())) ? false : true;
                break;
            }
            default: {
                bool = (/^[1-9]{1}[0-9]{3}[\s\-]?[a-zA-Z]{2}$/i.test($field.val())) ? true : false;
                break;
            }
        }
        return bool;
    },

    /**
     * Checks if value is a valid IBAN number.
     * @param {jqueryelement} $field Current field.
     * @returns {boolean} true or false
     */
    'iban': function($field) {
        return /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/i.test($field.val());
    }
    
};

module.exports = CustomValidations;