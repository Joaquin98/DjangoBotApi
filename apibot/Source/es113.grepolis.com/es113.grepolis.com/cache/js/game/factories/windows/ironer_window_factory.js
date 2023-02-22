/*globals BuildingWindowFactory */

window.IronerWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Ironer' window
         */
        openIronerWindow: function() {
            return BuildingWindowFactory.open('ironer');
        }
    };
}());