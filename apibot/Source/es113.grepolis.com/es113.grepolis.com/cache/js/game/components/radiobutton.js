/*global jQuery, MousePopup */

/**
 * This components simulates the HTML native input[type="radio"]
 *
 * @param params
 *    {String} value       value of the option which should be selected as default
 *    {Boolean} disabled   determinates if user can select some value or not
 *    {String} template    the id (without #) of template which is already
 *                         in the document between <script type="text/template" id="..." /> tag
 *                         or string which contains template
 *    {Object} options     an array with options [{value : 1, name : 'Option 1', tooltip : 'Something'}]
 *    {String} cid         helps to determinate the button, its something like
 *                         vitrual id, or you can store there some informtaions
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - rb:change:value   fired when radiobutton value has changed
 *
 * ------------------
 * Example:
 * ------------------
 *
 * It's a radiobutton which was invented originally to keep informations about the Grepolympia Disciplines (HR, A, JT, CR).
 * For instance when current discipline is Archery, radiobutton is configured to block further disciples,
 * but enables only the current one and previous ones
 *
 * CM.register(context, 'radiobutton_name', 'rbtn_select_discipline', $el.find(".rbtn_select_discipline").radiobutton({
 *     value : 'hoplite_race', template : 'tpl_radiobutton_nocaption', options : [
 *         {value : 'hoplite_race', tooltip : 'Tooltip 1'},
 *         {value : 'archery', tooltip : 'Tooltip 2'},
 *         {value : 'javelin_throwing', tooltip : 'Tooltip 3'},
 *         {value : 'chariot_race', tooltip : 'Tooltip 4'}
 *     ],
 *     exclusions : current_discipline_index > -1 ? disciplines.splice(current_discipline_index + 1, disciplines.length - 1 - current_discipline_index) : []
 * }).on('rb:change:value', function(e, value, old_value) {
 *     //Fetch ranking page
 *     model_ranking.fetchPage(rbtn_player_alliance.getValue(), value);
 * }));
 *
 */
(function($) {
    'use strict';

    $.fn.radiobutton = function(params) {
        var settings = $.extend({
            value: 0,
            disabled: false,
            template: 'tpl_radiobutton',
            options: [],
            exclusions: [],
            css_classes: {

            },
            cid: {}
        }, params);

        var _self = this,
            $el = $(this),
            $tpl;

        //Keeps objects of all tooltips
        var tooltip_objects = [];

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.radiobutton');

            if (destroy) {
                $el.off('rb:change:value');
                $el.off('rb:doubleselect:value');

                //Destroy tooltips
                var l = tooltip_objects.length;

                while (l--) {
                    tooltip_objects[l].destroy();
                }
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.radiobutton', '.option', function(e) {
                if (settings.disabled) {
                    return;
                }

                var $target = $(e.currentTarget),
                    value = $target.attr('name');

                if ($target.hasClass('option') && !$target.hasClass('disabled')) {
                    //Set new value
                    _self.setValue(value);
                }
            });

            $el.on('mousedown.radiobutton', '.option', function() {
                if (settings.disabled) {
                    return;
                }

                $(this).addClass('down');
            });

            $el.on('mouseup.radiobutton', '.option', function() {
                if (settings.disabled) {
                    return;
                }

                $(this).removeClass('down');
            });
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var option, options = settings.options;

            $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

            //Append template to main container
            $el.html(us.template($tpl, settings));

            //Create tooltips if needed
            if (options.length && options[0].tooltip) {
                $el.find('.js-option').each(function(index, el) {
                    var tooltip;

                    option = options[index];

                    if (option) {
                        tooltip = tooltip_objects[tooltip_objects.length] = new MousePopup(option.tooltip, option.tooltip_styles);

                        $(el).mousePopup(tooltip);
                    }
                });
            }

            //Bind events
            bindEvents();
        }

        /**
         * Disables or enables component, also adds 'disabled' class to the root node
         * so the component can be skinned
         *
         * @param {Boolean}   bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            $el.toggleClass('disabled', bool);
        }

        /**
         * Allows to disable or enable specific options in the radiobutton
         *
         * @param {Object} [options]   an array which contains the options values
         * @param {Boolean} [bool]     determinates if options have to be enabled (false)
         *                             or disabled (true)
         *
         * Note:
         * This function can be executed without params, then it will check all HTML
         * nodes if everything is set up propely (not proper situation: when option
         * is disabled and checked in the same time)
         */
        function disableOptions(options, bool) {
            var i, l = (options || []).length,
                value, $option,
                initial = typeof options === 'undefined' && typeof bool === 'undefined';

            $el.find('.option').each(function(index, option) {
                $option = $(option);
                value = $option.attr('name');

                for (i = 0; i < l; i++) {
                    if (options[i] === value) {
                        $option.toggleClass('disabled', bool);

                        if (bool && $option.hasClass('checked')) {
                            $option.removeClass('checked');
                            settings.value = 0;
                        }
                    }
                }

                //When component is initialized, we have to get the initial state
                //from the DOM
                if (initial && $option.hasClass('disabled')) {
                    if ($option.hasClass('checked')) {
                        $option.removeClass('checked');
                        settings.value = 0;
                    }
                }
            });
        }

        /**
         * Removes selection from the previous option, and adds selection to the new
         * one.
         *
         * @param {String|Number}   value of the option which should be selected
         *                          Notice that the value is stored in the 'name' attribute
         */
        function selectItem(value) {
            $el.find('.option').removeClass('checked').filter('[name="' + value + '"]').addClass('checked');
        }

        /**
         * Sets value of the radiobutton
         *
         * @param {String|Number} value   value of currently selected option
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value, props) {
            props = props || {};

            var old_value = settings.value;

            if (old_value !== value) {
                //Add 'checked' class
                selectItem(value);

                //Save new value
                settings.value = value;

                //Trigger an event to notify listeners
                if (!props.silent) {
                    $el.trigger('rb:change:value', [value, old_value]);
                }
            } else {
                if (!props.silent) {
                    $el.trigger('rb:doubleselect:value', [value, old_value]);
                }
            }

            return this;
        };

        /**
         * Returns value of the currently selected option in the radiobutton
         *
         * @return {String|Number}
         */
        this.getValue = function() {
            return settings.value;
        };

        /**
         * Disables radiobutton
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables radiobutton
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

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
            disableOptions(options, true);

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
            disableOptions(options, false);

            return this;
        };

        /**
         * Returns value stored in the 'cid'
         *
         * @return {Object|String|Number}
         */
        this.getCid = function() {
            return settings.cid;
        };

        /**
         * Returns id specified on the root node of the component
         *
         * @return {String}
         */
        this.getId = function() {
            return $el.attr('id');
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events
            unbindEvents(true);

            $el.empty();
        };

        //Initialization
        (function() {
            loadTemplate();

            //Check if entire component is disabled
            disable(settings.disabled);

            //Select item
            selectItem(settings.value);

            //But maybe some specific options should be disabled ?
            disableOptions();
        }());

        return this;
    };
}(jQuery));