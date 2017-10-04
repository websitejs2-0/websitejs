/* globals H */

'use strict';

var _ = require('lodash'),
    asyncloader = require('./asyncloader');

/**
 * Here Maps interface module.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var HereMaps = function() {

    var _this = this;

    var apiLoaded = false;

    this.appLanguage = 'nl';
    this.appRegion = 'nl';
    this.appTileLanguage = 'dut'; // see https://developer.here.com/documentation/map-tile/topics/resource-base-maptile.html#resource-base-maptile__param-lg
    this.appId = 'PA5BWpI7imMUv5p6FKmT';
    this.appCode = 'WlAAxVsKrUCYYX8CdqrtZQ';
    
    this.platform = null;

    /**
     * Loads Google API async.
     * @param {function} cb Callback function.
     */
    this.loadApi = function(cb) {
        // load video api and populate player object
        asyncloader.load([
            'http://js.api.here.com/v3/3.0/mapsjs-core.js', 
            'http://js.api.here.com/v3/3.0/mapsjs-service.js',
            'http://js.api.here.com/v3/3.0/mapsjs-ui.js',
            'http://js.api.here.com/v3/3.0/mapsjs-mapevents.js'
        ], function() {
            apiLoaded = true;
            cb();
        });
    };

    /**
     * Initializes Map.
     * @param {string} mapId Current map container id.
     * @returns {object} Map object.
     */
    this.initMap = function(mapId, opts, events) {
    

        this.platform = new H.service.Platform({
            'app_id': this.appId,
            'app_code': this.appCode
        });

        // options
        var options = $.extend({
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        }, opts);
        
        // Obtain the default map types from the platform object
        var maptypes = this.platform.createDefaultLayers();
    
        // Instantiate (and display) a map object:
        this.map = new H.Map(
            document.getElementById(mapId),
            maptypes.normal.map,
            options);

        // create base tile layer
        var mapTileService = this.platform.getMapTileService({
            type: 'base'
        });
        // localised map tiles based on base layer
        this.map.setBaseLayer(mapTileService.createTileLayer('maptile', 'normal.day', 256, 'png8', { lg: this.appTileLanguage.toUpperCase() }));

        // Create the default UI and localisation:
        this.ui = H.ui.UI.createDefault(this.map, maptypes, this.appLanguage.toLowerCase() + '-' + this.appRegion.toUpperCase());

        // Add map events functionality to the map
        var mapEvents = new H.mapevents.MapEvents(this.map);

        // Add behavior to the map: panning, zooming, dragging.
        var behavior = new H.mapevents.Behavior(mapEvents);

        // events
        this.map.addEventListener('mapviewchange', function onReady() {
            events.onReady();
            _this.map.removeEventListener('mapviewchange', onReady);
        });
        $(window).off('resize.hmaps').on('resize.hmaps', _.debounce(events.onResize, 200));
        //this.viewport.addEventListener('update', function() { console.log('RESIZED VIEWPORT'); });

        // hide loader
        $('.loader').hide();

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
        this.map.setCenter(loc, anim);
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
        this.map.setZoom(level, anim);
    };

    /**
     * Resizes the map viewport.
     */
    this.resize = function() {
        this.map.getViewPort().resize();
    };

    return this;

};

module.exports = HereMaps;