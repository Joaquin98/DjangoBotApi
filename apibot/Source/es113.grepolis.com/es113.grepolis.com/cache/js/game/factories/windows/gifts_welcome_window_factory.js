/*globals WF */

window.GiftsWelcomeWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'GiftsWelcome' window - default tab
         */
        openWindow: function(gift_data) {
            return WF.open('gifts_welcome', {
                gift_data: gift_data
            });
        }
    };
}());