/*globals WF */

window.WorldEndWelcomeWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'WorldEndWelcome' window - default tab
         */
        openWindow: function(gift_data) {
            return WF.open('world_end_welcome', {
                gift_data: gift_data
            });
        }
    };
}());