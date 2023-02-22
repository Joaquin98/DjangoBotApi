/*global _, DM*/

(function() {
    "use strict";

    DM.loadData({
        "l10n": {
            "mass_recruit": {
                "search_by": _("Search for"),
                "select_town_group": _("Select city group"),
                "sort_by": {
                    "descr": _("Sort by..."),
                    "name": _("Name"),
                    "points": _("Points"),
                    "wood": _("Wood"),
                    "stone": _("Stone"),
                    "iron": _("Silver coins"),
                    "population": _("Free population"),
                    "storage": _("Warehouse size")
                },
                "recruit": _("Recruit"),
                "save_values": _("Save values"),
                "no_units_selected": _("You haven't selected any units."),
                "keep": _("Keep"),
                "insert_troops_state_1": _("Add troops"),
                "insert_troops_state_2": _("Recruit troops"),
                "barracks": _("Barracks"),
                "harbor": _("Harbor"),
                "completed_at": _("Completion:"),
                "no_group": _("No group"),
                "all_towns": _("All cities"),
                "empty_message": _("No results"),
                "tt_own_troops_in_town": _("Show only own troops"),
                "tt_own_troops_and_support_in_town": _("Show all troops"),
                "tt_own_troops_and_support_from_town": _("All units from this city"),
                "tt_show_mythical_units": _("Show mythical units"),
                "tt_show_land_and_water_units": _("Show land and sea units"),
                "tt_show_next_page": _("Next page"),
                "tt_show_prev_page": _("Previous page"),
                "tt_toggle_population": _("Show/hide cities without a free population"),
                "btn_help_wnd_title": _("Recruitment overview information")
            }
        } // l10n
    });
}());