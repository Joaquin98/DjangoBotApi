/*globals window, Game */

(function(window) {
    'use strict';

    var GameDataCelebrations = {
        /**
         * Returns price of the 'Games' happening
         *
         * @return {Number}
         */
        getCelebrationGamesPrice: function() {
            return Game.constants.celebrations.games.cost;
        }
    };

    window.GameDataCelebrations = GameDataCelebrations;
}(window));