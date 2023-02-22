/*global jQuery */

/**
 * A "Widget" which extends label component functionality. Used only with numbers.
 * Check the difference between current and previous value and animates the change.
 *
 * @param {Object} params
 *     {String} caption             text which label component will be initialized with
 *     {String} template            template which label component will be initialized with
 *     {Object} styles_increase     a hash array which styles which will be applied on the caption
 *									node when animation begins if value was increased
 *     {Object} styles_decrease     a hash array which styles which will be applied on the caption
 *									node when animation begins if value was decreased
 *	   {Object} styles_to_animate   a hash array which styles which will be animated
 *	   {Number} animation_duration  time in miliseconds which defines duration of the animation
 *	   {Boolean} center_hor         if the animation container will change it size, will be centered horizontaly
 *								    relativly to the origin label container
 *	   {Boolean} center_ver         if the animation container will change it size, will be centered verticaly
 *									relativly to the origin label container
 *	   {Object} relate_to           jquery object element which replaces 'body' as a parent the indicator will be appended to
 */

(function($) {
    "use strict";

    $.fn.buttonAnimator = function(params) {
        var settings = $.extend({
            template: '',
            caption: '',
            autorun: true,
            duration: 4000,
            type: 'metal_effect',
            disabled: false,
            state: false,
            toggle: false
        }, params);

        var _self = this,
            //Reference to the root node
            $el = $(this),
            $anim,
            button;

        var types = {
            metal_effect: {
                state: false,

                initialize: function() {
                    $anim.width($anim.width());
                    this._resetPosition();
                },

                run: function() {
                    var _self = this;

                    $anim.animate({
                        left: $anim.width()
                    }, {
                        duration: settings.duration,
                        complete: function() {
                            $anim.stop(true);
                            _self._resetPosition();
                            _self.run();
                        }
                    });
                },

                stop: function() {
                    $anim.stop(true);
                    $anim.css({
                        opacity: 0,
                        display: 'none'
                    });
                },

                _resetPosition: function() {
                    $anim.css({
                        left: -$anim.width()
                    });
                }
            }
        };

        this.startAnimation = function() {
            types[settings.type].run();
        };

        this.stopAnimation = function() {
            types[settings.type].stop();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            button.destroy();
        };

        //Initialize
        (function() {
            var conf = {
                caption: settings.caption,
                disabled: settings.disabled,
                state: settings.state,
                toggle: settings.toggle
            };

            if (settings.template) {
                conf.template = settings.template;
            }

            //Initialize button component
            button = $el.button(conf);

            $anim = $el.find('.js-effect');

            if (!$anim.length) {
                throw "Please specify .js-effect css class to indicate which element should receive special effect";
            }

            if (!types[settings.type]) {
                throw "Unknown effect type in buttonAnimator: " + settings.type;
            }

            //Initialize
            types[settings.type].initialize();

            if (settings.autorun) {
                types[settings.type].run();
            }
        }());

        return this;
    };
}(jQuery));