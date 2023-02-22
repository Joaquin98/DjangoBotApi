/*global DM, GameData, $, GameControllers, StringSorter */

(function() {
    "use strict";

    var HeroesCollectionController = GameControllers.HeroesController.extend({
        main_view: null,

        renderPage: function(data) {
            this.models = data.models;
            this.collections = data.collections;
            this.templates = data.templates;
            this.l10n = DM.getl10n('heroes');

            this.main_view = new window.GameViews.HeroesCollection({
                controller: this,
                el: this.$el
            });

            return this;
        },

        getHeroes: function() {
            var hero_id, hero, heroes = [],
                gd_heroes = GameData.heroes,
                player_heroes = this.getCollection('player_heroes');

            for (hero_id in gd_heroes) {
                if (gd_heroes.hasOwnProperty(hero_id)) {
                    hero = $.extend({}, gd_heroes[hero_id]);
                    hero.id = hero_id;
                    hero.owned = player_heroes.hasHero(hero_id);

                    heroes.push(hero);
                }
            }

            heroes = new StringSorter().compareObjectsByFunction(heroes, function(gd_hero) {
                return gd_hero.name;
            });

            return heroes;
        },

        _destroy: function() {
            if (this.main_view) {
                this.main_view._destroy();
            }
        }
    });

    window.GameControllers.HeroesCollectionController = HeroesCollectionController;
}());