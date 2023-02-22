/*globals WF */

window.HeroesWelcomeWindowFactory = (function() {
    'use strict';

    return {
        openHeroesWelcomeWindow: function() {
            return WF.open('heroes_welcome');
        }
    };
}());