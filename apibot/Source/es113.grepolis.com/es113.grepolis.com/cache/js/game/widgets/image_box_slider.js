/*global jQuery */

/**
 * This is boxed slider component with button and an additional icon at the left.
 * This is used for example inside the barracks or the hide.
 *
 * @param params
 *     {String} template      the id (without #) of template which is already
 *							  in the document between
 *							  <script type="text/template" id="..." /> tag
 *							  or string which contains template
 *	   {Boolean} disabled     determinate if events will be fired or not,
 *							  for example, when button is disabled, the code in
 *							  onclick handler won't be fired
 *	   {Number} min           determinate minimal value which can be set in slider
 *	   {Number} max           determinate maximal value which can be set in slider
 *     {Number} value         determinate current value which is indicated by slider
 *     {Number} step          determinate value steps, for example if min = 0, max = 10, step = 2, then
 *                            user will be able to set only following values:
 *                            0, 2, 4, 6, 8, 10
 *     {Boolean} snap         determinate if slider have to point exact values (user have a feeling of jumps during sliding)
 *     {String} icon_type     additional class for the icon, e.g. spy
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - ibsl:change:value      fired when value of the slider has changed
 * - ibsl:click              fired when the action button is clicked
 *
 * ------------------
 * Example 1:
 * ------------------
 *
 *  slider = controller.registerComponent('slider_with_box_and_image', $el.find('some_matcher').imageBoxSlider({
 *	    max: 10000,
 *	    min: 150,
 *	    step : 1,
 *	    value : 75,
 *	    snap: true,
 *	    disabled: false
 *  }).on('ibsl:change:value', function(e, _sl, value) {
 *
 *  }).on('ibsl:click', function() {
 *
 *  }), 'sub_context');
 */
(function($, us) {
    "use strict";

    $.fn.imageBoxSlider = function(params) {

        var settings = $.extend({
                template: 'tpl_image_box_slider',
                min: 1,
                max: 10,
                step: 1,
                button_step: null,
                value: 0,
                snap: true,
                disabled: false,
                icon_type: 'spy'
            }, params),
            $el = $(this),
            slider,
            order_input,
            min_button,
            max_button,
            action_button;

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var $tpl = /^</.test(settings.template) ?
                settings.template :
                $("#" + settings.template).html();

            $el.html(us.template($tpl, settings));
        }

        /**
         * Get value from slider
         *
         * @return {Number}
         */
        this.getValue = function() {
            return slider.getValue();
        };

        /**
         * set the value
         *
         * @param {Number} value
         * @param {Object} props
         * @return {void}
         */
        this.setValue = function(value, props) {
            slider.setValue(value, props);
        };

        /**
         * Set max value for slider and max button
         *
         * @param {Number} value
         * @return {$.fn.imageBoxSlider}
         */
        this.setMax = function(value) {
            settings.max = value;
            slider.setMax(value);
            max_button.setCaption("" + value);
            return this;
        };

        /**
         * Enable internal components
         *
         * @return {$.fn.imageBoxSlider}
         */
        this.enable = function() {
            slider.enable();
            order_input.enable();
            min_button.enable();
            max_button.enable();
            action_button.enable();

            return this;
        };

        /**
         * Disable internal components
         *
         * @return {$.fn.imageBoxSlider}
         */
        this.disable = function() {
            slider.disable();
            order_input.disable();
            min_button.disable();
            max_button.disable();
            action_button.disable();

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         *
         * @return {void}
         */
        this.destroy = function() {
            $el.off('ibsl:change:value');
            $el.off('ibsl:click');
        };

        /**
         * Create slider component
         *
         * @param {String} match
         * @param {Function} callback upon value change
         * @returns {$.fn.grepoSlider}
         */
        function createSlider(match, callback) {
            return $el.find(match).grepoSlider({
                max: settings.max,
                min: settings.min,
                step: settings.step,
                button_step: settings.button_step,
                value: settings.value,
                snap: settings.snap,
                disabled: settings.disabled
            }).on('sl:change:value', callback);
        }

        /**
         * Create slider component
         *
         * @param {String} match
         * @param {Function} callback upon value change
         * @returns {$.fn.grepoSlider}
         */
        function createOrderInput(match, callback) {
            return $el.find(match).textbox({
                value: settings.value,
                disabled: settings.disabled
            }).on('txt:change:value', callback);
        }

        /**
         * Create action button component
         *
         * @param {String} match
         * @param {Function} callback upon click
         * @returns {$.fn.button}
         */
        function createActionButton(match, callback) {
            return $el.find(match).button({
                disabled: settings.disabled
            }).on('btn:click', callback);
        }

        /**
         * Create min button component
         *
         * @param {String} match
         * @param {String} caption
         * @param {Function} callback upon click
         * @returns {$.fn.button}
         */
        function createButton(match, caption, callback) {
            return $el.find(match).button({
                caption: caption,
                disabled: settings.disabled
            }).on('btn:click', callback);
        }

        //Initialize
        (function() {
            loadTemplate();

            slider = createSlider('.image_box_slider .inner_slider', function(e, _sl, value, old_value) {
                order_input.setValue(value, {
                    silent: true
                });
                $el.trigger('ibsl:change:value', [_sl, value, old_value]);
            });

            order_input = createOrderInput('.image_box_slider .order_input', function(e, new_val) {
                slider.setValue(parseInt(new_val, 10), {
                    silent: true
                });
            });

            action_button = createActionButton('.image_box_slider .order_confirm', function() {
                $el.trigger('ibsl:click');
            });

            min_button = createButton('.image_box_slider .order_min', "" + settings.min, function() {
                order_input.setValue(settings.min);
                slider.setValue(settings.min);
            });

            max_button = createButton('.image_box_slider .order_max', "" + settings.max, function() {
                order_input.setValue(settings.max);
                slider.setValue(settings.max);
            });
        }());

        return this;
    };
}(jQuery, us));