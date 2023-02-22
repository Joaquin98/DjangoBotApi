/*! jQuery requestAnimationFrame - v0.0.0 - 2012-08-31
 * https://github.com/gnarf37/jquery-requestAnimationFrame
 * Copyright (c) 2012 Corey Frang; Licensed MIT */

// The code was changed for grepolis and newer versions cannot be copied over easily!
// For some reason our minifier cannot correctly minify this file. That's why we have a custom minified file that has to be updated by hand!

(function($) {

    // requestAnimationFrame polyfill adapted from Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating


    /* This file does two things:
     * - using requestAnimationFrame for jquery animations
     * - creating a requestAnimationFrame fallback for browsers which do not have that functionality
     *
     * Reminder about how to add something to the jquery animation loop:
     * function doAnimationFrame() {
     *   doAnimationStuff();
     *   return hasAnotherFrame();
     * }
     * jQuery.fx.timer(doAnimationFrame);
     *
     * inside of a frame method it makes sense to access one or both of two global variables:
     * - window.animationFrameStartTimestamp, which holds the jQuery timestamp in the current frame (in milliseconds)
     * - window.animationFrameStartServerTime, which holds the current server time in seconds
     * those are cached thru out the whole frame to save performance and make it possible to sync animations
     */
    var animating,
        lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        requestAnimationFrame = window.requestAnimationFrame,
        cancelAnimationFrame = window.cancelAnimationFrame;

    for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
        requestAnimationFrame = window[vendors[lastTime] + "RequestAnimationFrame"];
        cancelAnimationFrame = cancelAnimationFrame ||
            window[vendors[lastTime] + "CancelAnimationFrame"] ||
            window[vendors[lastTime] + "CancelRequestAnimationFrame"];
    }

    function raf() {
        if (animating) {
            requestAnimationFrame(raf);
        }
        jQuery.fx.tick();
    }

    if (!requestAnimationFrame) { // to check, if requestAnimationFrame itself is a problem
        // polyfill
        requestAnimationFrame = window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime(),
                // 38 milliseconds equals roughly 26fps. Min is 5, because we do not have 100% CPU in animations
                timeToCall = Math.max(5, 38 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);

            lastTime = currTime + timeToCall;
            return id;
        };

        cancelAnimationFrame = window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    jQuery.fx.timer = function(timer) {
        if (timer() && jQuery.timers.push(timer) && !animating) {
            animating = true;
            raf();
        }
    };

    jQuery.fx.stop = function() {
        animating = false;
    };

}(jQuery));