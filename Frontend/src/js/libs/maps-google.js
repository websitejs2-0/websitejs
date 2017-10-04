/* globals google */

'use strict';

var _ = require('lodash'),
    asyncloader = require('./asyncloader');

/**
 * Google Maps v3 interface module.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var GoogleMaps = function() {

    var apiLoaded = false;

    window.googleMapsApiReady = function() {
        apiLoaded = true;
    }

    this.apiLanguage = 'nl';
    this.apiRegion = 'nl';
    this.apiTileLanguage = 'dut'; // not used
    this.apiKey = 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk';

    /**
     * Loads Google API async.
     * @param {function} cb Callback function.
     */
    this.loadApi = function(cb) {
        // load video api and populate player object
        asyncloader.load('https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&language=' + this.apiLanguage.toLowerCase() + '&region=' + this.apiRegion.toUpperCase() + '&callback=googleMapsApiReady', function() {
            var intervalId = setInterval(function() {
                if (apiLoaded) {
                    clearInterval(intervalId);
                    cb();
                }
            }, 100);
        });
    };

    /**
     * Initializes Map.
     * @param {string} mapId Current map container id.
     * @returns {object} Map object.
     */
    this.initMap = function(mapId, opts, events) {

        var options = $.extend({
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        }, opts);

        this.map = new google.maps.Map(document.getElementById(mapId), options);

        // events
        google.maps.event.addListenerOnce(this.map, 'idle', events.onReady);
        $(window).off('resize.gmaps').on('resize.gmaps', _.debounce(events.onResize, 200));

        return this.map;
    };

    /**
     * Sets center of the map.
     * @param {object|string} loc Coordinates object or location.
     * @param {float} loc.lat Latitude.
     * @param {float} loc.lng Longitude.
     * @param {booleam} [animation=false] Optional animation. Defaults to false. Currently ignored.
     */
    this.setCenter = function(loc, animation) {
        this.map.setCenter(loc);
    };

    /**
     * Sets zoom level of the map.
     * @param {number} level Zoom level.
     * @param {boolean} [animation=false] Optional animation. Defaults to false. Currently ignored.
     */
    this.setZoom = function(level, animation) {
        this.map.setZoom(level);
    };

    /**
     * Resizes the map viewport.
     */
    this.resize = function() {
        google.maps.event.trigger(this.map, 'resize');
    };

    return this;

};

module.exports = GoogleMaps;