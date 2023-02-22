/* global DM */

define("features/color_picker/translations/color_picker", function() {
    'use strict';

    DM.loadData({
        l10n: {
            color_picker: {
                window_title: _("Color Picker"),
                own_cities_title: _("Color Picker: Your cities"),
                other_players_cities_title: function(name) {
                    return s(_("Color Picker: %1"), name);
                },
                own_alliance_title: _("Color Picker: Your alliance"),
                other_alliance_title: function(name) {
                    return s(_("Color Picker: %1"), name);
                },
                pacts_title: _("Color Picker: Pacts"),
                enemies_title: _("Color Picker: Enemies"),
                tabs: [],
                default_btn: _("Default"),
                preview_text: _("Preview"),
                save_color: _("Save color"),
                default_color_text: _("Reset to default color."),
                default_color_text_player: _("Reset to default color. Alliance color will be applied if any is set."),
                default_color_text_alliance: _("Reset to default color. Pact or enemy color will be applied if any is set.")
            }
        }
    });
});