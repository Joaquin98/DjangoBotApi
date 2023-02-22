/*global define, GameData, TooltipFactory, MousePopup, DM, s */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var HeroesBase = BaseView.extend({
        tooltip_coins_common: '<strong>%1</strong><br/>',

        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            return this;
        },

        /**
         * Initializes exchange currency button component
         */
        initializeExchangeCurrencyButton: function() {
            var controller = this.controller,
                l10n = DM.getl10n("heroes", "council");

            controller.registerComponent('heroes_exchange_currency', this.$('.exchange_currency').button({
                caption: l10n.exchange_button
            }).on('btn:click', function() {
                controller.openExchangeCurrencyWindow();
            }));
        },

        /**
         * Initializes tooltips
         */
        initializeCoinsTooltips: function() {
            var l10n = DM.getl10n("heroes"),
                exc = l10n.council.exchange_currency,
                coins_of_war = s(this.tooltip_coins_common, exc.tooltip_coins_of_war) + exc.tooltip_coins,
                coins_of_wisdom = s(this.tooltip_coins_common, exc.tooltip_coins_of_wisdom) + exc.tooltip_coins,
                window_title = s(this.tooltip_coins_common, exc.window_title) + exc.tooltip_coins,
                hero_of_war = s(this.tooltip_coins_common, l10n.common.hero_of.war),
                hero_of_wisdom = s(this.tooltip_coins_common, l10n.common.hero_of.wisdom),
                experience_bar = l10n.overview.tooltip_experience_bar,
                health_bar = l10n.overview.tooltip_health_bar,
                tooltip_max_experience = l10n.overview.tooltip_max_experience;

            this.$('.currency .coins_of_war').tooltip(coins_of_war);
            this.$('.hero_of_war .requirements .coin').tooltip(coins_of_war);
            this.$('.currency .coins_of_wisdom').tooltip(coins_of_wisdom);
            this.$('.hero_of_wisdom .requirements .coin').tooltip(coins_of_wisdom);
            this.$('.currency .exchange_currency').tooltip(window_title);
            this.$('.hero_of_war .portrait .hero_type').tooltip(hero_of_war);
            this.$('.hero_of_wisdom .portrait .hero_type').tooltip(hero_of_wisdom);
            this.$('.overview_content .hero_type .wisdom').tooltip(hero_of_wisdom);
            this.$('.overview_content .hero_type .war').tooltip(hero_of_war);
            this.$('.hero_slot .info .pb_exp:not(.max)').tooltip(experience_bar);
            this.$('.hero_slot .info .pb_regeneration').tooltip(health_bar);
            this.$('.hero_slot .info .pb_exp.max').tooltip(tooltip_max_experience);
        }
    });

    window.GameViews.HeroesBase = HeroesBase;
}());