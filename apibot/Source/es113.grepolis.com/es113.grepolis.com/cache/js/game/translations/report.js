/*global _*/

(function() {
    "use strict";

    DM.loadData({
        'l10n': {
            'report': {
                "window_title": _('Reports'),
                "tabs": [
                    _('Index')
                ],
                inbox: {
                    filter_types: {
                        all: _('All'),
                        attacks: _('Attacks'),
                        support: _('Support'),
                        espionage: _('Espionage'),
                        divine_powers: _('Divine Powers'),
                        alliance: _('Alliance'),
                        reservations: _('Reservations'),
                        world_wonders: _('World Wonders'),
                        misc: _('Misc')
                    }
                },
                no_reports_selected: _("No reports selected.")
            }
        } // l10n
    });
}());