'use strict';

var video = {
    youtube: require('../../js/libs/video-youtube'),
    vimeo: require('../../js/libs/video-vimeo')
};

/**
 * Video Player class.
 * Instanciates a YouTube or Vimeo player and loads video.
 * @param {jqueryelement} $element Current video player node.  
 */
var VideoPlayer = function($element) {
    
    var _this = this;
    
    this.width = 0;
    this.height = 0;
    this.videoId = null;
        
    this.player = null;
    this.playerId = null;
    this.playerType = 'youtube';

    this.apiLoaded = false;

    /**
     * Initializes video component.
     */
    this.init = function() {
        
        var dimensions = this.getDimensions();
        this.setDimensions(dimensions.width, dimensions.height);

        // determine player type
        if ($element.data('type') && $element.data('type') === 'vimeo') {
            this.playerType = 'vimeo';
        }

        // init video object
        this.playerId = $element.find('.video__placeholder').attr('id');
        this.videoId = $element.data('videoid');
        
        // load video api
        video[this.playerType].loadApi(function() {
            _this.apiLoaded = true;
            _this.initPlayer();
        });
        
        return this;
    };
    
    /**
     * Initializes Player object
     */
    this.initPlayer = function() {
        this.player = video[this.playerType].initPlayer(this.playerId, this.videoId, this.width, this.height, {
            onPlayerReady: function(e) { _this.onPlayerReady(e); },
            onPlayVideo: function(e) { _this.onPlayVideo(e); },
            onPauseVideo: function(e) { _this.onPauseVideo(e); },
            onEndVideo: function(e) { _this.onEndVideo(e); }
        });
    };
    
    /**
     * Triggered when video player is loaded and ready.
     */
    this.onPlayerReady = function(e) {
        console.log('VIDEO READY', e);
    };

    /**
     * Triggered on play start of video.
     */
    this.onPlayVideo = function(e) {
        console.log('PLAY VIDEO', e);
    };

    /**
     * Triggered on pause start of video.
     */
    this.onPauseVideo = function(e) {
        console.log('VIDEO PAUSED', e);
    };

    /**
     * Triggered when video is ended (and is not looping).
     */
    this.onEndVideo = function(e) {
        console.log('VIDEO ENDED', e);
    };

    /**
     * Get current video viewport dimensions.
     * @returns {object} Object containing current width and height.
     */
    this.getDimensions = function() {
        return {
            width: $element.width(),
            height: $element.height()
        };
    };

    /**
     * Set video viewport dimensions.
     * @param {number} w New width.
     * @param {number} h New height.
     */
    this.setDimensions = function(w, h) {
        this.width = w;
        this.height = h;
    };
};

ComponentHandler.register({
    constructor: VideoPlayer,
    classAsString: 'VideoPlayer',
    cssClass: 'js-video-player'
});