/*globals _, s, ngettext, DM */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            tooltips: {
                wood: _("Wood"),
                stone: _("Stone"),
                iron: _("Silver coins"),
                population: _("Food"),
                time: _("Time"),
                build_costs: _("Upgrade costs"),
                build_time: _("Upgrade time"),
                max_level_reached: _("%1 has reached the maximum upgrade level."),
                requirements: _("Required:"),
                not_enough_population: _("Not enough farm spaces."),
                too_small_storage: _("Your warehouse is too small."),
                not_enough_resources: _("Not enough resources."),
                enough_resources_in: _("Enough resources: %1."),
                full_queue: _("No further orders possible."),
                building_level_x: _("%1 Level %2"),
                available_currency: {
                    gold: function(gold) {
                        return s(ngettext("Available gold: %1", "Available gold: %1", gold), gold);
                    },
                    coins_of_war: function(coins) {
                        return s(ngettext("Available Coins of War: %1", "Available Coins of War: %1", coins), coins);
                    },
                    coins_of_wisdom: function(coins) {
                        return s(ngettext("Available Coins of Wisdom: %1", "Available Coins of Wisdom: %1", coins), coins);
                    }
                },
                ocean: _("Ocean"),

                refund: _("Reimbursement: %1"),

                award: _("Award"),

                academy: {
                    already_researched: _("Already researched."),
                    in_progress: _("Currently being researched."),
                    full_queue: _("No further orders possible."),
                    wood: _("Wood"),
                    stone: _("Stone"),
                    iron: _("Silver coins"),
                    population: _("Food"),
                    time: _("Time"),
                    building_dependencies: _("Building dependencies:"),
                    not_enough_resources: _("Not enough resources."),
                    enough_resources_in: _("Enough resources: %1."),
                    culture_points_text: function(culture_points) {
                        return s(ngettext("You currently have %1 available culture point.", "You currently have %1 available culture points.", culture_points), culture_points);
                    }
                },

                reductions: {
                    building_build_time: _("You can cut the construction time in half for %1 gold."),
                    building_build_cost: _("You can upgrade the building with %2 fewer resources for %1 gold."),
                    hero_cure_time: _("By paying %1 gold you can reduce the remaining regeneration time by 50%.")
                },

                buy_hero_slot: function(gold) {
                    return s(ngettext(
                        "You can unlock another hero slot instantly for %1 gold. Thus you don't have to wait until you reach the next culture level.",
                        "You can unlock another hero slot instantly for %1 gold. Thus you don't have to wait until you reach the next culture level.",
                        gold), gold);
                },
                arrival_at: _("Arrival: %1"),

                free_population: _("Free population"),

                resources: {
                    production_per_hour: _("Production per hour:"),
                    storage_size: _("Warehouse size:"),
                    rare_plenty_disabled: _("This can be seen from building level 20 onwards."),
                    wood: {
                        name: _("Wood"),
                        rare: _("This island yields less wood than the others."),
                        plenty: _("Trees grow more quickly on this island than on other islands, which means that your timber camp can produce more wood.")
                    },
                    stone: {
                        name: _("Stone"),
                        rare: _("There are no especially large stone deposits on this island, which means that your quarry doesn't work as efficiently as others."),
                        plenty: _("You will profit from a high stone production on this island.")
                    },
                    iron: {
                        name: _("Silver coins"),
                        rare: _("The silver deposits on this island are fairly rare, which means that you have a slightly lower silver coin production."),
                        plenty: _("The mountains on this island have enormous silver deposits, which means that your silver mine can extract more silver.")
                    }
                },
                favor: _("Favor"),
                fury: _("Fury"),
                production_per_hour: _("Production per hour:"),
                hero_card: {
                    exclusive_hero: _("This is an exclusive hero.")
                },
                culture_points: {
                    headline: _("Culture points"),
                    body: _("Culture points are needed to increase your overall culture level. They determine how many cities you can control.")
                },
                unit_card: {
                    population_info: function(population) {
                        return s(_("%1 per unit"), population);
                    },
                    passive_ability: _("Passive Ability")
                },
                culture_overview: {
                    cities: function(owned_towns, max_town_count) {
                        return s(_("<b>Cities:</b> %1/%2"), owned_towns, max_town_count);
                    },
                    cultural_level: function(level) {
                        return s(_("<b>Culture level:</b> %1"), level);
                    },
                    cultural_points: function(points, needed_points_for_next_step) {
                        return s(_("<b>Culture points:</b> %1/%2"), points, needed_points_for_next_step);
                    },
                    description: _("Get more culture points to reach the next level and unlock more city slots.<br />Look at the Culture tab in the Agora to find how to acquire more cultural points.")
                },
                alliance_powers: {
                    olympus_temple_powers: {
                        small: _("Small Temple Buffs"),
                        large: _("Large Temple Buffs")
                    }
                },
                olympus_temple: function(temple_name, owner) {
                    return s(_("<b>%1</b><br />held by<br /><b>%2</b>"), temple_name, owner);
                },
                olympus: _('Olympus'),
                small_temple_name: function(temple_name, god) {
                    return s(_("%1, Temple of %2"), temple_name, god);
                },
                large_temple_name: function(god) {
                    return s(_("Large Temple of %1"), god);
                },
                next_jump: function(date) {
                    return s(_("Next Jump:<br />%1"), date);
                },
                temple_protection_ends: function(date) {
                    return s(_("Protective Shield until:<br />%1"), date);
                },
                artifact_distribution: {
                    all_players: function(level, artifact_name) {
                        return s(ngettext(
                            "All players in the alliance will receive %1 level of the artifact %2.",
                            "All players in the alliance will receive %1 levels of the artifact %2.",
                            level
                        ), level, artifact_name);
                    },
                    top_players: function(amount) {
                        return s(ngettext(
                            "The top alliance member will receive additional artifact levels, based on their points.",
                            "The top %1 alliance members will receive additional artifact levels, based on their points.",
                            amount
                        ), amount);
                    },
                    top_players_additional: function(level) {
                        return s(ngettext(
                            "(%1 additional artifact level)",
                            "(%1 additional artifact levels)",
                            level
                        ), level);
                    },
                    top_players_level_0: function(amount, level, artifact_name) {
                        var text = amount === 1 ?
                            ngettext(
                                "The top alliance member will receive %2 level of the artifact %3.",
                                "The top alliance member will receive %2 levels of the artifact %3.",
                                level
                            ) :
                            ngettext(
                                "The top %1 alliance members will receive %2 level of the artifact %3.",
                                "The top %1 alliance members will receive %2 levels of the artifact %3.",
                                level
                            );

                        return s(text, amount, level, artifact_name);
                    }
                }
            }
        }
    });
}());