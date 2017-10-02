/* globals YT */

'use strict';

var asyncloader = require('./asyncloader');

/**
 * YouTube video player interface module.
 * @author Rocco Janse <rocco.janse@valtech.nl>
 * @version 1.0
 */
var VideoYouTube = function() {

    var apiLoaded = false;

    window.onYouTubeIframeAPIReady = function() {
        apiLoaded = true;
    };

    /**
     * Loads Youtube API async.
     * @param {function} cb Callback function.
     */
    this.loadApi = function(cb) {
        // load video api and populate player object
        asyncloader.load('https://www.youtube.com/iframe_api', function() {
            var intervalId = setInterval(function() {
                if (apiLoaded) {
                    clearInterval(intervalId);
                    cb(YT);
                }
            }, 100);
        });
    };

    /**
     * Initializes YouTube video player.
     * @param {string} playerId Current player id.
     * @param {string} videoId Id of video to load.
     * @param {number} w Desired player width.
     * @param {number} h Desired player height.
     * @param {object} events Player events to trigger.
     * @returns {object} YT Player object.
     */
    this.initPlayer = function(playerId, videoId, w, h, events) {
        var player = new YT.Player(playerId, {
            width: w,
            height: h,
            videoId: videoId,
            playerVars: {
                controls: 2,
                modestbranding: 0,
                rel: 0,
                showinfo: 0
            },
            events: {
                onReady: function(e) {
                    events.onPlayerReady({
                        type: 'youtube',
                        videoId: videoId,
                        playerId: playerId,
                        event: e
                    });
                },
                onStateChange: function(e) {
                    switch(e.data) {
                        case 0: {
                            events.onEndVideo({
                                type: 'youtube',
                                videoId: videoId,
                                playerId: playerId,
                                event: e
                            });
                            break;
                        }
                        case 1: {
                            events.onPlayVideo({
                                type: 'youtube',
                                videoId: videoId,
                                playerId: playerId,
                                event: e
                            });
                            break;
                        }
                        case 2: {
                            events.onPauseVideo({
                                type: 'youtube',
                                videoId: videoId,
                                playerId: playerId,
                                event: e
                            });
                            break;
                        }
                    }
                }
            }
        });
        return player;
    };

    return this;

};

module.exports = new VideoYouTube();
