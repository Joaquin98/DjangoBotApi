/* global Game */

(function(window) {
    "use strict";

    var GameDataAlliance = {
        /**
         * Returns the maximum count of letters for the alliance profiles.
         *
         * @return {Number}
         */
        getMaxLengthForProfileFields: function() {
            return Game.constants.alliance.profile.max_field_length;
        }
    };

    window.GameDataAlliance = GameDataAlliance;
}(window));