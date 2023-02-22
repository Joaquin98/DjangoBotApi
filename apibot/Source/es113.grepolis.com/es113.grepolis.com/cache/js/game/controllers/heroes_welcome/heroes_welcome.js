/*global DM, GameDataQuests, MM */

(function() {
    "use strict";

    var heroes_enum = require('enums/heroes');

    var Controller = window.GameControllers.HeroesController;

    var HeroesWelcomeController = Controller.extend({
        renderPage: function(data) {
            this.models = data.models;
            this.collections = data.collections;
            this.templates = DM.getTemplate('heroes_welcome');
            this.l10n = DM.getl10n('heroes');

            this.main_view = new window.GameViews.HeroesWelcome({
                controller: this,
                el: this.$el
            });

            return this;
        },

        hasAndromeda: function() {
            return this.getCollection('player_heroes').hasHero(heroes_enum.ANDROMEDA);
        },

        getFinishedTutorialQuestsCount: function() {
            return GameDataQuests.getFinishedTutorialQuestsCount();
        },

        getTutorialQuestsCount: function() {
            return GameDataQuests.getTutorialQuestsCount();
        },

        getHeroQuestId: function() {
            return MM.getOnlyCollectionByName('Progressable').getQuestIdByProgressableId('AssignHeroQuest');
        },

        _destroy: function() {
            this.main_view._destroy();
        }
    });

    window.GameControllers.HeroesWelcomeController = HeroesWelcomeController;
}());