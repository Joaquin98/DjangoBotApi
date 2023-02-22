/*global _, __, ngettext, s, DM */

(function() {
    "use strict";

    DM.loadData({
        'l10n': {
            'COMMON': {
                no_building: {
                    not_available: _('not available'),
                    requirements: _('Requirements:'),
                    building_name_level: _('%1: Level %2')
                },

                ok: _('OK'),
                prev_lowercase: _("previous"),
                next_lowercase: _("next"),
                close_lowercase: _("close"),
                close_all: _("Close all windows"),
                internal_error: _('An internal error has occurred!'),
                dont_show_this_window_again: _('Do not show this window again'),

                building_view: function(building_name, town_name) {
                    return s(_('%1 (%2)'), building_name, town_name);
                },
                server_time: _('Server time'),
                jump_to_current_town: _('Jump to current city<br />(spacebar)'),
                jump_to_coordinates: _('Jump to these coordinates'),
                save_coordinates: _('Save location'),
                no_coordinates_saved: _('No entries'),
                strategic_map: _('Switch to strategic map'),
                island_view: _('Switch to island view'),
                town_overview: _('Switch to city view'),
                no_results: _('No results'),
                wnd_color_table: {
                    wnd_title: _('Colors'),
                    btn_tooltip: _('Color assignments')
                },
                ocean_number_tooltip: _("Ocean number"),
                game: {
                    default_confirm_caption: _('Yes'),
                    default_cancel_caption: _('No'),
                    toggle_spend_gold_confirmation: _('Do not show this window again')
                },
                wnd_goto_page: {
                    title: _('Go to page'),
                    page: _('Page'),
                    btn_confirm: _('OK')
                },
                wnd_save_coordinates: {
                    title: _('Save location'),
                    fields: {
                        title: {
                            label: _('Title:'),
                            value: _('Please enter a title.')
                        },
                        x: {
                            label: _('X:')
                        },
                        y: {
                            label: _('Y:')
                        }
                    },
                    btn_confirm: _('Add')
                },

                simulator: {
                    night_bonus: _("If your troops attack a city at night, the defender receives a +100% defense bonus."),
                    commander: _("The commander will increase the combat power of land units by 20%."),
                    captain: _("The captain will increase the combat power of sea units by 20%."),
                    priestess: _("The high priestess will increase the combat power of mythical units by 20%."),
                    tower: _("A mighty guard tower increases the defensive strength of your troops by 10% and turns your polis into a nearly invincible stronghold against attackers."),
                    insert_survivors: _("Add the defender's remaining units again"),
                    flip_troops: _("Swap attacking and defending units"),
                    alliance_modifier: function(modifier) {
                        return s(_("Alliance reductions: Attacking allied troops generates %1% of the total battle points."), modifier);
                    },
                    ghost_units_fought: function(type, fought) {
                        return s(_("%1 ghost %2 fought, %1 died"), fought, type);
                    },
                    ghost_units_fought_and_disappeared: function(type, fought, lost, disappeared) {
                        return s(
                            _("%1 ghost %2 fought, %3 died, %4 disappeared after the battle"),
                            fought,
                            type,
                            lost,
                            disappeared
                        );
                    }
                },

                heroes: {
                    assign: _('Assign'),
                    unassign: _('Unassign'),
                    change: _('Change'),
                    is_injured: _('Currently injured'),
                    is_attacking: _('Currently in an attack'),
                    is_assigned_to_town: function(town_name) {
                        return s(_('Already assigned: %1'), '<br>' + town_name);
                    },
                    is_transfering_to_town: _('Being assigned'),
                    is_transfering_to_game: _('Is entering the world'),
                    is_transfering_to_master: _('Is leaving the world')
                },
                'time': {
                    'day': __('day|d'),
                    'hour': __('hour|h'),
                    'minute': __('minute|min'),
                    'second': __('second|s')
                },
                'window_goto_page': {
                    'title': _('Go to page'),
                    'page': _('Page'),
                    'btn_confirm': _('OK')
                },
                'gui': {
                    'btn_confirm': _('Yes'),
                    'btn_cancel': _('No'),
                    'btn_buy': _('Buy')
                },
                'error': {
                    'msg_too_long': _('This may not exceed %n characters.'),
                    'msg_attack_unit_limitation': _('Only %1 %2 per command possible'),
                    cors_error_message: function(url, master_url, wiki_url) {
                        return s(_("Access to Image at <a href='%1'>%1</a> from origin <a href='%2'>%2</a> has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin <a href='%2'>%2</a> is therefore not allowed access.<br>Read more about that in our wiki: <a href='%3'>%3</a>"), url, master_url, wiki_url);
                    }
                },
                'premium': {
                    'unit_build_time_reduction': {
                        'recruit_time_barracks': _('Reduce the recruitment time by half'),
                        'recruit_time_docks': _('Cut the construction time in half'),
                        'recruit_time_checkbox': _('Do not show this window again'),

                        'question_barracks': _('Are you sure you want to cut the recruitment time in half for %1 gold?'),
                        'question_barracks_plural': _('Are you sure you want to cut the recruitment time in half for %1 gold?'),
                        'question_docks': _('Are you sure you want to cut the construction time in half for %1 gold?'),
                        'question_docks_plural': _('Are you sure you want to cut the construction time in half for %1 gold?'),
                        'tooltip_barracks': _('You can cut the recruitment time in half for %1 gold.'),
                        'tooltip_barracks_plural': _('You can cut the recruitment time in half for %1 gold.'),
                        'tooltip_docks': _('You can cut the construction time in half for %1 gold.'),
                        'tooltip_docks_plural': _('You can cut the construction time in half for %1 gold.'),
                        'available_gold': _('Available gold: %1'),
                        'available_gold_plural': _('Available gold: %1')
                    },

                    /* @old_city_overview */
                    'building_build_cost_reduction': {
                        'wnd_confirm_title': _('Construction cost reduction'),
                        'wnd_confirm_descr': _('Are you sure you want to upgrade this building with %2 fewer resources for %1 gold?'),
                        'wnd_not_enough_gold': {
                            'title': _('Construction cost reduction'),
                            'descr': _('This premium feature lets you upgrade the building for %1 fewer resources.'),
                            'resources': _('You save:')
                        }
                    },
                    /* @old_city_overview */

                    'confirmation_window_title': _('Confirmation window'),
                    'disable_confirmation_window': _('Do not show this window again'),
                    'not_enough_gold_window_title': _('Not enough gold'),
                    'not_enough_gold_message': _("Sorry, you don't have enough gold."),
                    'btn_buy_more_gold': _('Buy gold.'),
                    'not_enough_gold_window_text': _("Unfortunately, you don't have enough gold to buy this item."),
                    'not_enough_gold_button_caption': _('Buy gold now!'),
                    'buy_additional_slot_question': _('Are you sure you want to unlock this slot for %d gold?'),
                    'btn_confirm_caption': _('Yes'),
                    'btn_cancel_caption': _('No'),
                    'gold_amount': _('%1 gold'),
                    'cost': _('Costs'),
                    'buy_gold': _('Buy gold now!'),
                    'heroes_buy_slot': {
                        'title': _('Buy an extra slot'),
                        'descr': _('Would you like to buy an extra slot for %1 gold?'),
                        'not_enough_gold_title': _("Sorry, you don't have enough gold!"),
                        'not_enough_gold_message': _('This premium feature lets you unlock an extra hero slot.'),
                        'buy_gold': _('Buy gold now!'),
                        'cost': _('Costs')
                    },
                    'easter_buy_hen': {
                        'wnd_confirm_title': _('Buy a second chicken'),
                        'wnd_confirm_question': _('Are you sure you want to buy a second chicken for %d gold?'),
                        'wnd_confirm_question_plural': _('Are you sure you want to buy a second chicken for %1 gold?'),
                        'wnd_not_enough_gold': {
                            'title': _('Buy a second chicken')
                        }
                    }
                }, // premium
                /* @todo the main_menu seems to be not used */
                'main_menu': {
                    'messages': _('Messages'),
                    'reports': _('Reports'),
                    'alliance': _('Alliance'),
                    'allianceforum': _('Alliance forum'),
                    'settings': _('Settings'),
                    'profil': _('Profile'),
                    'ranking': _('Ranking'),
                    'help': _('Help')
                },
                'skip_tutorial': {
                    'button_caption': _('Disable tutorial arrows'),
                    'button_tooltip': _('<b>Disable tutorial arrows</b><br/>If you disable the tutorial arrows, all automatic arrows and indicators will be turned off. <br/> You can still complete all quests and collect their rewards.'),
                    'confirmation': {
                        'window_title': _('Disable tutorial arrows'),
                        'question': _('Are you sure you want to deactivate all tutorial arrows?<br /><br /><i>You can reactivate the arrows in the Settings menu under the Quests link.</i>')
                    }
                },
                'clear_selected_spell': _("Clear selected spell"),
                'city_skins_overview': {
                    'active': _('Active'),
                    'locked': _('Locked'),
                    'select': _('Select'),
                    'skins': {
                        'default': _('Default'),
                        'ten_anniversary': _('Ten Years Loyalty'),
                        'world_wonders': _('World Wonders'),
                        'domination': _('Domination'),
                        'olympus': _('Olympus')
                    }
                }
            }, // COMMON
            'common': {
                'label_favor': _('%1 favor'),
                'label_fury': _('%1% of Fury at time of casting (%2 Fury)'),
                'label_fury_percentage': _('%1% of current Fury'),
                'ghost_town': _('Ghost town'),
                'question_powers_extend_first_time': function(hours, gold, readable_time) {
                    return s(
                        ngettext(
                            'For %1 gold, you can extend this power by %2 the first time you use it.',
                            'For %1 gold, you can extend this power by %2 the first time you use it.',
                            hours
                        ),
                        gold,
                        readable_time
                    );
                },
                'question_powers_extend_second_time': function(hours, readable_time) {
                    return s(
                        ngettext(
                            'The second time, by %1.',
                            'The second time, by %1.',
                            hours
                        ),
                        readable_time
                    );
                },
                'limit_per_city': _('Limit per city'),
                'max_population_boost': _('Max. +%1 population'),
                'senate': {
                    'main': {
                        'building': {
                            'build': _('Build'),
                            'upgrade': _('Upgrade to %1'),
                            'upgrade_plural': _('Upgrade to %1')
                        }
                    }
                },
                'capacity_bar': _("Capacity: ")
            }, // common
            'olympus': {
                olympus_via_portal: _("Olympus via Portal")
            }
        } // l10n
    });
}());