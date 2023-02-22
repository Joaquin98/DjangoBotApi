/*global DM */

(function() {
    'use strict';

    DM.loadData({
        l10n: {
            mobile_tutorial: {
                window_title: _('Mobile Tutorial'),
                tabs: [],
                page_1_description: _("Enable a screen lock for your device to enable the option to save your credentials."),
                page_2_description: _("Enable push notifications for the Grepolis app in your phone's system settings to receive push notifications."),
                page_3_description: _("Hold your finger on an element to receive more information about it."),
                page_4_description: _("Hold your finger on a drag item, and then move your finger while holding it down to move an object."),
                page_5_description: _("If items or buttons are too small, drag 2 fingers apart to zoom in. By pinching 2 fingers together, you zoom out again."),
                btn_dont_show_tutorial: _("Do not show this tutorial again"),
                next: _('Next'),
                previous: _('Previous')
            }
        }
    });
}());