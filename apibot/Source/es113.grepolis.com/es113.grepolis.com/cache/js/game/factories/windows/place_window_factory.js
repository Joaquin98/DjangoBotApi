/*globals BuildingWindowFactory, WF */

window.PlaceWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Place' window
         *
         * @param {String} [action]
         * @param {Object} [params]
         */
        openPlaceWindow: function(action, params) {
            return BuildingWindowFactory.open('place', action, params);
        },

        /**
         * Opens new agora window with support for specific town overview
         * @see support_overview_index.js to get more info about support overview modes
         *
         * @param {Number} town_id   town id
         */
        openSupportOverviewActivePlayerSupportsTown: function(town_id) {
            return WF.open('place', {
                args: {
                    town_id: town_id,
                    mode: 'support_overview_active_player_supports_town'
                }
            });
        }
    };
}());