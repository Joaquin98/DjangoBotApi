/*globals WF */

window.MobileTutorialWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Mobile tutorial' window - default tab
         */
        openWindow: function() {
            return WF.open('mobile_tutorial');
        }
    };
}());