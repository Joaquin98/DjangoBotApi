/* global Game */

(function(window) {
    "use strict";

    var GameDataPlayer = {
        /**
         * Returns the maximum count of letters for the alliance profiles.
         *
         * @return {Number}
         */
        getMaxProfileLength: function() {
            return Game.constants.player.profile.max_profile_length;
        }
    };

    window.GameDataPlayer = GameDataPlayer;
}(window));