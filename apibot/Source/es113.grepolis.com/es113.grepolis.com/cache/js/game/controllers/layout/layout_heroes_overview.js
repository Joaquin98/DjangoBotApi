/*global GameViews, GameEvents, GameDataHeroes, HelperPlayerHints, GameControllers, DM, GameData */

(function() {
    "use strict";

    var heroes_enum = require('enums/heroes');

    var LayoutHeroesOverviewController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            var _self = this,
                player_heroes = this.getCollection('player_heroes');

            this.view = new GameViews.PlayerHeroesOverview({
                el: this.$el,
                controller: this
            });

            player_heroes.onTownArrivalAtChange(this, this.view.rerender.bind(this.view));
            player_heroes.onHeroLevelChange(this, this.view.onHeroExperienceChange.bind(this.view));
            player_heroes.onHeroExperienceChange(this, this.view.onHeroExperienceChange.bind(this.view));
            player_heroes.onCuredAtChange(this, this.view.rerender.bind(this.view));
            player_heroes.onAssignmentTypeChange(this, this.view.rerender.bind(this.view)); //Hero is attacking a town

            this.observeEvent(GameEvents.town.town_switch, function() {
                _self.view.rerender();
            });

            return this;
        },

        /**
         * Returns information whether Heroes feature is enabled or not
         *
         * @return {Boolean}
         */
        areHeroesEnabled: function() {
            return GameDataHeroes.areHeroesEnabled();
        },

        /**
         * Calls action on the server to save that the welcome screen has been seen by the user
         */
        disableHeroesWelcomeScreen: function() {
            var _self = this;

            HelperPlayerHints.disable('heroes_welcome', function() {
                //Change flag
                GameDataHeroes.setHeroWelcomeHint(false);
                //Hide teaser
                _self.view.hideTeaser();
            }, true);
        },

        /**
         * Return information whether the heroes welcome screen has been seen by user
         *
         * @return {Boolean}
         */
        hasHeroesWelcomeScreenBeenSeen: function() {
            return GameDataHeroes.hasHeroesWelcomeScreenBeenSeen();
        },

        /**
         * @see PlayerHeroes.getHero
         */
        getHero: function(hero_id) {
            return this.getCollection('player_heroes').getHero(hero_id);
        },

        /**
         * @see PlayerHeroes.getHeroOfTown
         */
        getHeroOfTown: function(town_id) {
            return this.getCollection('player_heroes').getHeroOfTown(town_id);
        },

        getHeroBeingAssignedToTown: function(town_id) {
            return this.getCollection('player_heroes').getHeroBeingAssignedToTown(town_id);
        },

        /**
         * @see PlayerHeroes.isStateInjuredHeroInTown
         */
        isStateInjuredHeroInTown: function() {
            return this.getCollection('player_heroes').isStateInjuredHeroInTown();
        },

        /**
         * @see PlayerHeroes.isStateHealthyHeroInTown
         */
        isStateHealthyHeroInTown: function() {
            return this.getCollection('player_heroes').isStateHealthyHeroInTown();
        },

        /**
         * @see PlayerHeroes.isStateHeroIsAttacking
         */
        isStateHeroIsAttacking: function() {
            return this.getCollection('player_heroes').isStateHeroIsAttacking();
        },

        /**
         * Cancels hero trip to the town
         *
         * @param {String} hero_id
         * @param {Object} [callbacks]
         *     callbacks.success
         *     callbacks.error
         */
        cancelTownTravel: function(hero_id, callbacks) {
            this.getHero(hero_id).cancelTownTravel(callbacks);
        },

        getHeroIconTooltip: function(hero) {
            var l10n = DM.getl10n('heroes', 'common'),
                gd_hero = GameData.heroes[hero.getId()];

            return '<div class="ui_hero_tooltip_small">' +
                '<div class="icon_border"><div class="icon hero50x50 ' + hero.getId() + '"></div></div>' +
                '<b>' + gd_hero.name + '</b><br />' +
                l10n.hero_of[gd_hero.category] +
                '<br /><br />' +
                '<b>' + l10n.level(hero.getLevel()) + '</b><br /><br />' +
                l10n.click_to_open_hero_cuncil +
                '</div>';
        },

        /**
         * Test if the player will automatically see the welcome screen
         *
         * @private
         * @returns {boolean}
         */
        _isAutoShowWelcomeScreen: function() {
            return this._hasAndromeda();
        },

        _hasAndromeda: function() {
            return this.getCollection('player_heroes').hasHero(heroes_enum.ANDROMEDA);
        },

        destroy: function() {
            window.ITowns.all_buildings.off(null, null, this);
        }
    });

    window.GameControllers.LayoutHeroesOverviewController = LayoutHeroesOverviewController;
}());