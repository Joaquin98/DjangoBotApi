/*global DM */
define("features/translation/advisor", function() {
    "use strict";


    DM.loadData({
        l10n: {
            advisor: {
                curator: _("Administrator"),
                trader: _("Merchant"),
                priest: _("High Priestess"),
                commander: _("Commander"),
                captain: _("Captain")
            }
        }
    });
});