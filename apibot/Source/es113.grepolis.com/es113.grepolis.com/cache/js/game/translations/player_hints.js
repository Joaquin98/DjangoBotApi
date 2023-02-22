/* global _, DM, HelperEaster */
(function() {
    "use strict";

    DM.loadData({
        l10n: {
            player_hints: {
                settings: {
                    instant_buy_hero_heal: _("Instantly healing heroes"),
                    halloween_buy_recipe: _("Buy recipes (Halloween 2014)"),
                    halloween_buy_ingredient: _("Buy ingredients (Halloween 2014)"),
                    halloween_collect: _("Dropped ingredients (Halloween 2014)"),
                    instant_buy_units: _("Instantly finishing unit orders"),
                    instant_buy_technologies: _("Instantly finishing researches"),
                    instant_buy_buildings: _("Instantly finishing building orders"),
                    buy_or_extend_advisor: _("Activating or extending advisors"),
                    building_build_time: _("Halving construction times for buildings"),
                    unit_build_time: _("Halving unit recruitment times"),
                    research_build_time: _("Halving research times"),
                    building_build_cost_reduction: _("Constructing with reduced costs"),
                    halve_cure_time: _("Healing heroes"),
                    gold_trade: _("Trading with gold"),
                    extend_power: _("Extending powers"),
                    change_island_quest: _("Rotating island quests"),
                    skip_island_quest_cooldown: _("Skipping island quest cooldown"),
                    buy_inventory_slot: _("Adding new inventory slots"),
                    buy_hero_slot: _("Unlocking new hero slots"),
                    call_new_heroes: _("Rotating offered heroes"),
                    buy_vacation_days: _("Buying additional vacation days"),
                    celebrate_olympic_games: _("Celebrating olympic games"),
                    immediate_call_phoenician_salesman: _("Summoning the phoenician merchant"),
                    waste_resources: _("Warning in case of potential loss of resources, favor, or fury"),
                    map_beginners_protection: _("Show beginner's protection"),
                    map_last_attack_smoke: _("Show smoke after attack"),
                    map_revolt_conquest_fires: _("Show revolts or sieges as burning cities"),
                    map_casual_world_blessing: _("Show blessing of Tyche"),
                    found_city: _("Founding a city"),
                    waste_units_from_unit_training_boost: _("Activating unit reinforcements despite insufficient population"),
                    god_selection_confirmation: _("Change god confirmation prompt"),
                    attacking_on_alliance_member: _("Warning when attacking an alliance member"),
                    delete_all_market_offers: _("Delete all market offers (current page)"),
                    return_all_units: _("Return all units (all towns)"),
                    return_all_units_from_town: _("Return all units (single city)"),
                    premium_exchange_confirm_order: _("Gold exchange purchase order"),
                    cast_spell_confirmation_town: _("Cast spell confirmation prompt on town"),
                    cast_spell_confirmation_command: _("Cast spell confirmation prompt on command"),
                    ares_sacrifice_not_enough_population: _("Warning if there are not enough units for Ares sacrifice"),

                    grepolympia_buy_slot: function(is_skinned) {
                        if (is_skinned === true) {
                            var GrepolympiaHelper = require('events/grepolympia/helpers/grepolympia'),
                                l10n = GrepolympiaHelper.getl10nForPlayerHints();

                            return l10n.grepolympia_buy_slot;
                        }
                    },

                    grepolympia_reset_skills: function(is_skinned) {
                        if (is_skinned === true) {
                            var GrepolympiaHelper = require('events/grepolympia/helpers/grepolympia'),
                                l10n = GrepolympiaHelper.getl10nForPlayerHints();

                            return l10n.grepolympia_reset_skills;
                        }
                    },

                    grepolympia_extra_attempt: function(is_skinned) {
                        if (is_skinned === true) {
                            var GrepolympiaHelper = require('events/grepolympia/helpers/grepolympia'),
                                l10n = GrepolympiaHelper.getl10nForPlayerHints();

                            return l10n.grepolympia_extra_attempt;
                        }
                    },

                    grepolympia_training_boost: function(is_skinned) {
                        if (is_skinned === true) {
                            var GrepolympiaHelper = require('events/grepolympia/helpers/grepolympia'),
                                l10n = GrepolympiaHelper.getl10nForPlayerHints();

                            return l10n.grepolympia_training_boost;
                        }
                    },

                    easter_buy_ingredient: function(is_skinned) {
                        if (is_skinned === true) {
                            return HelperEaster.getSkinl10n().player_hints.settings.easter_buy_ingredient;
                        }
                    },

                    easter_collect: function(is_skinned) {
                        if (is_skinned === true) {
                            return HelperEaster.getSkinl10n().player_hints.settings.easter_collect;
                        }
                    },

                    easter_buy_recipe: function(is_skinned) {
                        if (is_skinned === true) {
                            return HelperEaster.getSkinl10n().player_hints.settings.easter_buy_recipe;
                        }
                    },

                    tasks_event_reduction_mechanic: function(is_skinned) {
                        if (is_skinned === true) {
                            var BenefitHelper = require('helpers/benefit');

                            return BenefitHelper.getl10nForSkin(
                                DM.getl10n('player_hints'),
                                'player_hints'
                            ).tasks_event_reduction_mechanic;
                        }
                    },

                    missions_swap_mission: function(is_skinned) {
                        if (is_skinned === true) {
                            var MissionsHelper = require('events/missions/helpers/missions'),
                                l10n = MissionsHelper.getl10nForMissionSkin();

                            return l10n.player_hints.settings.swap_mission;
                        }
                    },

                    missions_boost_mission: function(is_skinned) {
                        if (is_skinned === true) {
                            var MissionsHelper = require('events/missions/helpers/missions'),
                                l10n = MissionsHelper.getl10nForMissionSkin();

                            return l10n.player_hints.settings.boost_mission;
                        }
                    },

                    missions_skip_cooldown: function(is_skinned) {
                        if (is_skinned === true) {
                            var MissionsHelper = require('events/missions/helpers/missions'),
                                l10n = MissionsHelper.getl10nForMissionSkin();

                            return l10n.player_hints.settings.skip_cooldown;
                        }
                    },

                    missions_buy_event_units: function(is_skinned) {
                        if (is_skinned === true) {
                            var MissionsHelper = require('events/missions/helpers/missions'),
                                l10n = MissionsHelper.getl10nForMissionSkin();

                            return l10n.player_hints.settings.buy_units;
                        }
                    },

                    collected_items: function(is_skinned) {
                        if (is_skinned === true) {
                            var BenefitHelper = require('helpers/benefit'),
                                l10n = BenefitHelper.getl10nForSkin({}, 'player_hints');

                            return l10n.settings.collected_items;
                        }
                    },

                    assassins_buy_arrows: function(is_skinned) {
                        if (is_skinned === true) {
                            var BenefitHelper = require('helpers/benefit'),
                                l10n = DM.getl10n('player_hints');

                            l10n = BenefitHelper.getl10nForSkin(l10n, 'player_hints');

                            return l10n.buy_arrows;
                        }
                    },

                    advent_buy_refill: function(is_skinned) {
                        if (is_skinned === true) {
                            var BenefitHelper = require('helpers/benefit'),
                                l10n = DM.getl10n('player_hints');

                            l10n = BenefitHelper.getl10nForSkin(l10n, 'player_hints');

                            return l10n.settings.advent_buy_refill;
                        }
                    },

                    advent_buy_spin: function(is_skinned) {
                        if (is_skinned === true) {
                            var BenefitHelper = require('helpers/benefit'),
                                l10n = DM.getl10n('player_hints');

                            l10n = BenefitHelper.getl10nForSkin(l10n, 'player_hints');

                            return l10n.settings.advent_buy_spin;
                        }
                    },

                    buy_event_currency: function(is_skinned) {
                        if (is_skinned === true) {
                            var BenefitHelper = require('helpers/benefit'),
                                l10n = DM.getl10n('player_hints');

                            l10n = BenefitHelper.getl10nForSkin(l10n, 'player_hints');

                            return l10n.buy_event_currency;
                        }
                    }
                }
            }
        }
    });
}());