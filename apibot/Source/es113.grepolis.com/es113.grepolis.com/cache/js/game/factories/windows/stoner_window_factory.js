/*globals BuildingWindowFactory */

window.StonerWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Stoner' window
         */
        openStonerWindow: function() {
            return BuildingWindowFactory.open('stoner');
        }
    };
}());