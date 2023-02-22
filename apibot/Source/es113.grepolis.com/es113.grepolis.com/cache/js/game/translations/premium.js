/*globals _, s, ngettext, DM, __ */

(function() {
    "use strict";

    DM.loadData({
        "l10n": {
            "premium": {
                "advisors": {
                    top_description: _("Use the services of the advisors now to benefit from the individual advantages each offers!"),
                    short_advantages: {
                        overviews: _("+11 Overviews"),
                        attack_planner: _("Attack planner"),
                        farm_town_overview: _("Farming villages overview")
                    },
                    ends: function(date) {
                        return s(_("End %1"), date);
                    },
                    not_activated: _("Not activated"),
                    duration: function(duration) {
                        return s(ngettext("%1 day", "%1 days", duration), duration);
                    },

                    duration2: function(duration) {
                        return s(ngettext("Duration: %1 day", "Duration: %1 days", duration), duration);
                    },

                    cost: function(cost) {
                        return s(ngettext("%1 gold", "%1 gold", cost), cost);
                    },

                    cost2: function(cost) {
                        return s(ngettext("Cost: %1 gold", "Cost: %1 gold", cost), cost);
                    },

                    extend_feature: _("Extend"),
                    activate_feature: _("Activate"),
                    activate_with_cost: function(cost) {
                        return s(_("Activate %1"), cost);
                    },
                    active_until: function(date) {
                        return s(_("<b>Active until:</b> %1"), date);
                    },
                    activate_advisor: function(days) {
                        return s(ngettext("<b>Activate for %1 day.</b>", "<b>Activate for %1 days.</b>", days), days);
                    },
                    checkbox_description: _("The premium features will be extended automatically as long as the check-box is activated."),
                    free: __("Zero Cost|Free"),
                    autoextension_not_active: _("Automatic extension is inactive. If active, the extension will happen around 2 days before the advisors will run out."),
                    autoextension_active: _("Automatic extension is active. The extension will happen around 2 days before the advisors will run out.")
                },

                /**
                 * Common
                 */
                common: {
                    window_title: _("Premium"),
                    disable_confirmation_window: _("Do not show this window again"),
                    available_gold: function(gold) {
                        return s(ngettext("Available gold: %1", "Available gold: %1", gold), gold);
                    },
                    wnd_not_enough_gold: {
                        header: _("Sorry, you don't have enough gold!"),
                        descr: {
                            buy_grepolympia_training_slot: _('This premium feature lets you expand the waiting queue for your training by one space.'),
                            buy_grepolympia_training_bonus: _('This premium feature lets your athlete train 20% more effectively for the next 24 hours.'),
                            unit_build_time: _("This premium feature allows you to halve the recruitment time for the selected recruitment order. You can use this for as many recruitment orders as you want."),
                            change_island_quest: _("You can use gold to refuse this island quest and immediately receive a new island quest. This feature is useful if you don't like an island quest's challenge or the offered reward."),
                            halve_cure_time: _("This premium feature allows you to halve the time needed for your hero to recover full health."),
                            buy_hero_slot: _("You can use gold to unlock another hero slot."),
                            extend_power: _("This premium feature lets you extend the Divine Power."),
                            buy_event_ingredient: _("With this premium feature, you can buy an additional ingredient which you can use to create a reward."),
                            call_new_heroes: _("With this premium feature, you can immediately get another offer of heroes."),
                            buy_inventory_slot: _("This premium feature lets you unlock an extra inventory slot."),
                            buy_curator: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            buy_trader: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            buy_priest: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            buy_commander: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            buy_captain: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            extend_curator: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            extend_trader: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            extend_priest: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            extend_commander: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            extend_captain: _("First replenish your gold supply to attain the services of one of the advisers!"),
                            celebrate_olympic_games: _("With this premium feature, you can start Olympic Games that will generate an additional cultural point for you."),
                            building_build_cost_reduction: function(reduction) {
                                return s(_("This premium feature lets you upgrade the building for %1% fewer resources."), reduction);
                            },
                            research_build_time: _("This premium feature allows you to halve the research time for the selected research order. You can use this as often as you want for any research order."),
                            instant_buy_buildings: _("This premium feature allows you to instantly finish the selected building process."),
                            instant_buy_technologies: _("This premium feature allows you to instantly finish the selected research process."),
                            instant_buy_units: _("This premium feature allows you to instantly finish the selected unit order.")
                        },
                        costs: _("Costs"),
                        gold: _("%1 gold"),
                        buy_now: _("Buy gold now!"),
                        advantage: _("Advantage"),
                        //Recruitment
                        recruit_time: _("Current recruitment time"),
                        reducted_recruit_time: _("Reduce the recruitment time by half"),
                        //Buuldings
                        build_time: _("Current building time"),
                        reducted_build_time: _("Reduce the building time by half"),
                        //Researches
                        research_time: _("Current research time"),
                        reducted_research_time: _("Reduce the research time by half"),

                        you_save: _("You save"),
                        duration: _("Duration"),
                        hours: function(hours) {
                            return s(ngettext("%1 hour", "%1 hours", hours), hours);
                        }
                    }
                },

                instant_buy_hero_heal: {
                    confirmation: {
                        window_title: _("Healing a hero"),
                        question: function(cost) {
                            return s(ngettext(
                                "Do you really want to heal your hero instantly for %1 gold?",
                                "Do you really want to heal your hero instantly for %1 gold?",
                                cost), cost);
                        }
                    }
                },

                halloween_buy_ingredient: {
                    confirmation: {
                        window_title: _("Buy ingredient"),
                        question: function(cost, ingredient_name) {
                            return s(ngettext("Do you really want to buy one additional ingredient of ‘%2’ for %1 gold?", "Do you really want to buy one additional ingredient of ‘%2’ for %1 gold?", cost), cost, ingredient_name);
                        }
                    }
                },

                instant_buy_units: {
                    confirmation: {
                        window_title: _("Finish unit recruitment"),
                        question: function(cost) {
                            return s(ngettext(
                                "Do you really want to finish this unit recruitment instantly for %1 gold?",
                                "Do you really want to finish this unit recruitment instantly for %1 gold?",
                                cost), cost);
                        }
                    }
                },

                resetting_research: {
                    confirmation: {
                        window_title: _("Reset the research"),
                        question: function() {
                            return ngettext(
                                "This action will cost you one culture point! Do you really want to reset this research?",
                                "This action will cost you one culture point! Do you really want to reset this research?",
                                1
                            );
                        }
                    }
                },

                finish_research_order: {
                    confirmation: {
                        window_title: _("Reduce the research time by half"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to cut the research time in half for %1 gold?",
                                "Are you sure you want to cut the research time in half for %1 gold?",
                                cost), cost);
                        }
                    }
                },

                immediate_call_phoenician_salesman: {
                    confirmation: {
                        window_title: _("Summon Phoenician merchant now?"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to summon the merchant for %1 gold?",
                                "Are you sure you want to summon the merchant for %1 gold?",
                                cost), cost);
                        }
                    }
                },

                /**
                 * Unit build time reduction
                 */
                unit_build_time: {
                    confirmation: {
                        barracks: {
                            window_title: _("Reduce the recruitment time by half"),
                            question: function(cost) {
                                return s(ngettext("Are you sure you want to cut the recruitment time in half for %1 gold?", "Are you sure you want to cut the recruitment time in half for %1 gold?", cost), cost);
                            }
                        },

                        docks: {
                            window_title: _("Cut the construction time in half"),
                            question: function(cost) {
                                return s(ngettext("Are you sure you want to cut the construction time in half for %1 gold?", "Are you sure you want to cut the construction time in half for %1 gold?", cost), cost);
                            }
                        }
                    },
                    tooltip: {
                        barracks: function(cost) {
                            return s(ngettext("You can cut the recruitment time in half for %1 gold.", "You can cut the recruitment time in half for %1 gold.", cost), cost);
                        },
                        docks: function(cost) {
                            return s(ngettext("You can cut the construction time in half for %1 gold.", "You can cut the construction time in half for %1 gold.", cost), cost);
                        }
                    }
                },

                /**
                 * Building build time reduction
                 */
                building_build_time: {
                    confirmation: {
                        window_title: _("Cut the construction time in half"),
                        question: function(cost) {
                            return s(ngettext("Are you sure you want to cut the construction time in half for %1 gold?", "Are you sure you want to cut the construction time in half for %1 gold?", cost), cost);
                        }
                    },
                    tooltip: function(cost) {
                        return s(ngettext("You can cut the construction time in half for %1 gold.", "You can cut the construction time in half for %1 gold.", cost), cost);
                    }
                },

                change_island_quest: {
                    confirmation: {
                        window_title: _("Rotate island quest"),
                        question: function(cost) {
                            return s(ngettext("Are you sure you want to exchange this island quest for %1 gold?", "Are you sure you want to exchange this island quest for %1 gold?", cost), cost);
                        }
                    }
                },

                skip_island_quest_cooldown: {
                    confirmation: {
                        window_title: _("Skip island quest cooldown"),
                        question: function(cost) {
                            return s(ngettext("Are you sure you want to skip the island quest cooldown for %1 gold?", "Are you sure you want to skip the island quest cooldown for %1 gold?", cost), cost);
                        }
                    }
                },

                building_order_halve_build_time: {
                    confirmation: {
                        window_title: _("Cut construction time in half"),
                        question: function(cost) {
                            return s(ngettext("Are you sure you want to cut the construction time in half for %1 gold?", "Are you sure you want to cut the construction time in halve for %1 gold?", cost), cost);
                        }
                    }
                },

                building_order_cancel: {
                    confirmation: {
                        window_title: function(demolish) {
                            return demolish ?
                                _("Cancel demolition order") :
                                _("Cancel the construction order");
                        },
                        question: function(demolish) {
                            return demolish ?
                                _("Are you sure you want to cancel the demolition order?") :
                                _("Are you sure you want to cancel the construction order?");
                        }
                    }
                },

                research_order_cancel: {
                    confirmation: {
                        window_title: _("Cancel research order"),
                        question: _("Are you sure you want to cancel the research order?")
                    }
                },

                unit_order_cancel: {
                    confirmation: {
                        window_title: _("Cancel unit order"),
                        question: _("Do you really want to cancel this unit order?")
                    }
                },

                waste_resources: {
                    confirmation: {
                        window_title: _("Not enough storage capacity"),
                        question: function(town_name) {
                            if (town_name) {
                                return s(_("You don't have enough storage capacity in %1. If you continue, you will lose the following resources:"), town_name);
                            } else {
                                return _("You don't have enough storage capacity. If you continue, you will lose the following resources:");
                            }
                        },
                        additional_question: _("Accept anyway?"),
                        god_resources: {
                            favor: _("Favor"),
                            fury: _("Fury")
                        }
                    }
                },

                waste_resources_multiple: {
                    confirmation: {
                        window_title: _("Multiple storage capacity problems"),
                        question: _("You don't have enough storage capacity in one or more of your cities. If you continue, you will lose a total of the following resources"),
                        additional_question: _("Accept anyway?")
                    }
                },

                waste_resources_farm_towns: {
                    confirmation: {
                        window_title: _("Multiple storage capacity problems"),
                        question: _("You may not have enough storage capacity in one or more of your cities. If you continue, you will lose some resources."),
                        additional_question: _("Accept anyway?")
                    }
                },

                found_city: {
                    confirmation: {
                        window_title: _("Found city"),
                        question: _("Do you want to found a city on this island? After the command has been given it cannot be canceled.")
                    }
                },

                halve_cure_time: {
                    confirmation: {
                        window_title: _("Halve resurrection time"),
                        question: function(cost) {
                            return s(ngettext("Are you sure you want to halve resurrection time for %1 gold?", "Are you sure you want to halve resurrection time for %1 gold?", cost), cost);
                        }
                    }
                },

                buy_hero_slot: {
                    confirmation: {
                        window_title: _("Unlock hero slot"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to spend %1 gold in order to unlock another hero slot?",
                                "Are you sure you want to spend %1 gold in order to unlock another hero slot?",
                                cost), cost);
                        }
                    }
                },

                extend_power: {
                    confirmation: {
                        window_title: function(power_name) {
                            return s(_("Extend divine power \"%1\""), power_name);
                        },
                        question: function(power_name, cost) {
                            return s(
                                _("Are you sure that you want to extend the divine power \"%1\" for %2 gold?"),
                                power_name,
                                cost
                            );
                        }
                    }
                },

                buy_grepolympia_training_slot: {
                    confirmation: {
                        window_title: _('Expand the waiting queue for your training'),
                        question: {
                            part1: function(cost) {
                                return s(ngettext(
                                    'Are you sure you want to expand the waiting queue for your training by one more space for %1 gold?',
                                    'Are you sure you want to expand the waiting queue for your training by one more space for %1 gold?',
                                    cost), cost);
                            },
                            part2: _('Note: Additional training spaces are only valid for the current discipline and athlete. As soon as the next discipline starts, these spaces become invalid and have to be unlocked again.')
                        }
                    }
                },
                buy_grepolympia_training_bonus: {
                    confirmation: {
                        window_title: _('Activate training bonus'),
                        question: function(cost) {
                            return s(ngettext(
                                'Are you sure you want to activate the training bonus for %1 gold?',
                                'Are you sure you want to activate the training bonus for %1 gold?',
                                cost), cost);
                        }
                    }
                },

                buy_event_ingredient: {
                    confirmation: {
                        window_title: _("Buy ingredient"),
                        question: function(cost, ingredient_name) {
                            return s(ngettext(
                                "Do you really want to buy one additional ingredient of '%2' for %1 gold?",
                                "Do you really want to buy one additional ingredient of '%2' for %1 gold?",
                                cost), cost, ingredient_name);
                        }
                    }
                },

                halloween_buy_recipe: {
                    confirmation: {
                        window_title: _("Buy recipe"),
                        question: function(cost) {
                            return s(ngettext(
                                "Do you really want to buy a random recipe for the selected reward for %1 gold? Please keep in mind that the recipe might be of a random level of that reward.",
                                "Do you really want to buy a random recipe for the selected reward for %1 gold? Please keep in mind that the recipe might be of a random level of that reward.", cost), cost);
                        }
                    }
                },

                call_new_heroes: {
                    confirmation: {
                        window_title: _("Swap now"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure that you want to spend %1 gold to immediately get another offer of heroes?",
                                "Are you sure that you want to spend %1 gold to immediately get another offer of heroes?", cost), cost);
                        }
                    }
                },

                buy_inventory_slot: {
                    confirmation: {
                        window_title: _("Buy an extra slot"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to buy an extra slot for %1 gold?",
                                "Are you sure you want to buy an extra slot for %1 gold?", cost), cost);
                        }
                    }
                },
                remove_inventory_item: {
                    confirmation: {
                        window_title: _("Remove item"),
                        question: function(item_name) {
                            return s(_("Are you sure you wish to remove item %1?"), item_name);
                        }
                    }
                },

                /**
                 * Activating curators
                 */
                buy_curator: {
                    confirmation: {
                        window_title: _("Activate the administrator"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to activate the administrator for %1 gold?",
                                "Are you sure you want to activate the administrator for %1 gold?", cost), cost);
                        }
                    }
                },
                buy_trader: {
                    tooltip: function(cost) {
                        return s(ngettext(
                            "You can summon the merchant for %1 gold!",
                            "You can summon the merchant for %1 gold!", cost), cost);
                    },
                    confirmation: {
                        window_title: _("Activate the merchant"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to activate the merchant for %1 gold?",
                                "Are you sure you want to activate the merchant for %1 gold?", cost), cost);
                        }
                    }
                },

                buy_priest: {
                    confirmation: {
                        window_title: _("Activate the high priestess"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to activate the high priestess for %1 gold?",
                                "Are you sure you want to activate the high priestess for %1 gold?", cost), cost);
                        }
                    }
                },

                buy_commander: {
                    confirmation: {
                        window_title: _("Activate the commander"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to activate the commander for %1 gold?",
                                "Are you sure you want to activate the commander for %1 gold?", cost), cost);
                        }
                    }
                },

                buy_captain: {
                    confirmation: {
                        window_title: _("Activate the captain"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to activate the captain for %1 gold?",
                                "Are you sure you want to activate the captain for %1 gold?", cost), cost);
                        }
                    }
                },

                /**
                 * Extending curators
                 */
                extend_curator: {
                    confirmation: {
                        window_title: _("Extend the administrator"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to extend the administrator for %1 gold?",
                                "Are you sure you want to extend the administrator for %1 gold?", cost), cost);
                        }
                    }
                },
                extend_trader: {
                    confirmation: {
                        window_title: _("Extend the merchant"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to extend the merchant for %1 gold?",
                                "Are you sure you want to extend the merchant for %1 gold?", cost), cost);
                        }
                    }
                },

                extend_priest: {
                    confirmation: {
                        window_title: _("Extend the high priestess"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to extend the high priestess for %1 gold?",
                                "Are you sure you want to extend the high priestess for %1 gold?", cost), cost);
                        }
                    }
                },

                extend_commander: {
                    confirmation: {
                        window_title: _("Extend the commander"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to extend the commander for %1 gold?",
                                "Are you sure you want to extend the commander for %1 gold?", cost), cost);
                        }
                    }
                },

                extend_captain: {
                    confirmation: {
                        window_title: _("Extend the captain"),
                        question: function(cost) {
                            return s(ngettext(
                                "Are you sure you want to extend the captain for %1 gold?",
                                "Are you sure you want to extend the captain for %1 gold?", cost), cost);
                        }
                    }
                },

                building_build_cost_reduction: {
                    confirmation: {
                        window_title: _("Construction cost reduction"),
                        question: function(reduction, cost) {
                            return s(ngettext(
                                "Are you sure you want to upgrade this building with %2% fewer resources for %1 gold?",
                                "Are you sure you want to upgrade this building with %2% fewer resources for %1 gold?", cost), cost, reduction);
                        }
                    }
                },

                celebrate_olympic_games: {
                    confirmation: {
                        window_title: _("Olympic Games"),
                        question: function(cost) {
                            return s(ngettext(
                                "Do you really want to hold the Olympic Games for %1 gold?",
                                "Do you really want to hold the Olympic Games for %1 gold?", cost), cost);
                        }
                    }
                },

                enlist_militia: {
                    confirmation: {
                        window_title: _("Militia"),
                        question: _("Should the militia now be enlisted?")
                    }
                },

                delete_map_bookmark: {
                    confirmation: {
                        window_title: _("Delete location"),
                        question: function(bookmark_name) {
                            return s(_("Are you sure you want to delete the location '%1'"), bookmark_name);
                        }
                    }
                },

                unassign_hero_from_attack: {
                    confirmation: {
                        window_title: _("Unassign heroes"),
                        question: _("Do you really want to withdraw your hero from this attack?")
                    }
                },

                unassign_hero: {
                    confirmation: {
                        window_title: _("Unassign heroes"),
                        question: _("Do you really want to unassign this hero from your city?")
                    }
                },

                delete_town_group: {
                    confirmation: {
                        window_title: _("Confirm deletion"),
                        question: function(town_group_name) {
                            return s(_("Really delete the group '%1'?"), town_group_name);
                        }
                    }
                },

                research_build_time: {
                    confirmation: {
                        window_title: _("Reduce the research time by half"),
                        question: function(cost) {
                            return s(ngettext("Are you sure you want to cut the research time in half for %1 gold?", "Are you sure you want to cut the research time in half for %1 gold?", cost), cost);
                        }
                    }
                },

                instant_buy_technologies: {
                    confirmation: {
                        window_title: _("Finish research"),
                        question: function(cost) {
                            return s(ngettext(
                                "Do you really want to finish this research instantly for %1 gold?",
                                "Do you really want to finish this research instantly for %1 gold?", cost), cost);
                        }
                    }
                },

                instant_buy_buildings: {
                    confirmation: {
                        window_title: {
                            constructing: _("Finish building construction"),
                            demolishing: _("Finish building demolition")
                        },
                        question: {
                            constructing: function(cost) {
                                return s(ngettext(
                                    "Do you really want to finish this building construction instantly for %1 gold?",
                                    "Do you really want to finish this building construction instantly for %1 gold?", cost), cost);
                            },

                            demolishing: function(cost) {
                                return s(ngettext(
                                    "Do you really want to demolish this building instantly for %1 gold?",
                                    "Do you really want to demolish this building instantly for %1 gold?", cost), cost);
                            }
                        }
                    }
                },

                hero_heal_instant_buy: {
                    confirmation: {
                        window_title: _("Healing a hero"),
                        question: function(cost) {
                            return s(ngettext(
                                "Do you really want to heal your hero instantly for %s gold?",
                                "Do you really want to heal your hero instantly for %s gold?", cost), cost);
                        }
                    }
                },

                buy_vacation_days: {
                    confirmation: {
                        window_title: _("Buy vacation days"),
                        question: function(days, cost) {
                            return s(ngettext(
                                "Do you want to buy %1 vacation day for %2 gold?",
                                "Do you want to buy %1 vacation days for %2 gold?", days), days, cost);
                        }
                    }
                },

                cast_vote: {
                    confirmation: {
                        window_title: _("Casting your vote"),
                        question: function() {
                            return _("Are you sure that you want to send your vote? You can no longer change your selections after the vote is cast.");
                        }
                    }
                },

                attacking_on_alliance_member: {
                    confirmation: {
                        window_title: _("Attack on an alliance member"),
                        question: _("Are you sure you want to attack a member of your own alliance?")
                    }
                },

                return_all_units: {
                    confirmation: {
                        window_title: _("Return all units"),
                        question: function(has_selected_cities) {
                            return has_selected_cities ? _("Do you want to return all units from the selected cities?") :
                                _("Do you want to return all units to their home cities?");
                        }
                    }
                },

                return_all_units_from_town: {
                    confirmation: {
                        window_title: _("Return all units"),
                        question: _("Do you want to return all units from this city?")
                    }
                },

                premium_exchange_confirm_order: {
                    confirmation: {
                        window_title: _("Gold exchange purchase"),
                        question: function(resource, resource_type, cost) {
                            var texts = {
                                wood: s(_("Do you really want to buy %1 wood for %2 gold?"), resource, cost),
                                iron: s(_("Do you really want to buy %1 silver coins for %2 gold?"), resource, cost),
                                stone: s(_("Do you really want to buy %1 stone for %2 gold?"), resource, cost)
                            };

                            return texts[resource_type];
                        }
                    }
                },
                ares_sacrifice_not_enough_population: {
                    confirmation: {
                        question: _("You dont have enough unit population to get the full effect of the spell. Are you sure you want cast the spell?")
                    }
                },
                log_out: {
                    confirmation: {
                        window_title: _("Log out"),
                        question: _("Do you really want to log out?")
                    }
                }
            }
        }
    });
}());