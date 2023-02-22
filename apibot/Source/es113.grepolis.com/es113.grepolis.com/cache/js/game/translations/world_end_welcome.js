/* global DM, ngettext */
(function() {
    "use strict";

    DM.loadData({
        l10n: {
            world_end_welcome: {
                window_title: _('Default window title'),
                tabs: [],
                descr: _('The end of this world is near! A few rulers are still doggedly defending the empires they have conquered.<br />Do you want to try expanding your empire one more time or would you prefer to start afresh on a different, active world? With the experience you gained here, you could build an even more powerful empire!'),
                btn_new_worlds: _('New worlds'),
                btn_continue_fighting: _('Continue fighting'),
                world_ends_in: function(days) {
                    return s(ngettext('This world will close its gates in %1 day!', 'This world will close its gates in %1 days!', days), days);
                }
            }
        }
    });
}());