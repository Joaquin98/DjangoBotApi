/*global define, DM, WMap, BuyForGoldWindowFactory, s, hours_minutes_seconds, GameData, Timestamp,
 MousePopup, GameEvents, debug, NotificationLoader, TooltipFactory, WF, GameDataHeroes */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var HeroesBuyHeroSlot = BaseView.extend({
        sub_context: 'buy_hero_slot',

        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n('common');
            this.template = this.controller.getTemplate('buy_hero_slot_buttons');

            this.player_ledger = this.controller.getModel('player_ledger');

            if (!this.player_ledger) {
                throw "PlayerLedger is missing in this window";
            }

            if (!this.template) {
                throw "Template not found. Please include windows/heroes/buy_hero_slot.tpl.php in DataFrontendBridge.php and call it 'buy_hero_slot_buttons'";
            }

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.template, {}));

            this.registerViewComponents();

            return this;
        },

        registerViewComponents: function() {
            var _self = this,
                controller = this.controller,
                l10n = this.l10n,
                currency_id = 'gold',
                premium_slot_cost = GameDataHeroes.getSlotCost(),
                player_ledger = this.player_ledger;

            controller.unregisterComponents(this.sub_context);

            var onClick = function(e, _btn) {
                BuyForGoldWindowFactory.openBuyHeroSlotForGoldWindow(_btn, function() {
                    controller.buyAdditionalSlot(currency_id);
                });
            };

            this.$el.find('.btn_buy_premium_slot').each(function(index, el) {
                var $btn = $(el),
                    cost = l10n.open_slot(premium_slot_cost),
                    currency_amount = player_ledger.getCurrency(currency_id);

                controller.registerComponent('btn_buy_premium_slot' + index, $btn.button({
                    caption: cost,
                    icon: true,
                    icon_type: currency_id,
                    disabled: false,
                    tooltips: [{
                        title: TooltipFactory.getBuyHeroSlotTooltip(currency_amount)
                    }]
                }).on('btn:click', onClick.bind(null)), _self.sub_context);
            });
        },

        destroy: function() {
            this.controller.unregisterComponents(this.sub_context);
        }
    });

    window.GameViews.HeroesBuyHeroSlot = HeroesBuyHeroSlot;
}());