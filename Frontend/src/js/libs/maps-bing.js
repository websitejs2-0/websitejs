/* globals Microsoft */

'use strict';

var _ = require('lodash'),
    asyncloader = require('./asyncloader');

/**
 * Bing Maps interface module.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var HereMaps = function() {

    var apiLoaded = false;

    window.bingMapsApiReady = function() {
        apiLoaded = true;
    };

    this.apiLanguage = 'nl';
    this.apiRegion = 'nl';
    this.apiTileLanguage = 'dut'; // not used
    this.apiKey = 'AvH49CYLq3cS1MArlOpxmOF04ivB6hE3milHY79ITHtnMcMa7rg2T-TW9BWPojgi';


    /**
     * Loads Google API async.
     * @param {function} cb Callback function.
     */
    this.loadApi = function(cb) {
        // load video api and populate player object
        asyncloader.load(['//www.bing.com/api/maps/mapcontrol?&setMkt=' + this.apiLanguage.toLowerCase() + '-' + this.apiRegion.toUpperCase() + '&setLang=' + this.apiLanguage.toLowerCase() + '&callback=bingMapsApiReady'], function() {
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

        this.map = new Microsoft.Maps.Map(document.getElementById(mapId), {
            credentials: this.apiKey,
            center: new Microsoft.Maps.Location(options.center.lat, options.center.lng),
            zoom: options.zoom
        });

        // events
        Microsoft.Maps.Events.addOne(this.map, 'viewchangestart', events.onReady);
        $(window).off('resize.bmaps').on('resize.bmaps', _.debounce(events.onResize, 200));

        return this.map;

    };

    /**
     * Sets center of the map.
     * @param {object|string} loc Coordinates object or location.
     * @param {float} loc.lat Latitude.
     * @param {float} loc.lng Longitude.
     * @param {booleam} [animation=false] Optional animation. Defaults to false.
     */
    this.setCenter = function(loc, animation) {
        var anim = false;
        if (typeof animation !== 'undefined' && animation === true) {
            anim = true;
        }
        this.map.setView({
            center: new Microsoft.Maps.Location(loc.lat, loc.lng)
        });
    };

    /**
     * Sets zoom level of the map.
     * @param {number} level Zoom level.
     * @param {boolean} [animation=false] Optional animation. Defaults to false.
     */
    this.setZoom = function(level, animation) {
        var anim = false;
        if (typeof animation !== 'undefined' && animation === true) {
            anim = true;
        }
        this.map.setView({
            zoom: level
        });
    };

    /**
     * Resizes the map viewport.
     */
    this.resize = function() {
        // not used
    };

    return this;

};

module.exports = HereMaps;