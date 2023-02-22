/*globals BuildingWindowFactory */

window.MainWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Main' window
         */
        openMainWindow: function() {
            return BuildingWindowFactory.open('main');
        }
    };
}());