/*globals us */

(function($) {
    'use strict';

    $.fn.twoPartsProgressbar = function(params) {
        var settings = $.extend({
            templates: {},
            first_reward_type: '',
            second_reward_type: '',
            threshold_reward1: 0,
            threshold_reward2: 0,
            amount: 0,
            l10n: {}
        }, params);

        var $el = $(this);

        var amount_label, max_amount_label, progressbar1, progressbar2;

        this.setAmount = function(amount) {
            var th1 = settings.threshold_reward1,
                th2 = settings.threshold_reward2;

            //Labels
            amount_label.setCaption(amount);
            max_amount_label.setCaption(th2);

            //Progress 1
            progressbar1.setAnimate(true);
            progressbar1.setMax(th1);
            progressbar1.setValue(Math.max(0, Math.min(th1, amount)));

            //Progress 2
            progressbar2.setAnimate(true);
            progressbar2.setMax(th2 - th1);
            progressbar2.setValue(Math.max(0, Math.min(th2 - th1, amount - th1)));

            updateTooltips();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            amount_label.destroy();
            max_amount_label.destroy();
            progressbar1.destroy();
            progressbar2.destroy();
        };

        function getProgressbarSettings(value, max) {
            return {
                value: value,
                max: max,
                animate: false,
                position: 'vertical',
                prevent_overloading: true,
                type: 'integer',
                template: 'tpl_pb_vertical_with_indicator'
            };
        }

        /**
         * Recompiles templates and updates tooltips
         */
        function updateTooltips() {
            var tooltip1 = us.template(settings.templates.tooltip, {
                l10n: settings.l10n,
                reward: settings.first_reward_type,
                threshold: settings.threshold_reward1,
                completed: progressbar1.getRemainingValue() === 0
            });
            $el.find('.reward:last, .progress:last').tooltip(tooltip1);

            var tooltip2 = us.template(settings.templates.tooltip, {
                l10n: settings.l10n,
                reward: settings.second_reward_type,
                threshold: settings.threshold_reward2,
                completed: progressbar2.getRemainingValue() === 0
            });
            $el.find('.reward:first, .progress:first').tooltip(tooltip2);
        }

        function onProgressMaxReached(reward_type) {
            var $reward_container = $el.find('.reward_container[data-reward="' + reward_type + '"]'),
                $indicator = $reward_container.find('.ri_reward_indicator');

            $indicator
                .removeClass(reward_type + '_inactive')
                .addClass(reward_type + '_active glow');
        }

        //Initialize
        (function() {
            var pb_value_1 = settings.amount,
                pb_value_2 = Math.max(0, pb_value_1 - settings.threshold_reward1),
                pb_settings_1 = getProgressbarSettings(pb_value_1, settings.threshold_reward1),
                pb_settings_2 = getProgressbarSettings(pb_value_2, settings.threshold_reward2 - settings.threshold_reward1);

            $el.html(us.template(settings.templates.main, settings));

            //Current value
            amount_label = $el.find('.lbl_item_number .js-amount').label({
                caption: 0,
                template: 'empty'
            });

            //Max value
            max_amount_label = $el.find('.lbl_item_number .js-max-amount').label({
                caption: 0,
                template: 'empty'
            });

            //First progressbar
            progressbar1 = $el.find('.pb_reward_1').singleProgressbar(pb_settings_1)
                .on('pb:max:reached', onProgressMaxReached.bind(this, settings.first_reward_type));

            //Second progressbar
            progressbar2 = $el.find('.pb_reward_2').singleProgressbar(pb_settings_2)
                .on('pb:max:reached', onProgressMaxReached.bind(this, settings.second_reward_type));

            updateTooltips();
        }());

        return this;
    };
}(jQuery));