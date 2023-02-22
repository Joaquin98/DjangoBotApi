/*global DM, GameControllers, ConfirmationWindowFactory */

(function() {
    'use strict';

    var Controller = GameControllers.HeroesController;

    var HeroesOverviewController = Controller.extend({
        main_view: null,

        renderPage: function(data) {
            this.models = data.models;
            this.collections = data.collections;
            this.templates = DM.getTemplate('heroes');
            this.l10n = DM.getl10n('heroes');

            var View = this.getViewClass();

            this.main_view = new View({
                controller: this,
                el: this.$el
            });

            this.player_heroes_collection = this.getCollection('player_heroes');

            this.player_heroes_collection.on('change:assignment_type change:town_arrival_at', function() {
                this.main_view.render();
            }, this);

            this.player_heroes_collection.onTownNameChange(this.player_heroes_collection, this.player_heroes_collection.sort);
            this.player_heroes_collection.onHeroLevelChange(this.player_heroes_collection, this.player_heroes_collection.sort);
            this.player_heroes_collection.onRemove(this.player_heroes_collection, this.player_heroes_collection.sort);

            this.player_heroes_collection.on('sort', this.main_view.render.bind(this.main_view));

            return this;
        },

        getViewClass: function() {
            throw 'Please implement getViewClass for your type of the heroes overview';
        },

        onPremiumClick: function() {
            throw 'Please implement onPremiumClick for your type of the heroes overview';
        },

        getTheLowestLevelHeroId: function() {
            var heroes = this.getHeroes(),
                i, l = heroes.length,
                hero,
                min_level = Infinity,
                hero_id, hero_level;

            for (i = 0; i < l; i++) {
                hero = heroes[i];
                hero_level = hero.getLevel();

                if (hero_level < min_level) {
                    hero_id = hero.getId();
                    min_level = hero_level;
                }
            }

            return hero_id;
        },

        /**
         * Assigns hero to the current town
         *
         * @param {String} hero_id
         * @param {Object} [callbacks]
         *     callbacks.success
         *     callbacks.error
         */
        assignToTown: function(hero_id, callbacks) {
            this.getHero(hero_id).assignToTown(callbacks);
        },

        /**
         * Unassigns hero from the current town
         *
         * @param {String} hero_id
         * @param {Object} [callbacks]
         *     callbacks.success
         *     callbacks.error
         */
        unassignFromTown: function(hero_id, callbacks) {
            ConfirmationWindowFactory.openConfirmationUnassignHeroFromTown(function() {
                this.getHero(hero_id).unassignFromTown(callbacks);
            }.bind(this));
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

        getHero: function(hero_id) {
            return this.getCollection('player_heroes').getHero(hero_id);
        },

        /**
         * Returns all models from GameCollections.PlayerHeroes
         *
         * @return {Array}
         */
        getHeroes: function() {
            return this.getCollection('player_heroes').getHeroes();
        },

        getHeroesSorted: function(sortAttribute) {
            return this.getCollection('player_heroes').getHeroesSorted(sortAttribute);
        },

        /**
         * Returns all models from GameCollections.PlayerHeroes
         *
         * @return {Array}
         */
        getHeroOfTown: function(town_id) {
            return this.getCollection('player_heroes').getHeroOfTown(town_id);
        },

        getHeroBeingAssignedToTown: function(town_id) {
            return this.getCollection('player_heroes').getHeroBeingAssignedToTown(town_id);
        },

        destroy: function() {
            if (this.main_view) {
                this.main_view._destroy();
            }

            this.player_heroes_collection.off(null, null, this);
        }
    });

    window.GameControllers.HeroesOverviewController = HeroesOverviewController;
}());