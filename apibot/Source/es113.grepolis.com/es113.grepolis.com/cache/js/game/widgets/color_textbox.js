/*globals jQuery */

/**
 * This widget is an extension of the textbox component. It adds possibility to indicate values inside it with "+/-" signs.
 * Developer can specify min and max range and also additional validate function to have an influence on the number in the textbox.
 *
 * {Number} min   determinayes the minimal value which user can put in the textbox
 * {Number} max	  determinayes the maximal value which user can put in the textbox
 * {Function} sanitize_function   advance-validate input number by inputting custom parse function
 */
(function($) {
    "use strict";

    $.fn.colorTextbox = function(params) {
        var settings = $.extend({
            min: 0,
            max: 0,
            sanitize_function: false
        }, params);

        var _self = this,
            $el = $(this);

        var textbox;

        /**
         * Validates value and returns correct result
         *
         * @param {Number} value
         *
         * @return {String}
         */
        function sanitize(value) {
            var max = settings.max,
                min = settings.min,
                sanitize_function = settings.sanitize_function;

            var new_val = parseInt(value, 10) || 0;

            new_val = Math.max(min, Math.min(max, new_val));

            if (sanitize_function && typeof sanitize_function === "function") {
                new_val = sanitize_function.call(this, new_val);
            }

            return new_val > 0 ? '+' + new_val : new_val;
        }

        this.setValue = function(value, silent) {
            textbox.setValue(sanitize(value), !!silent);
        };

        this.getValue = function() {
            return textbox.getValue();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            textbox.destroy();
        };

        //Initialize
        (function() {
            textbox = $el.textbox({
                type: 'text',
                value: 0,
                min: 0,
                max: 20,
                live: false,
                prevent_repeats: true,
                hidden_zero: false
            });

            textbox.on('txt:change:value', function(e, current_value) {
                var sanitized_value = sanitize(current_value);
                textbox.setValue(sanitized_value, {
                    silent: true
                });
                $el.trigger('ctxt:change:value', [sanitized_value, current_value, _self]);
            });

            textbox.on('txt:change:value', function(e, value) {
                textbox.toggleClass('negative', value < 0);
            });
        }());

        return this;
    };
}(jQuery));