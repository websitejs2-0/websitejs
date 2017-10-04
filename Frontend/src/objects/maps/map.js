'use strict';

var _ = require('lodash'),
    maps = {
    google: require('../../js/libs/maps-google'),
    bing: require('../../js/libs/maps-bing'),
    here: require('../../js/libs/maps-here')
};

/**
 * Map class.
 * Instanciates a Maps on pages.
 * @param {jqueryelement} $element Current map node.  
 */
var Map = function($element) {
    
    var _this = this;
    
    this.width = 0;
    this.height = 0;
    this.map = null;
    this.mapId = null;    
    this.mapType = 'google';
    this.apiLoaded = false;
    
    this.mapCenter = {lat: 52.214, lng: 5.361};
    this.mapZoom = 7;

    /**
     * Initializes video component.
     */
    this.init = function() {
        
        var dimensions = this.getDimensions();
        this.setDimensions(dimensions.width, dimensions.height);

        // determine player type
        if ($element.data('type')) {
            if (typeof maps[$element.data('type')] === 'undefined') {
                console.error('%s is not interfaced and cannot be loaded.', $element.data('type'));
            } else {
                this.mapType = $element.data('type');
            }
        }

        // init map object id
        this.mapId = $element.find('.map__placeholder').attr('id');
        
        // interface maps api
        this.map = new maps[this.mapType]();

        // load api
        this.map.loadApi(function() {
            _this.apiLoaded = true;
            _this.initMap();
        });
        
        return this;
    };
    
    /**
     * Initializes Map object
     */
    this.initMap = function() {

        this.map.initMap(this.mapId, {
            dimensions: this.getDimensions(),
            center: this.mapCenter,
            zoom: this.mapZoom
        }, {
            onReady: function() { _this.onReady(); },
            onResize: function() { _this.onResize(); }
        });
        

        // this.player = video[this.playerType].initPlayer(this.playerId, this.videoId, this.width, this.height, {
        //     onPlayerReady: function(e) { _this.onPlayerReady(e); },
        //     onPlayVideo: function(e) { _this.onPlayVideo(e); },
        //     onPauseVideo: function(e) { _this.onPauseVideo(e); },
        //     onEndVideo: function(e) { _this.onEndVideo(e); }
        // });
    };
    
    /**
     * Resizes the map.
     */
    this.onResize = function() {
        var dimensions = this.getDimensions();
        this.setDimensions(dimensions.width, dimensions.height);
        this.map.resize();
        this.map.setCenter(this.mapCenter);
        this.map.setZoom(this.mapZoom);
    };

    /**
     * Triggered when map is loaded and ready.
     */
    this.onReady = function() {
        console.log('%s map %s is ready.', this.mapType, this.mapId);
    };

    /**
     * Get current map viewport dimensions.
     * @returns {object} Object containing current width and height.
     */
    this.getDimensions = function() {
        return {
            width: $element.width(),
            height: $element.height()
        };
    };

    /**
     * Set map viewport dimensions.
     * @param {number} w New width.
     * @param {number} h New height.
     */
    this.setDimensions = function(w, h) {
        this.width = w;
        this.height = h;
    };
};

ComponentHandler.register({
    constructor: Map,
    classAsString: 'Map',
    cssClass: 'js-map'
});