/* global _, DM */
define('translations/town_group_icons', function() {
    'use strict';

    DM.loadData({
        l10n: {
            town_group_icons: {
                revolt_arising: _("A revolt is being stirred"),
                revolt_running: _("City is in revolt"),
                conquerors: _("City is under siege")
            }
        }
    });

    return DM.getl10n('town_group_icons');
});