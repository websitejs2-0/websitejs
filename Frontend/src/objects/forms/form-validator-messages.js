'use strict';

/**
 * Form Validator default messages
 * Default HTML validity messages.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var FormValidatorMessages = {

    valueMissing: 'This field is required.',
    badInput: 'This value is not correct.',
    patternMismatch: 'This value is not valid.',
    rangeOverflow: 'This value exceeds the maximum value.',
    rangeUnderflow: 'This value is less that the minimum value.',
    stepMismatch: 'This value is not evenly divisible by the step value.',
    tooLong: 'This value is too long.',
    tooShort: 'This value is too short.',
    typeMismatch: 'This value is not correct.'
    
};

module.exports = FormValidatorMessages;