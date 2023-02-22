/*globals BuildingWindowFactory */

window.BarracksWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Barracks' window
         */
        openBarracksWindow: function() {
            return BuildingWindowFactory.open('barracks', null, {
                building_type: 'barracks'
            });
        },

        /**
         * Opens 'Docks' window
         */
        openDocksWindow: function() {
            return BuildingWindowFactory.open('docks', null, {
                building_type: 'docks'
            });
        }
    };
}());