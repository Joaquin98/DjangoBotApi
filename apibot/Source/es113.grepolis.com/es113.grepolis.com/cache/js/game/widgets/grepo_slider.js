/* global jQuery */

(function($) {
    "use strict";

    $.fn.grepoSlider = function(params) {
        var settings = $.extend({
            template: 'tpl_grepo_slider',
            min: 1,
            max: 10,
            step: 1,
            button_step: null,
            value: 0,
            disabled: false
        }, params);

        var $el = $(this), // Reference to the root node
            button_left,
            button_right,
            slider;

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var $tpl = /^</.test(settings.template) ? settings.template : $("#" + settings.template).html();

            // Append template to main container
            $el.html(us.template($tpl, settings));
        }

        function unbindEvents(destroy) {
            if (destroy) {
                $el.off('sl:change:value');
            }
        }

        this.setValue = function(value, props) {
            slider.setValue(value, props);

            return this;
        };

        this.getValue = function() {
            return slider.getValue();
        };

        this.setMax = function(value) {
            slider.setMax(value);

            return this;
        };

        this.getMax = function() {
            return slider.getMax();
        };

        this.disable = function() {
            button_left.disable();
            button_right.disable();
            slider.disable();

            return this;
        };

        this.enable = function() {
            button_left.enable();
            button_right.enable();
            slider.enable();

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindEvents(true);

            button_left.destroy();
            button_right.destroy();
            slider.destroy();
        };

        //Initialize
        (function() {
            loadTemplate();

            var disabled = settings.disabled;

            slider = $el.find('.js-slider').slider2({
                template: 'internal',
                min: settings.min,
                max: settings.max,
                step: settings.step,
                stepcount: settings.stepcount,
                stepsize: settings.stepsize ? settings.stepsize : 1,
                mouseValueChangeFunc: settings.mouseValueChangeFunc,
                value: settings.value,
                $parent: $el,
                disabled: disabled
            });

            button_left = $el.find('.js-button-left').button({
                template: 'empty',
                disabled: disabled
            }).on('btn:click', function() {
                if (settings.button_step) {
                    slider.setValue(slider.getValue() - settings.button_step);
                } else {
                    slider.stepDown();
                }
            });

            button_right = $el.find('.js-button-right').button({
                template: 'empty',
                disabled: disabled
            }).on('btn:click', function() {
                if (settings.button_step) {
                    slider.setValue(slider.getValue() + settings.button_step);
                } else {
                    slider.stepUp();
                }
            });
        }());

        return this;
    };
}(jQuery));