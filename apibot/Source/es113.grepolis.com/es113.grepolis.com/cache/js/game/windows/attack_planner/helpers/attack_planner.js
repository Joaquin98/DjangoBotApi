/* globals CM */

define('windows/attack_planner/helpers/attack_planner', function() {
    'use strict';

    var Features = require('data/features');

    return {
        registerRadioButtons: function(context, $el, l10n, search_textbox) {
            var options = [{
                    value: 'game_town',
                    name: l10n.town_name
                },
                {
                    value: 'town_id',
                    name: l10n.town_id
                }
            ];

            if (Features.isOlympusEndgameActive()) {
                options.push({
                    value: 'game_temple',
                    name: l10n.temple_name
                });
                options.push({
                    value: 'temple_id',
                    name: l10n.temple_id
                });
            }

            CM.unregister(context, 'rbtn_search_by');
            return CM.register(context, 'rbtn_search_by', $el.radiobutton({
                value: 'game_town',
                options: options
            }).on('rb:change:value', function(e, value) {
                if (value === 'game_town' || value === 'game_temple') {
                    search_textbox.changeAutocompletion(value);
                    search_textbox.enableAutocompletion();
                } else {
                    search_textbox.disableAutocompletion();
                }

                search_textbox.setValue();
            }));
        },

        registerSearchTextBox: function(context, $el, l10n) {
            CM.unregister(context, 'txt_plan_target');
            return CM.register(context, 'txt_plan_target', $el.textbox({
                autocompletion: true,
                autocompletion_type: 'game_town',
                autocompletion_limit: 30,
                autocompletion_format_list: function(row) {
                    return row[1] + " (" + row[2] + ")";
                },
                autocompletion_format_output: function(row) {
                    return row.data[1] + " (" + row.data[2] + ")";
                }
            }).tooltip('<b>' + l10n.target_tooltip_head + '</b><br>' + l10n.target_tooltip_body));
        }
    };
});