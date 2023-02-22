/*global us, TooltipFactory, GameDataPowers */

(function() {
    'use strict';

    var View = window.GameViews.BaseView;
    var heroes_enum = require('enums/heroes');

    var GiftsWelcomeView = View.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            View.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('main'), {
                description: this.controller.getDescription(),
                title: this.controller.getName()
            }));

            this.$el.find('.js-gift-container').html(us.template(this.controller.getTemplate('gift'), {
                gift_data: this.controller.getGiftData(),
                power_reward_css: this.controller.isPowerGift() ? this.getPowerRewardIconCSSClass() : ''
            }));

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            var l10n = this.controller.getl10n();

            //Tooltip only for Odysseus
            if (this.controller.isOdysseusGift()) {
                this.$el.find('.hero_box div').tooltip(TooltipFactory.getHeroCard(heroes_enum.ODYSSEUS, {
                    show_requirements: true
                }), {}, false);
            }

            // Tooltip for Powers gift
            if (this.controller.isPowerGift()) {
                var reward_item = this.controller.getPowerRewardItem();
                this.$el.find('.reward_power div').tooltip(TooltipFactory.createPowerTooltip(reward_item.getPowerId(), {}, reward_item.getConfiguration()));

            }

            //Common for all gifts
            this.controller.registerComponent('btn_get_gift', this.$el.find('.btn_get_gift').button({
                caption: l10n.button_caption
            }).on('btn:click', function(e) {
                this.controller.onBtnGetGiftClick();
            }.bind(this)));
        },

        getPowerRewardIconCSSClass: function() {
            return GameDataPowers.getRewardCssClassIdWithLevel(this.controller.getPowerRewardItem());
        },
        destroy: function() {

        }
    });

    window.GameViews.GiftsWelcomeView = GiftsWelcomeView;
}());