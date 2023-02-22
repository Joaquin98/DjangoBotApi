/*global jQuery, Game */

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

    $.fn.numberChangeIndicator = function(params) {
        var settings = $.extend({
            caption: 0,
            template: 'empty',

            styles_increase: {
                color: '#8dc63f',
                fontWeight: 'bold'
            },
            styles_decrease: {
                color: '#ef3100',
                fontWeight: 'bold'
            },
            styles_to_animate: {
                'fontSize': 30,
                'opacity': 0
            },

            animation_duration: 2000,
            animation_threshold: 0,

            relate_to: null,

            center_hor: true,
            center_ver: false
        }, params);

        var _self = this,
            //Reference to the root node
            $el = $(this),
            //Reference to the jQuery $caption node
            $caption,
            //Keeps label component instance
            label,
            //Keeps previous caption of the label component
            previous_value = 0;

        /**
         * Animates change
         *
         * @param {Object} styles   styles which are applied to the node which will be animated
         * @param {Number} value    the value which will be displayed in the animated container
         */
        function animateChange(styles, value) {
            var pos, $anim, width, height,
                $relate_to = settings.relate_to,
                $append_to = 'body',
                relative_to_pos;

            //Save the caption node
            $caption = label.getCaptionElement();

            //When caption is hidden, we can not calculate position
            if ($caption.css('display') === 'none') {
                $caption.show();
                pos = $caption.offset();
                $caption.hide();
            } else {
                pos = $caption.offset();
            }

            /**
             * Its used to prevent displaying animation over different windows or so
             */
            if ($relate_to) {
                relative_to_pos = $relate_to.offset();
                $append_to = $relate_to;

                pos = {
                    top: pos.top - relative_to_pos.top,
                    left: pos.left - relative_to_pos.left
                };
            }

            pos.left *= Game.ui_scale.normalize.factor;
            pos.top *= Game.ui_scale.normalize.factor;

            $anim = $caption.clone();
            $anim.html(value);

            //Append label which will be animated to the body, and set default properites
            $anim.appendTo($append_to).css($.extend({
                position: 'absolute',
                zIndex: '100000',
                top: pos.top + 'px',
                left: pos.left + 'px',
                width: $caption.width() + 'px'
            }, styles)).addClass($el[0].className + " label_animation").show();

            //Save the starting width and height to compare it later
            width = $anim.outerWidth(true);
            height = $anim.outerHeight(true);

            $anim.animate(settings.styles_to_animate, {
                step: function() {
                    //Center horizontaly
                    if (settings.center_hor) {
                        $anim.css({
                            marginLeft: (-1 * ($anim.outerWidth(true) - width) / 2) + 'px'
                        });
                    }

                    //Center verticaly
                    if (settings.center_ver) {
                        $anim.css({
                            marginTop: (-1 * ($anim.outerHeight(true) - height) / 2) + 'px'
                        });
                    }
                },
                duration: settings.animation_duration,
                complete: function() {
                    $anim.remove();
                }
            });
        }

        /**
         * Sets caption to the label component and animates difference between
         * 'value' and previous value stored in the label
         *
         * @param {Number} value   the value which have to be displayed in the label component
         *						   difference between it and the previous value will be animated
         *
         * @return {Object}  jQuery Component Object
         */
        this.setCaption = function(value) {
            var difference = value - previous_value;

            //Don't animate change if the difference is smaller than 'settings.animation_threshold'
            if (Math.abs(difference) >= settings.animation_threshold) {
                if (difference > 0) {
                    animateChange(settings.styles_increase, difference);
                } else if (difference < 0) {
                    animateChange(settings.styles_decrease, difference);
                }
            }

            label.setCaption(value);
            previous_value = value;

            return this;
        };

        this.animateIncrease = function(caption) {
            animateChange(settings.styles_increase, caption);

            label.setCaption(caption);
            previous_value = caption;

            return this;
        };

        /**
         * Returns caption from the label component
         */
        this.getCaption = function() {
            return label.getCaption();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            label.destroy();
            label = null;
        };

        //Initialize
        (function() {
            //Initialize label component
            label = $el.label({
                caption: settings.caption,
                template: settings.template
            });

            //Save previous value
            previous_value = settings.caption;
        }());

        return this;
    };
}(jQuery));