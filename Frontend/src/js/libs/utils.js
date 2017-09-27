var Utils = {
    
    /**
     * Returns element attributes where name starts with string.
     * @param {jqueryelement} $el Element to get attributes from.
     * @param {string} [str] String of date to format.
     * @returns {array} Array of attributes found.
     */
    getElementAttributes: function($el, str) {
        var attrs = {};
        $.each($el[0].attributes, function(i, attribute) {
            if (str) {
                if (attribute.name.indexOf(str) === 0) {
                    attrs[attribute.name] = attribute.value;
                }
            } else {
                attrs[attribute.name] = attribute.value;
            }
        });
        return attrs;
    }
};

module.exports = Utils;