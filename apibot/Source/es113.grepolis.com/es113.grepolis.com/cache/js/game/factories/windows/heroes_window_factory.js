/*globals WF, WM */

window.HeroesWindowFactory = (function() {
    'use strict';

    var windows = require('game/windows/ids');

    return {
        openHeroesWindow: function(params) {
            return WF.open('heroes', params);
        },

        /**
         * Opens 'Heroes' window with recruting tab selected
         */
        openHeroesRecrutingTab: function() {
            return this.openHeroesWindow({
                args: {
                    activepagenr: 1
                }
            });
        },

        /**
         * Open heroes training window for given hero
         * If there is already a training window open, it will replace the hero instead of opening a second window
         *
         * @param {window.GameModels.PlayerHero} player_hero
         * @return {Object}
         */
        openHeroesTrainWindow: function(player_hero) {
            var trainer_window = WM.getWindowByType(windows.HEROES_TRAIN);

            // now check if we have to refresh an already opened window or have to create a new one
            if (trainer_window.length === 1) {
                trainer_window[0].replaceModels({
                    player_hero: player_hero
                });
                trainer_window[0].bringToFront();
            } else {
                return WF.open('heroes_train', {
                    models: {
                        player_hero: player_hero
                    }
                });
            }
        }
    };
}());