/*global jQuery, MousePopup */

/**
 * This component extends the functionality of the native HTML checkbox, and can
 * be easly skinned
 *
 * @param params
 *     {String} caption     derteminates the checkbox caption
 *     {Boolean} disabled   determinates whether component can be used or not
 *                          (events are not triggered when component is disabled)
 *     {String} template    the id (without #) of template which is already
 *							in the document between
 *							<script type="text/template" id="..." /> tag
 *							or string which contains template
 *     {Boolean} checked    determinates the component state
 *     {String} cid         helps to determinate the button, its something like
 *                          vitrual id, or you can store there some informtaions
 *
 * @return {Object}  jQuery Component Object
 *
 *
 * Component Events:
 * - cbx:check   fired when state is changed
 *
 *
 * ------------------
 * Example 1:
 * ------------------
 *
 * This is real example from the mass recruit overview. When user clicked on the button,
 * scripts checks if the checkbox is checked, and then saves all settings in the cookie,
 * and after that buys all units
 *
 * var cbx_settings = CM.register(context, 'cbx_save_settings', root.find("#cbx_save_settings").checkbox({
 *     caption : 'Some caption', checked : true
 * }));
 *
 * CM.register(context, 'btn_recruit_units', root.find("#btn_recruit_units").button({
 *     caption : 'Some caption'
 * }).on("btn:click", function() {
 *    if (cbx_settings.isChecked()) {
 *        saveSettings();
 *    }
 *
 *    buyUnitsInAllTowns();
 * }));
 *
 *
 * ------------------
 * Example 2:
 * ------------------
 *
 * CM.register(context, 'cbx_confirm', root.find("#cbx_hide_confirmation_window").checkbox({
 *     caption : 'Some Caption'
 * }).on("cbx:check", function(){
 *     //Do something
 * });
 *
 */
(function($) {
    'use strict';

    $.fn.checkbox = function(params) {
        var settings = $.extend({
            caption: 'Default Checkbox',
            disabled: false,
            template: 'tpl_checkbox',
            checked: false,
            cid: {},
            tooltips: []
        }, params);

        var tooltip;

        var _self = this,
            $el = $(this),
            $tpl;

        /**
         * Makes checkbox checked or unchecked
         *
         * @param {Boolean} bool   determinates state of the checkbox
         */
        function check(bool) {
            settings.checked = bool;

            $el.toggleClass('checked', bool);

            $el.trigger('cbx:check', [_self, bool]);
        }

        function unbindTooltip() {
            if (tooltip && tooltip.destroy) {
                tooltip.destroy();
                tooltip = null;
            }
        }

        function bindTooltip() {
            var pos = 0,
                tooltip_current,
                all_tooltips = settings.tooltips;

            if (settings.disabled) {
                pos = 1;
            }

            //Get tooltip
            if (all_tooltips[pos] || all_tooltips.length) {
                tooltip_current = all_tooltips[pos] || all_tooltips[0];
            }

            if (!tooltip_current) {
                unbindTooltip();
            }

            //if new tooltip is the same as previous or doesn't exist, don't change anything
            if (!tooltip_current || (tooltip && tooltip.xhtml === tooltip_current.title && !tooltip_current.hide_when_disabled)) {
                return;
            }

            //Destroy previous tooltip if exist
            if (tooltip && tooltip.destroy) {
                //Hide tooltip
                tooltip.onOutAnimationComplete();
                //Destroy it
                tooltip.destroy();
            }

            //If button is disabled, and if tooltip should be hidden
            if (settings.disabled && tooltip_current.hide_when_disabled) {
                return;
            }

            //Add new tooltip
            tooltip = new MousePopup(tooltip_current.title, tooltip_current.styles);
            $el.mousePopup(tooltip);
        }

        /**
         * Removes all binded events from component
         *
         * @param {Boolean} destroy   determinates if the component is being currently destroyed
         */
        function unbindEvents(destroy) {
            $el.off('.checkbox');

            if (destroy) {
                $el.off('cbx:check');

                //Destroy tooltip if exist
                unbindTooltip();
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.checkbox', function() {
                if (settings.disabled) {
                    return;
                }

                bindTooltip();

                check(!settings.checked);
            });
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var template = settings.template,
                $clone;

            $tpl = template === 'internal' ? null : (/^</.test(template) ? template : $('#' + template).html());

            if (!$tpl) {
                //Use HTML which is already appended to the label
                $clone = $el.clone();
                $tpl = $clone.find('.js-caption').text('%caption');

                //small workaround because jQuery doesn't allow to put <> in the .text()
                $tpl = $clone.html().toString().replace('%caption', '<%= caption %>');
            }

            //Append template to main container
            $el.html(us.template($tpl, settings));

            //Bind events
            bindEvents();
        }

        /**
         * Disables or enables component, also adds "disabled" class to the root node
         * so the component can be skinned and "disabled" attribute on the input element
         *
         * @param {Boolean} bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            $el.toggleClass('disabled', bool);

            //Update tooltips
            bindTooltip();
        }

        /**
         * Returns information about the checkbox's state (checked|unchecked)
         *
         * @return {Boolean}
         */
        this.isChecked = function() {
            return settings.checked;
        };

        /**
         * Returns value stored in the "cid"
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
         * Disables button
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables button
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
        };

        /**
         * sets the checkbox status
         *
         * @return {Object}  jQuery Component Object
         */
        this.check = function(bool) {
            check(bool);

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events from the main node
            unbindEvents(true);
        };

        //Initialization
        (function() {
            loadTemplate();

            check(settings.checked);
            disable(settings.disabled);
        }());

        return this;
    };
}(jQuery));