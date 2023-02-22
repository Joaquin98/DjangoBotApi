/* globals DM */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            player: {
                profile: {
                    error_profile_length: function(max_length) {
                        return s(_('The maximum length of the profile text is %1 characters.'), max_length);
                    }
                }
            }
        }
    });
}());