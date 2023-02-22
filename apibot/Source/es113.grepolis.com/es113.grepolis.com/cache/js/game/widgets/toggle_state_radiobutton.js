/*globals jQuery */

(function($) {
    "use strict";

    $.fn.toggleStateRadiobutton = function(params) {
        var settings = $.extend({
            value: 0,
            disabled: false,
            template: 'tpl_radiobutton',
            options: [],
            exclusions: [],
            cid: {},
            state: false
        }, params);

        var _self = this,
            $el = $(this),
            radiobutton = null;

        function bindEvents() {
            $el.on('rb:change:value.toggleStateRadiobutton', function(e, value, old_value) {
                settings.state = false;

                $el.trigger('tsrb:change:value', [_self, value, old_value]);
            }).on('rb:doubleselect:value.toggleStateRadiobutton', function() {
                settings.state = !settings.state;

                $el.trigger('tsrb:change:state', [_self, settings.state]);
            });
        }

        function unbindEvents() {
            $el.off('.toggleStateRadiobutton');
            $el.off('tsrb:change:state');
        }

        /**
         * Sets value of the radiobutton
         *
         * @param {String|Number} value   value of currently selected option
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value, props) {
            radiobutton.setValue(value, props);

            return this;
        };

        /**
         * Returns value of the currently selected option in the radiobutton
         *
         * @return {String|Number}
         */
        this.getValue = function() {
            return radiobutton.getValue();
        };

        this.getState = function() {
            return settings.state;
        };

        /**
         * Disables radiobutton
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            radiobutton.disable();

            return this;
        };

        /**
         * Enables radiobutton
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            radiobutton.enable();

            return this;
        };

        /**
         * Allows to disable specific options in the radiobutton
         *
         * @param {Object} options   an array which contains the options values
         *
         * @return {Object}  jQuery Component Object
         */
        this.disableOptions = function(options) {
            radiobutton.disableOptions(options);

            return this;
        };

        /**
         * Allows to enable specific options in the radiobutton
         *
         * @param {Object} options   an array which contains the options values
         *
         * @return {Object}  jQuery Component Object
         */
        this.enableOptions = function(options) {
            radiobutton.enableOptions(options);

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            radiobutton.destroy();

            unbindEvents();
        };

        //Initialization
        (function() {
            radiobutton = $el.radiobutton(settings);

            bindEvents();
        }());

        return this;
    };
}(jQuery));