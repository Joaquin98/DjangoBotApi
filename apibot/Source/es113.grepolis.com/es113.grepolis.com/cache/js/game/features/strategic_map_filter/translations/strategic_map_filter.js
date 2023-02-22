/* global DM */
define("features/strategic_map_filter/translations/strategic_map_filter", function() {
    'use strict';

    DM.loadData({
        l10n: {
            strategic_map_filter: {
                window_title: _("Highlight Options"),
                tabs: [],
                alliance: _("Alliances"),
                player: _("Players"),
                citygroups: _("City Groups"),
                own_alliance: _("Own alliance"),
                pact: _("Pact members"),
                enemy: _("Enemies"),
                own_cities: _("Own cities"),
                placeholder_text_alliance: _("Enter alliance name ..."),
                placeholder_text_player: _("Enter player name ..."),
                color_btn: {
                    own_alliance: _("You can't change your alliance's color."),
                    own_cities: _("You can't change your own color.")
                },
                add_entry: _("Add entry"),
                delete_entry: _("Delete entry"),
                assign_color_player: _("Assign a different color to this player"),
                assign_color_alliance: _("Assign a different color to this alliance"),
                assign_color_pact: _("Assign a different color to the pact members"),
                assign_color_enemy: _("Assign a different color to your enemies"),
                disabled_checkbox_alliance: _("You are not in an alliance."),
                disabled_checkbox_pacts: _("No pacts available."),
                disabled_checkbox_enemies: _("No enemies were entered.")
            }
        }
    });
});