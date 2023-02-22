/*global GameData, DM, Timestamp, GameDataHeroes, GameControllers, GameModels */

(function() {
    "use strict";

    var Controller = GameControllers.HeroesController;

    var HeroesCouncilController = Controller.extend({
        renderPage: function(data) {
            var callback_rerender;

            this.models = data.models;
            this.collections = data.collections;
            this.templates = DM.getTemplate('heroes');
            //this.templates = DM.getTemplate('heroes', 'council);
            this.l10n = DM.getl10n('heroes');

            this.main_view = new window.GameViews.HeroesCouncil({
                controller: this,
                el: this.$el
            });

            //Refresh because user can get all heroes, so button should be grayed out

            callback_rerender = this.main_view.rerender.bind(this.main_view);

            this.getCollection('player_heroes').onHeroAdd(this, callback_rerender);
            this.getModel('heroes_recruitment').onHeroRecruitmentDataChange(this, callback_rerender);
            this.getModel('player_ledger').onCoinsOfWarAndWisdomChange(this, callback_rerender);
            this.getModel('heroes').onCultureSlotsChange(this, callback_rerender);

            return this;
        },

        buyHero: function(data) {
            var player_hero = new GameModels.PlayerHero();
            player_hero.buyHero(data);
        },

        swapOffer: function() {
            this.getModel('heroes').swapOffer();
        },

        hasUserBoughtAHeroToday: function() {
            return this.getModel('heroes_recruitment').hasUserBoughtAHeroToday();
        },

        hasEnoughCoinsToBuyHero: function(hero_id) {
            var hero = GameData.heroes[hero_id],
                player_ledger = this.getModel('player_ledger');

            return player_ledger[hero.category === "war" ? 'getCoinsOfWar' : 'getCoinsOfWisdom']() >= hero.cost;
        },

        checkIfBuyable: function(hero_id) {
            return this.hasEnoughCoinsToBuyHero(hero_id);
        },

        isCouncilOpenedFirstTime: function() {
            return this.getModel('heroes').isCouncilOpenedFirstTime();
        },

        areHeroesAvailable: function() {
            return this.getCalledHeroes() !== false;
        },

        getHeroData: function(hero) {
            return GameData.heroes[hero];
        },

        getTimeTillNextCall: function() {
            return Math.max(0, this.getModel('heroes_recruitment').getNextFreeSwapTime() - Timestamp.now());
        },

        forceUpdateHeroesRecruitment: function() {
            this.getModel('heroes_recruitment').forceUpdate();
        },

        hasMaxAmountOfHeroes: function() {
            return this.getCollection("player_heroes").getHeroesCountWithoutExclusives() ===
                GameDataHeroes.getHeroesCountWithoutExclusive();
        },

        isSwapHeroesButtonDisabled: function() {
            return this.hasMaxAmountOfHeroes();
        },

        getTooltipsForRecruitButton: function(hero_id) {
            var l10n = this.getl10n('council'),
                hero_type = GameDataHeroes.getHeroType(hero_id),
                has_coins = this.hasEnoughCoinsToBuyHero(hero_id);

            var tooltip;

            if (!has_coins) {
                tooltip = l10n.not_enough['coins_of_' + hero_type];
            } else if (!this.hasFreeSlots()) {
                tooltip = l10n.not_enough.slots;
            }

            return [{
                    title: l10n.mouse_popup.recruit_hero
                },
                {
                    title: tooltip
                }
            ];
        },

        _destroy: function() {
            if (this.main_view) {
                this.main_view._destroy();
            }

            this.stopListening();
            this.getModel('heroes').off(null, null, this.main_view);
            this.getModel('player_ledger').offCoinsOfWarAndWisdomChange(this);
        }
    });

    window.GameControllers.HeroesCouncilController = HeroesCouncilController;
}());