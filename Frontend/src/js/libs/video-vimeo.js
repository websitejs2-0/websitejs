/* globals Vimeo */

'use strict';

var asyncloader = require('./asyncloader');

/**
 * Vimeo video player interface module.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var VideoVimeo = function() {

    /**
     * Loads Vimeo API async.
     * @param {function} cb Callback function.
     */
    this.loadApi = function(cb) {
        // load video api and populate player object
        asyncloader.load('https://player.vimeo.com/api/player.js', function() {
            cb(Vimeo);
        });
    };

    /**
     * Initializes Vimeo video player.
     * @param {string} playerId Current player id.
     * @param {string} videoId Id of video to load.
     * @param {number} w Desired player width.
     * @param {number} h Desired player height.
     * @param {object} events Player events to trigger.
     * @returns {object} Vimeo Player object.
     */
    this.initPlayer = function(playerId, videoId, w, h, events) {
        var player = new Vimeo.Player(playerId, {
            width: w,
            height: h,
            id: videoId
        });

        player.on('loaded', function(e) {
            events.onPlayerReady({
                type: 'vimeo',
                videoId: videoId,
                playerId: playerId,
                event: e
            });
        });

        player.on('play', function(e) {
            events.onPlayVideo({
                type: 'vimeo',
                videoId: videoId,
                playerId: playerId,
                event: e
            });
        });

        player.on('pause', function(e) {
            events.onPauseVideo({
                type: 'vimeo',
                videoId: videoId,
                playerId: playerId,
                event: e
            });
        });

        player.on('ended', function(e) {
            events.onEndVideo({
                type: 'vimeo',
                videoId: videoId,
                playerId: playerId,
                event: e
            });
        });

        return player;
    };
};

module.exports = new VideoVimeo();