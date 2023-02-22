/*globals WF */

window.IslandWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Island' window - default tab
         */
        openWindow: function() {
            return WF.open('island');
        }
    };
}());