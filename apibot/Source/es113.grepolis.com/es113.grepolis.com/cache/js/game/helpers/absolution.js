/*globals Game */

(function() {
    'use strict';

    var HelperABSolution = {
        /**
         * return the AB User Group for a given setting value
         */
        getABUserGroupForSetting: function(setting) {
            return Game.ab[setting];
        }
    };

    window.HelperABSolution = HelperABSolution;
}());