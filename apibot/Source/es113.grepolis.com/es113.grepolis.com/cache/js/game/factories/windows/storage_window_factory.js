/*globals BuildingWindowFactory */

window.StorageWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Storage' window - default tab
         */
        openWindow: function() {
            return BuildingWindowFactory.open('storage');
        }
    };
}());