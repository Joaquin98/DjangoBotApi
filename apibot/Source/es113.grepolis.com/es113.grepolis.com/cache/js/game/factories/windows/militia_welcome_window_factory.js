/* globals WF */
window.MilitiaWelcomeWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'MilitiaWelcome' window - default tab
         */
        openWindow: function(town_id) {
            return WF.open('militia_welcome', {
                town_id: town_id
            });
        }
    };
}());