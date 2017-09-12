'use strict';

/**
 * Loads scripts async
 *
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @class AsyncLoader
 * @version 1.5
 * @example
 *      AsyncLoader.load('http://www.libraryto.load', function() {
 *          // rest of async code
 *      });
 *      AsyncLoader.load(['http://www.libraryto.load', 'http://www.secondlibraryto.load'], function() {
 *          // rest of async code
 *      });
 */
var AsyncLoader = function() {

    this.createdElements = [];
    this.timeout = 200;

    /**
     * Load external files asychronously, based on file extension (js/css).
     * @param {string|array} urls Url or urls to load.
     * @param {function} [callback] Optional callback function.
     */
    this.load = function(urls, cb) {
        var _this = this,
            test = null,
            arrJS = [],
            arrCSS = [];

        if (typeof urls === 'string') {

            test = urls.substr(urls.lastIndexOf('.')+1);
            if (test === 'css') {
                this.loadStylesheet(urls, cb);
            } else {
                this.loadScript(urls, cb);
            }

        } else if (Array.isArray(urls)) {

            for(var i = 0; i < urls.length; i++) {

                test = urls[i].substr(urls[i].lastIndexOf('.')+1);
                
                if (test === 'css') {
                    arrCSS.push(urls[i]);
                } else {
                    arrJS.push(urls[i]);
                }
            }

            this.loadScript(arrJS, function() {
                _this.loadStylesheet(arrCSS, function() {
                    if (typeof cb === 'function') {
                        cb();
                    }
                });
            });
        }
    };

    /**
     * Loads a script, or an array of scripts asychronously and dependend.
     * @param {string|array} paramUrl Url or urls to load.
     * @param {function} [callback] Optional callback function.
     */
    this.loadScript = function(paramUrl, callback) {
        var _this = this;
        if (typeof paramUrl === 'string') {
            this.createElement('script', 'type', 'text/javascript', 'src', paramUrl, callback);
        } else if (Array.isArray(paramUrl) && paramUrl.length > 0) {
            var current = 0;
            // recursively load scripts untill all scripts are loaded
            var recursiveCreateElement = function(url) {
                _this.createElement('script', 'type', 'text/javascript', 'src', url, function() {
                    current++;
                    if (current <= paramUrl.length - 1) {
                        recursiveCreateElement(paramUrl[current]);
                    } else {
                        callback();
                    }
                });
            };
            recursiveCreateElement(paramUrl[current]);
        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }
    };

    /**
     * Loads a stylesheet, or an array of stylesheets asychronously and dependend.
     * @param {string} paramUrl Url or urls to load.
     * @param {function} [callback] Optional callback function.
     */
    this.loadStylesheet = function(paramUrl, callback) {
        var _this = this;
        if (typeof paramUrl === 'string') {
            this.createElement('link', 'rel', 'stylesheet', 'href', paramUrl, callback);
        } else if (Array.isArray(paramUrl) && paramUrl.length > 0) {
            var current = 0;
            // recursively load scripts untill all scripts are loaded
            var recursiveCreateElement = function(url) {
                _this.createElement('link', 'rel', 'stylesheet', 'href', url, function() {
                    current++;
                    if (current <= paramUrl.length - 1) {
                        recursiveCreateElement(paramUrl[current]);
                    } else {
                        callback();
                    }
                });
            };
            recursiveCreateElement(paramUrl[current]);
        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }
    };

    /**
     * Creates an element to load file.
     * @param {string} elementType Type of element container.
     * @param {string} fileTypeAttr Attribute for element to set type of file.
     * @param {string} fileType Type of file to load.
     * @param {string} fileUrlAttr Attribute for element used to load url.
     * @param {string} fileUrl Url of file to load.
     * @param {function} [callback] Optional callback function.
     */
    this.createElement = function(elementType, fileTypeAttr, fileType, fileUrlAttr, fileUrl, callback) {
        
        var _this = this,
            element = this.findElement(elementType, fileUrlAttr, fileUrl);

        // if element does not already exist, create new element
        if (!element) {
            element = document.createElement(elementType);
            element[fileTypeAttr] = fileType;
            if (elementType === 'script') {
                element.async = true;
            }
            document.body.appendChild(element);

            if (typeof callback === 'function') {
                element.addEventListener('load', function() {
                    _this.createdElements.push(fileUrl);
                    setTimeout(callback, _this.timeout);
                });
            }

            element[fileUrlAttr] = fileUrl;

        } else {

            // element exists, but is file loaded?
            if (this.createdElements.indexOf(fileUrl) === -1) {
                if (typeof callback === 'function') {
                    element[0].addEventListener('load', function() {
                        _this.createdElements.push(fileUrl);
                        setTimeout(callback, _this.timeout);
                    });
                }
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }
    };

    /**
     * Finds an element that already exists.
     * @param {string} elementType Type of element container.
     * @param {string} fileUrlAttr Attribute for element used to load url.
     * @param {string} fileUrl Url of file to load.
     * @returns {jqueryelement|boolean} jQuery Element when element already exists.
     */
    this.findElement = function(elementType, fileUrlAttr, fileUrl) {
        var elements = $(elementType);
        for (var i = 0; i < elements.length; i++) {
            if ($(elements[i]).attr(fileUrlAttr) === fileUrl) {
                return $(elements[i]);
            }
        }
        return false;
    };

    return this;
};

module.exports = new AsyncLoader();