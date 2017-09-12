'use strict';

var AjaxCall = function() {

    var xhr = null;

    /**
     * Returns data object from request.
     * @param {object} options Options object.
     * @param {string} [options.type='GET'] Type of request (GET, POST, PUT, DELETE).
     * @param {string} options.url Url where API is located on.
     * @param {object} options.data Data to send to request url.
     * @param {string} [options.dataType='json'] Data type.
     * @param {string} [options.contentType='application/json; charset=utf-8'] Content type.
     * @param {function} [cb] Callback function.
     * @param {function} [fcb] Failed Callback function.
     */
    this.request = function(options, cb, fcb) {

        var config = $.extend({
            type: 'GET', 
            url: '', 
            data: {},
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        }, options);

        // cancel previous request, if there is one
        this.cancelRequest();

        xhr = $.ajax({
            type: config.type,
            url: config.url,
            data: config.data,
            dataType: config.dataType,
            contentType: config.contentType
        })
        .done(function(response) {
            xhr = null;
            if (typeof cb === 'function') {
                cb(response);
            }
        })
        .fail(function(d, textStatus, error) {

            xhr = null;

            // when filaed, but not aborted
            if (textStatus !== 'abort') {
                console.error("getJSON failed, status: " + textStatus + ", error: " + error);
                if (typeof fcb === 'function') {
                    fcb(error);
                }
            }
        });
    };

    /**
     * Cancels request to server.
     */
    this.cancelRequest = function() {
        if (xhr !== null) {
            xhr.abort();
            xhr = null;
        }
        return;
    };

    return this;
};

module.exports = new AjaxCall();