/*globals Layout, Game */

window.ConquestWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Conquest' window
         */
        openConquestWindow: function(town_id) {
            return Layout.conquestWindow.open(town_id || Game.townId);
        },

        /**
         * Close "conquest" window
         */
        closeConquestWindow: function() {
            Layout.conquestWindow.close();
        }
    };
}());