/*globals BuildingWindowFactory */

window.HideWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Hide' window
         */
        openHideWindow: function() {
            return BuildingWindowFactory.open('hide');
        }
    };
}());