/* global define, Game */

/**
 * Scale UI for screens lower than the minimum resolution
 */
define('mobile/uiscale', function() {
    'use strict';

    var REFERENCE_X = 1024; // reference / minimum game resolution
    var REFERENCE_Y = 665;

    return {
        scaleUI: function() {
            var scale_factor = Game.isHybridApp() ?
                Math.min((window.innerWidth / REFERENCE_X), (window.innerHeight / REFERENCE_Y), 1.0) : 1;

            $("html").css({
                "transform-origin": "0 0",
                "transform": "scalex(" + scale_factor + ") scaley(" + scale_factor + ")"
            });

            Game.ui_scale = {
                factor: scale_factor,
                // Use this to recalculate the original size of an element before scaling
                normalize: {
                    factor: 1 / scale_factor
                }
            };

            $("body").css({
                "min-height": window.innerHeight * Game.ui_scale.normalize.factor + "px",
                "min-width": window.innerWidth * Game.ui_scale.normalize.factor + "px"
            });
        },

        setMapMoveContainerDimension: function() {
            var body = document.body;
            $('#map_move_container').css({
                "min-height": body.clientHeight + "px",
                "min-width": body.clientWidth + "px"
            });
        },

        addEventListeners: function() {
            window.addEventListener('resize', function() {
                this.scaleUI();
                this.setMapMoveContainerDimension();
            }.bind(this), true);
        }
    };
});