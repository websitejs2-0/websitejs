'use strict';

/**
 * Handles querystring operations
 * 
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.5
 * @class QueryStringHandler
 */
var QueryStringHandler = function() {

    /**
     * Updates current url without pagerefresh. Pushes current url to history,
     * so going back to previous url/state (ie. by browser's back button) is supported.
     * @param {string} params Querystring parameters to update url with.
     * @param {string} [hash] Optional hash to append to url.
     * @public
     */
    this.updateUrl = function(params, hash) {
        var url = window.location.origin + window.location.pathname;
        if (params.length > 0) {
            url += '?' + params;
        }
        if (typeof hash !== 'undefined' && hash.length > 0) {
            url += '#' + hash;
        } else {
            url += window.location.hash;
        }
        
        var stateObj = { url: url };
        history.pushState(stateObj, '', url);
    };

    /**
     * Combines two querystrings. Ie. new querystring and current querystring.
     * Updates and adds parameters.
     * @param {object|string} newParams New object with parameters as properties or new querystring string.
     * @param {object|string} [oldParams] Optional other objects or quersystring string. If omitted current querystring is used.
     * @returns {string} New querystring.
     */
    this.updateParams = function(newParams, oldParams) {
        var oParams; 
        if (typeof oldParams !== 'undefined') {
            if (typeof oldParams === 'object') {
                oParams = oldParams;
            } else {
                oParams = this.getParams(oldParams);
            }
        } else {
            oParams = this.getParams();
        }
        var nParams = (typeof newParams === 'object') ? newParams : this.getParams(newParams);
        var currentParams = $.extend(true, {}, oParams, nParams);
        return this.flattenParams(currentParams);
    };

    /**
     * Creates a querystring based on object properties and their corresponding values.
     * @param {object} paramsObj Object with parameters to be converted to querystring string.
     * @returns {string} Querystring parameters and values.
     */
    this.flattenParams = function(paramsObj) {
        var qsArray = [];
        for (var param in paramsObj) {
            var value;
            if (paramsObj[param].length > 0 || $.isNumeric(paramsObj[param]) === true) {
                if (Array.isArray(paramsObj[param])) {
                    value = paramsObj[param].join(',');
                } else {
                    value = paramsObj[param];
                }
                qsArray.push(param + '=' + value);
            }
        }
        return qsArray.join('&');
    };

    /**
     * Fetches given querystring or current querystring params and corresponding values.
     * @param {string} [queryString] Optional querystring to fetch parameters from.
     * @returns {object} Querystring parameters and values.
     */
    this.getParams = function(queryString) {

        var paramsObj = {},
            qs = (typeof queryString !== 'undefined') ? queryString.replace(/\?/g,'') : this.getQueryString(true),
            pairs = qs.split('&');

        $.each(pairs, function(i, pair) {
            var param, values;
            if (pair.indexOf('=') !== -1) {
                var paramValues = pair.split('=');
                param = paramValues[0];
                values = paramValues[1].split(',');
            } else {
                param = pair;
                values = [];
            }
            if (values.length > 1) {
                paramsObj[param] = values;
            } else if (values.length === 1) {
                paramsObj[param] = values[0];
            } else {
                paramsObj[param] = '';
            }   
        });

        return paramsObj;
    };

    /**
     * Fetches current querystring of window.location.
     * @param {boolean} [stripQuestionMark] If true strips '?' from beginning of querystring.
     * @returns {string} Querystring.
     */
    this.getQueryString = function(stripQuestionMark) {
        if (typeof stripQuestionMark !== 'undefined' && stripQuestionMark === true) {
            return window.location.search.replace(/\?/g,'');
        }
        return window.location.search;
    };

    /**
     * Fetches current hash of window.location.
     * @param {boolean} [stripHashtag] If true strips '#' from beginning of hash.
     * @returns {string} Hash.
     */
    this.getHash = function(stripHashtag) {
        if (typeof stripHashtag !== 'undefined' && stripHashtag === true) {
            return window.location.hash.replace(/\#/g,'');
        }
        return window.location.hash;
    };

    return this;
};

module.exports = new QueryStringHandler();