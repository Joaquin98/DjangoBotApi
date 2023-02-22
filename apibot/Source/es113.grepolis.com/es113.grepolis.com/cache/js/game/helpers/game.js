/*globals Game */

(function() {
    "use strict";

    var HelperGame = {
        /**
         * Determinates whether the full town overview should be opened on the game load
         *
         * @return {Boolean}
         */
        showCityOverviewOnGameLoad: function() {
            return Game.autoOpenTownIndex;
        },

        /**
         * dertermines if the settings "constrcution from city overview" is enabled
         *
         * @returns {Boolean}
         */
        constructFromCityOverview: function() {
            return Game.player_settings.build_from_town_index_enabled;
        },

        getQuestTutorialRunning: function() {
            return Game.quest_tutorial_running;
        },

        getQuestTutorialShowWelcomeWindow: function() {
            return Game.quest_tutorial_show_welcome_window;
        }
    };

    window.HelperGame = HelperGame;
}());