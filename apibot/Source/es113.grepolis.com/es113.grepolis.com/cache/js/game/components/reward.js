/*global jQuery */

/**
 * make a DOM node a reward
 *
 * @param params
 *     {Object} reward     	can be plain reward data or a reward frontend class
 *     {Bool} disabled		the power is disabled (greyed out)
 *     {String} template	the template
 *     {String} classes		additional css classes
 *     {Number} size		size of the power (defaults: 60) avail: [12, 16, 24, 30, 45, 60, 86]
 *
 * @return {Object}  jQuery Component Object
 *
 * ------------------
 * Example:
 * ------------------
 *
 * This generates a reward (with tooltip etc)
 *
 * this.$el.find(".my_reward").reward({
 *     reward : this.model.getReward(),
 *     disabled: false,
 *     size: 86,
 *     amount: 3			// forces display of an amount, even if the reward has static data set to false
 * }).on('rwd:click', function() {
 * 		// do sth.
 * }));
 *
 */
(function($) {
    'use strict';

    var GameDataPowers = require('data/powers');
    var TooltipFactory = require('factories/tooltip_factory');

    $.fn.reward = function(params) {
        var settings = $.extend({
            reward: {},
            disabled: false,
            template: 'tpl_reward',
            classes: '',
            amount: 0,
            size: 60,
            template_data: {}
        }, params);

        var _self = this,
            $el = $(this),
            $tpl;

        /**
         * Removes all binded events from component
         *
         * @param {Boolean} destroy   determinates if the component is being currently destroyed
         */
        function unbindEvents(destroy) {
            $el.off('.reward');

            if (destroy) {
                $el.off('rwd:click');
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.reward', function(event) {
                if (settings.disabled) {
                    return;
                }

                $el.trigger('rwd:click', [_self, {
                    x: event.pageX,
                    y: event.pageY
                }]);
            });
        }

        /**
         * returns the css for this power
         * @returns {string}
         */
        function getPowerCss() {
            return settings.classes + ' ' + GameDataPowers.getRewardCssClassIdWithLevel(settings.reward);
        }

        /**
         * simple version of template loading -> see button component for how to do it complicated
         */
        function loadTemplate() {
            $tpl = $('#' + settings.template).html();
        }

        /**
         * returns HTML with the reward tooltip
         * @returns {string}
         */
        function getTooltipHtml() {
            return TooltipFactory.createPowerTooltip(settings.reward.power_id, {}, settings.reward.configuration);
        }

        /**
         * returns a reward amount, or 0
         * @returns {Number}
         */
        function getAmount() {
            if (settings.amount) {
                return settings.amount;
            }

            return GameDataPowers.displayRewardAmount(settings.reward.power_id) ? settings.reward.configuration.amount : 0;
        }

        /**
         * render template and bind events
         */
        function render() {
            $el.html(
                us.template(
                    $tpl,
                    Object.assign(
                        settings.template_data, {
                            disabled: settings.disabled,
                            size: settings.size,
                            power_css: getPowerCss(),
                            amount: getAmount()
                        }
                    )
                ));
            $el.tooltip(getTooltipHtml());
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
        }


        /**
         * disable reward
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);
            return this;
        };

        /**
         * Enables reward
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);
            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindEvents(true);
        };

        //Initialization
        (function() {
            loadTemplate();
            render();
            disable(settings.disabled);
        }());

        return this;
    };
}(jQuery));