/*global DM, __*/

(function() {
    'use strict';

    DM.loadData({
        l10n: {
            layout: {
                premium_button: {
                    premium_menu: {
                        trade_overview: __('noun|Trade'),
                        command_overview: _('Commands'),
                        recruit_overview: _('Recruiting'),
                        unit_overview: _('Troop overview'),
                        outer_units: _('Troops outside'),
                        building_overview: _('Buildings'),
                        culture_overview: _('Culture'),
                        gods_overview: _('Gods'),
                        hides_overview: _('Caves'),
                        town_group_overview: _('City groups'),
                        towns_overview: _('City list'),
                        attack_planer: _('Attack planner'),
                        farm_town_overview: _('Farming villages')
                    },
                    caption: _('Buy Gold')
                },
                main_menu: {
                    items: {
                        messages: _('Messages'),
                        reports: _('Reports'),
                        alliance: _('Alliance'),
                        allianceforum: _('Alliance forum'),
                        domination: _('Domination'),
                        settings: _('Settings'),
                        profile: _('Profile'),
                        ranking: _('Ranking'),
                        forum: _('Forum'),
                        invite_friends: _('Invite friends'),
                        olympus: _('Olympus'),
                        world_wonders: _('World Wonders')
                    }
                },
                config_buttons: {
                    settings: _('Settings'),
                    help: _('Help'),
                    logout: _('Return to world selection'),
                    toggle_audio: _('Toggle audio'),
                    sound_off: _('Sound off'),
                    not_supported: _("Your browser doesn't support this feature")
                },

                toolbar_activities: {
                    no_recruit_results: _('No recruiting'),
                    no_trades_results: _('No trade'),
                    no_movements_results: _('No movements'),
                    incomming_attacks: _('Arriving attacks'),
                    colonization_has_begun: _('Colonization has begun'),
                    colonization_ship_on_its_way: _('The colony ship is on its way'),
                    city_foundation: _('City foundation'),
                    espionage_tooltip: _('Espionage'),
                    colonization_tooltip: _('Colonization'),
                    arising_revolt_tooltip: _('A revolt is being started'),
                    running_revolt_tooltip: _('A revolt has started'),
                    arising_revolt_own_town_tooltip: _('A revolt is being started in your town'),
                    running_revolt_own_town_tooltip: _('A revolt has started in your own town'),
                    conquest_tooltip: _('This conquest will end at'),
                    conquest_started_tooltip: _('The conquest has started'),
                    processing_movements: _('Processing arrived commands')
                },

                town_name_area: {
                    town_group_tooltip: _('City group. Manage your cities in groups to get a better overview.'),
                    no_towns_in_group: _('No towns'),
                    rename_town_name: _('Selected city. Double-click to change the name.'),
                    new_island_quest: _('An island quest needs your attention')
                },
                quickbar: {
                    edit_quick_bar: _('Edit quick bar')
                },

                units: {
                    harbor: _('Harbor'),
                    barracks: _('Barracks')
                },

                units_time_to_arrival: {
                    select_unit: _('Select unit')
                },

                coins: {
                    tooltip: _('<b>Available hero coins</b><br>You get hero coins by completing island quests on the map. You can use hero coins for leveling up your heroes or for recruiting new heroes.')
                },

                battlepoints: {
                    bpv_tooltip: _('<b>Available battle points</b><br>You get battle points by killing enemy units. The amount of battle points you get depends on the population place the unit needs. You can use battle points for holding victory processions in the agora or for erecting farming villages on the islands.'),
                    non_bpv_tooltip: _('<b>Available battle points</b><br>You get battle points by killing enemy units. The amount of battle points you get depends on the population place the unit needs. You can use battle points for holding victory processions in the agora.')
                },

                resources_bar: {},

                powers_menu: {
                    gods: {
                        artemis: _('Artemis'),
                        athena: _('Athena'),
                        hades: _('Hades'),
                        hera: _('Hera'),
                        poseidon: _('Poseidon'),
                        zeus: _('Zeus'),
                        aphrodite: _('Aphrodite'),
                        ares: _('Ares')
                    },
                    title: _('Spells'),
                    tooltips: {
                        spells: {
                            title: _('Spell information'),
                            text: _('Spells have different effects and targets. Listed here are the spells that can be cast on your own cities. These spells can also be cast on friendly cities from the city info screen.<br><br>You can find the other spells in the command windows when launching or receiving an attack, and in the city info windows when scouting for possible enemies.')
                        }
                    }
                }
            } // layout
        } // l10n
    });
}());