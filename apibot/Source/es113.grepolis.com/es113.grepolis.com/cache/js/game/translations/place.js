/*global _, DM */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            place: {
                window_title: _('Building view'),
                tabs: [
                    _('Defense')
                ],

                simulator: {
                    assign: _('Assign'),
                    unassign: _('Click here to release your hero again'),
                    configuration: {
                        header: {
                            headline: _("Simulator Overview"),
                            description: _("Configure your attack-scenario including all factors relevant to the outcome of the battle you would like to simulate"),
                            attacker: _("Attacker"),
                            defender: _("Defender")
                        },
                        add_new: {
                            powers: _("Add Power"),
                            spells: _("Add Spell"),
                            technologies: _("Add Technology"),
                            buildings: _("Add Building"),
                            advisors: _("Add Advisor"),
                            game_bonuses: _("Add Game Bonus"),
                            temples: _("Add Temple Power")
                        },
                        choose_option: {
                            powers: _("Choose Power"),
                            spells: _("Choose Spell"),
                            technologies: _("Choose Technology"),
                            buildings: _("Choose Building"),
                            advisors: _("Choose Advisor"),
                            game_bonuses: _("Choose Game Bonus"),
                            temples: _("Choose Temple Power")
                        },
                        powers: _("Powers"),
                        spells: _("Spells"),
                        technologies: _("Technologies"),
                        buildings: _("Buildings"),
                        advisors: _("Advisors"),
                        game_bonuses: _("Game Bonuses"),
                        temples: _("Temples"),
                        reset: _("Reset configuration"),
                        no_selection_tooltip: _("Nothing more can be added.")
                    }
                },

                support_overview: {
                    title: _('Building view'),
                    capacity: _('Capacity:'),
                    titles: {
                        troops_outside: _('Troops outside'),
                        defensive_troops: _('Defense'),
                        own_troops_in_this_city: _('Own troops in this city')
                    },

                    sort_by: _('Sorted by:'),
                    options: {
                        origin_town_name: _('Own cities'),
                        destination_town_name: _('Supported city'),
                        player_name: _('Supported player'),
                        troop_count: _('Number of troops')
                    },

                    troops_from: _('Troops from'),
                    troops_in: _('Troops in'),
                    show_troops: _('Display troops'),
                    just_in: _('in'),
                    total_own_troops_in_this_town: _('Total own troops in this city'),
                    your_troops_in_this_town: _('Own troops in this city'),
                    total_troops_in_this_town: _('Total troops in this city'),
                    troops_from_this_city: _('Troops from this city'),
                    send_all_units_back: _('Return all units'),
                    send_part_of_units_back: _('Return some units'),
                    btn_call_back: _('Return units'),
                    no_results: {
                        support_for_active_town: _('No troops present'),
                        active_town_supports_towns: _('Your city is not supporting any other cities currently.'),
                        active_player_supports_towns: _('Your city is not supporting any other cities currently.'),
                        active_player_supports_town: _("You don't currently support this city."),
                        you_are_not_supporting_this_town: _("You don't currently support this city.")
                    },
                    slow_transport_ship: _('Transport boat'),
                    fast_transport_ship: _('Fast transport ship'),
                    errors: {
                        send_units_in_chunks: _('Not enough transport ships, recall units separately.'),
                        not_enough_transports_left: _('The capacity of the transporters that were left behind is insufficient.'),
                        not_enough_transport_capacity: _('You need transport ships to be able to withdraw the troops.'),
                        not_enough_transport_capacity_same_island: _('Not enough transport ships, recall units separately.')
                    },
                    tooltips: {
                        send_all_units_back: _('Return all units to their home city')
                    }
                }
            }
        }
    });
}());