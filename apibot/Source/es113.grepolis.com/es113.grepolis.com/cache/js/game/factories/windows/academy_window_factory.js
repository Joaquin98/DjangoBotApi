/*globals BuildingWindowFactory */

window.AcademyWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Academy' window
         */
        openAcademyWindow: function() {
            return BuildingWindowFactory.open('academy');
        }
    };
}());