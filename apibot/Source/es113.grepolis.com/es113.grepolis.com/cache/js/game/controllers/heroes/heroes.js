/*global GameDataHeroes, GameControllers */

(function() {
    'use strict';

    var HeroesController = GameControllers.TabController.extend({
        /**
         * Returns information whether the player has some free slots
         *
         * @return {Boolean}
         */
        hasFreeSlots: function() {
            return this.getModel('heroes').hasFreeSlots();
        },

        /**
         * Returns information whether the player has slots that he can unlock/buy or if he already bought every slot
         *
         * @returns {Boolean}
         */
        hasSlotsToBuy: function() {
            var max_count = GameDataHeroes.getHeroesMaxCount(),
                exclusive_count = GameDataHeroes.getExclusiveHeroCount(),
                own_exclusive_count = this.getCollection('player_heroes').getExclusiveHeroCount(),
                available_slots = this.getAvailableSlots(),
                slots_without_exclusives = available_slots - own_exclusive_count, // each exclusive hero gives one slot for free
                buyable_heroes_count = max_count - exclusive_count;

            // a player can buy as many slots as there are non-exclusive heroes
            return (buyable_heroes_count - slots_without_exclusives) > 0;
        },

        /**
         * Returns number of available slots
         *
         * @see GameModels.Heroes.getAvailableSlots() for more details
         */
        getAvailableSlots: function() {
            return this.getModel('heroes').getAvailableSlots();
        },

        /**
         * Returns the amount of culture points which are needed for the next slot
         *
         * @see GameModels.Heroes.getCulturePointsForNextSlot() for more details
         */
        getCulturePointsForNextSlot: function() {
            return this.getModel('heroes').getCulturePointsForNextSlot();
        },

        /**
         * Buys additional hero slot
         *
         * @return void
         */
        buyAdditionalSlot: function() {
            this.getModel('heroes').buyAdditionalSlot();
        },

        /**
         * Opens sub window where user can exchange his coins of war and wisdom
         */
        openExchangeCurrencyWindow: function() {
            var view = new window.GameViews.HeroesCouncilExchangeCurrency({
                window_controller: this,
                model: this.getModel('player_ledger'),
                l10n: this.getl10n('council'),
                cm_context: this.getContext('exchange_currency'),
                templates: {
                    exchange_currency: this.getTemplate('exchange_currency')
                }
            });

            this.openSubWindow({
                title: this.getl10n('council').exchange_currency.window_title,
                controller: view,
                skin_class_names: 'grepo_box overview_exchange_currency'
            });
        },

        getCalledHeroes: function() {
            var call_data = this.getModel('heroes_recruitment').getHeroRecruitmentData();

            if (!us.isEmpty(call_data)) {
                // TODO: this should be a white list instead of blacklist. think about refactoring.
                call_data = us.omit(call_data, 'last_call');
                call_data = us.omit(call_data, 'last_buy');
                if (!us.isEmpty(call_data)) {
                    return call_data;
                }
            }

            return false;
        },

        /**
         * Exchanges coins
         *
         * @param {String} coins_type
         * @param {Integer} amount
         */
        exchangeCoins: function(coins_type, amount) {
            var _self = this;

            this.getModel('heroes').exchangeCoins(coins_type, amount, function() {
                _self.closeSubWindow();
            });
        },

        destroy: function() {

        }
    });

    window.GameControllers.HeroesController = HeroesController;
}());