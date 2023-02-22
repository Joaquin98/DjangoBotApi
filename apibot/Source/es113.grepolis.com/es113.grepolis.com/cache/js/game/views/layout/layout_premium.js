/*global  PremiumWindowFactory, _, GameEvents */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutPremium = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            //@todo move it to the controller, don't use 'on' in onCurrencyChange
            this.player_ledger = this.controller.getModel('player_ledger');
            this.player_ledger.onCurrencyChange('gold', this.updateCounter, this);

            this.registerViewComponents();
            this.addTooltips();
            this.updateCounter();
        },

        registerViewComponents: function() {
            var $btn = this.$el.find('.btn_open_premium_buy_gold');
            this.$counter = this.$el.find('.gold_amount');
            this.controller.registerComponent('btn_open_premium', $btn.button({
                template: 'internal',
                caption: this.controller.getl10n('premium_button').caption
            }).on('btn:click', (function() {
                this.openPremium();
            }).bind(this)));
        },

        addTooltips: function() {
            var $btn = this.$el.find('.btn_open_premium_buy_gold');
            $btn.tooltip('<h4>' + _('Add gold') + '</h4><div>' + _('Gold can be used to get game related reliefs.') + '</div>');
        },

        updateCounter: function() {
            this.$counter.html(this.player_ledger.getGold());
        },

        openPremium: function() {
            PremiumWindowFactory.openBuyGoldWindow();
            $.Observer(GameEvents.menu.click).publish({
                option_id: 'premium'
            });
        },

        destroy: function() {
            this.$counter = null;
            this.player_ledger.off(null, null, this);
        }
    });

    window.GameViews.LayoutPremium = LayoutPremium;
}());