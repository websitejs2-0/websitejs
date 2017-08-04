var dateFormatter = {

    /**
     * Formats date to output local timezone date.
     * E.g: Wed, 02 Aug 2017 11:16:48 GMT(+2)
     * @param {string} dateStr String of date to format.
     */
    localTimezone: function(dateStr) {
        var d = new Date(dateStr),
            tz = (d.getTimezoneOffset() / 60) * - 1;
        
        d.setHours(d.getHours() + tz);
        if (tz >= 0) { 
            tz = '+' + tz;
        } else {
            tz = '-' + tz;
        }

        return d.toUTCString() + ' (' + tz + ')';
    }
};

module.exports = dateFormatter;