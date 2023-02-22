/* global GPWindowMgr */

/**
 * helper for old style town-info tabs to reduce the amount of w() function
 * calls in the game
 */

(function() {
    'use strict';

    var TownInfoHelper = {

        /**
         * given a selector, checks if an old style window with this selector
         * exists and closes the first one.
         *
         * !! Only works for old style windows
         *
         * @deprecated
         * @param {String} $selector
         * @returns {Boolean} true, if found and closed a duplicate
         */
        closeDuplicateOldStyleWindow: function($selector) {
            var candidate_windows = this.getOpenWindowsBySelector($selector);

            if (candidate_windows.length > 1) {
                candidate_windows[0].close();
                candidate_windows[1].toTop();
                return true;
            }

            return false;
        },

        /**
         * given a selector returns all open windows which have this selector in their DOM
         * This is bascically an inverse w(), but not based on DOM traversal.
         *
         * @deprecated
         * @param {String} $selector
         * @returns {Array} list of filtered windows
         */
        getOpenWindowsBySelector: function($selector) {
            var open_windows = GPWindowMgr.getAllOpen(),
                filtered_windows = [];

            for (var i = 0, l = open_windows.length; i < l; i++) {
                var wnd = open_windows[i],
                    $root = wnd.getJQElement(),
                    $found_elements = $root.find($selector);

                if ($found_elements.length) {
                    filtered_windows.push(wnd);
                }
            }

            return filtered_windows;
        }
    };

    window.TownInfoHelper = TownInfoHelper;
}());