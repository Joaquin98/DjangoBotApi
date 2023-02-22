/*globals BuildingWindowFactory */

window.LumberWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Lumber' window
         */
        openLumberWindow: function() {
            return BuildingWindowFactory.open('lumber');
        }
    };
}());