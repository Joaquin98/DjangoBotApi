/*global jQuery */

/**
 * Ratio progressbar is a progressbar which can be divied to smaller parts,
 * which represents its own 'enviroments'. Consider this example:
 *
 * Our progress bar indicates 'points' between 0 and 500, we decided to split
 * progress to 3 parts. First part will take 1 unit, and last two will take 0.5
 * unit. We assigned 100 'points' to first part, and 200 'points' to last two
 * parts. What will be the result ? If the current value will be set to 100, then
 * progressbar will indicate 50%, if to 300 will indicate 75%;
 *
 */

(function($) {
    "use strict";

    $.fn.ratioProgressbar = function(params) {
        var settings = $.extend({
            //Currently indicated value
            value: 0,
            _previous_value: 0,
            //Parts definition
            parts: [
                /*{size : 90, points : 100},
                {size : 100, points : 200}*/
            ],
            animate: true,
            animation_duration: 2000,
            template: 'tpl_pb_single',
            tooltips: {}
        }, params);

        var _self = this,
            //Reference to the root node
            $el = $(this),
            //Progressbar component object
            progressbar,
            //Maximal value in the progressbar
            max,
            //Total size of progress
            total_size;

        /**
         * Calculates missing values like:
         * - maximal value which can be indicated on the progressbar
         * - total size of all parts
         */
        function calculateProperties() {
            var parts = settings.parts,
                part, i, l = parts.length,
                w_min = Infinity,
                w_max = 0,
                points = 0,
                size = 0;

            for (i = 0; i < l; i++) {
                part = parts[i];
                points += part.points;
                size += part.size;
            }

            max = points;
            total_size = size;
        }

        /**
         * Calculates amount which represents progress depends on the value
         * given as an argument.
         *
         * @param {Number} value
         *
         * @return {Number}
         */
        function calculateValue(value) {
            var parts = settings.parts,
                part, i, l = parts.length,
                new_value = 0,
                //Indicates the proportion of the part.points to the points which are in this part
                value_proportion,
                //Indicates size proportion of the part and total progress
                part_proportion;

            for (i = 0; i < l; i++) {
                part = parts[i];

                if (value - part.points >= 0) {
                    value_proportion = 1;
                    value -= part.points;
                } else {
                    value_proportion = value / part.points;
                    value = 0;
                }

                part_proportion = part.size / total_size;

                new_value += max * part_proportion * value_proportion;
            }

            return new_value;
        }

        /**
         * Sets value to the progressbar
         *
         * @param {Number} value   value which have to be indicated on the progressbar
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value) {
            settings._previous_value = settings.value;
            settings.value = value;

            progressbar.setValue(calculateValue(value));

            return this;
        };

        this.getValue = function() {
            return settings.value;
        };

        this.getPreviousValue = function() {
            return settings._previous_value;
        };

        this.setAnimate = function(value) {
            settings.animate = value;

            progressbar.setAnimate(value);

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            progressbar.destroy();
            progressbar = null;
        };

        //Initialize
        (function() {
            calculateProperties();

            //Initialize label component
            progressbar = $el.singleProgressbar({
                value: calculateValue(settings.value),
                max: max,
                template: settings.template,
                type: 'integer',
                animate: settings.animate,
                animate_settings: {
                    duration: settings.animation_duration
                },
                tooltips: settings.tooltips
            });
        }());

        return this;
    };
}(jQuery));