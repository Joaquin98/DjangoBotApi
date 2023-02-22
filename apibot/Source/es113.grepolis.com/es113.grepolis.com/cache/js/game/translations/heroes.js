/*globals _, __, _literal, s, DM */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            heroes: {
                window_title: _('Council of Heroes'),
                tabs: [_('Overview'), _('Transfer'), _('In this city'), _('Recruitment'), _('Collection')],
                common: {
                    level: function(level) {
                        return s(_('Level: %1'), level);
                    },
                    open_slot: function(price) {
                        return s(_('Open slot %1'), price);
                    },
                    open_slot_permanetly: _('Permanently unlock hero slot:'),
                    healthy: _('Healthy'),
                    arrival: _('Arrival:'),
                    assignation: _('Arrival:'),
                    departure: _('Departure:'),
                    hero_not_assigned: _('This hero is unassigned'),
                    free_hero_slot: s(_('You may bring a hero into your service. %1 Transfer a hero from another world or recruit a new hero.'), '<br />'),
                    not_enough_culture_points: function(points) {
                        return s(_('Reach cultural level %1'), points);
                    },
                    no_hero_assigned_to_world: _('No heroes on this world'),
                    hero_of: {
                        war: _('Hero of War'),
                        wisdom: _('Hero of Wisdom')
                    },
                    click_to_open_hero_cuncil: _('Click this icon to get to the heroes window.'),
                    recruting: _('Recruiting')
                },

                attack_window: {
                    can_not_attck_injured: _("This hero is currently wounded and cannot attack."),
                    can_not_attack_attacking: _('This hero is already attacking'),
                    no_hero_in_town: _("There is no hero assigned to this town."),
                    hero_is_being_assigned: _("This hero is currently not available for attack, as he/she is being assigned to the current town.")
                },

                overview: {
                    title: _('Your heroes'),
                    btn_recruit: _('Recruit'),
                    btn_recruit_tooltip: _('This slot is available. Click here to recruit a hero.'),
                    btn_assign: _('Assign'),
                    btn_assign_tooltip: _('Assigns this hero to your current town.'),
                    btn_assign_tooltip_disabled: _('Another hero is already assigned to your current town.'),
                    btn_unassign: _('Unassign'),
                    btn_unassign_tooltip: _('Withdraws this hero from his assigned town.'),
                    tooltip_cancel_transfer: _('Cancel transfer'),
                    hero_is_not_injured: _('The hero is currently unwounded '),
                    btn_level_hero: _('Help this hero to reach the next level.'),
                    btn_level_hero_max: _('This hero has already reached the maximum level.'),
                    btn_level_hero_in_attack: _('This hero is moving to attack and thus cannot be trained right now.'),
                    btn_send_resources: _('Send resources'),
                    can_not_halve_cure_time: _("Reducing the regeneration time is no longer possible for this hero."),
                    slot_choice: _literal('- ') + _('or') + _literal(' -'),
                    max: _('Maximum'),
                    btn_cancel_town_travel_tooltip: _('Cancels the current assignment.'),
                    tooltip_experience_bar: _('Current experience / Required experience'),
                    tooltip_max_experience: _('This hero already reached the maximum level and can no longer gain experience.'),
                    tooltip_health_bar: _('The hero is wounded and cannot take part in battle until fully healed.'),
                    instant_buy: {
                        caption: _('Wounded hero'),
                        healing_time: _('Healing time:'),
                        completion: _('Completion:'),
                        hint: _('<b>Hint:</b> You can not heal your hero 5 minutes before an incoming attack.'),
                        action: _('Heal now!')
                    },
                    bandits_camp: _('Bandits Camp'),
                    hero_level_desc: _('From highest to lowest level'),
                    city_name_asc: _('By city name (A-Z)'),
                    hero_name_asc: _('By hero name (A-Z)'),
                    hero_type: _('Type of hero')
                },

                transfer: {
                    title_heroes_on_this_world: _('Heroes in this world'),
                    title_heroes_on_different_worlds: _('Heroes in other worlds'),
                    world: _('World:'),
                    sort_by: _('Sort:'),
                    hero_name: _('Name'),
                    game_world: _('World'),
                    tooltip_send_to_master: _('Send hero back from this world'),
                    tooltip_send_to_game: _('Send hero to this world'),
                    tooltip_cancel_transfer: _('Cancel transfer')
                },

                council: {
                    info: {
                        title: _('Recruiting'),
                        description: _('Once a day you will be offered two new, randomly selected heroes that you can recruit. As far as possible, this will always be one Hero of War and one Hero of Wisdom.'),
                        description_recruited_all_heroes: _('There are no more heroes available. You already own all heroes!'),
                        new_hero_in: _('New heroes in:')
                    },
                    no_heroes: {
                        title: _('Hero selection'),
                        description: _('Currently, there are no heroes offering their service to you.')
                    },
                    hero_card: {
                        hire_hero: _('Recruit')
                    },
                    exchange_currency: {
                        window_title: _('Coin exchange'),
                        save: __('verb|Exchange'),
                        description: _('You can exchange Coins of War with Coins of Wisdom or vice versa'),
                        ratio_label: _('Ratio'),
                        tooltip_coins: _('Complete island quests to earn more coins.'),
                        tooltip_coins_of_war: _('Coins of War'),
                        tooltip_coins_of_wisdom: _('Coins of Wisdom')
                    },
                    mouse_popup: {
                        call_hero_for_gold: {
                            idle: function(gold) {
                                return s(_('For %1 gold you can instantly change the offered heroes to get another random offer.'), gold);
                            },
                            disabled: _('You already own all heroes and cannot recruit another one.')
                        },
                        recruit_hero: _('Recruit this hero by spending the required amount of Coins of War or Coins of Wisdom.')
                    },
                    //@todo: translate
                    call_heroes: _('Call'),
                    discard_heroes: _('Decline heroes'),
                    exchange_button: _('Coin exchange'),
                    calling: _('Swap now'),
                    not_enough: {
                        coins_of_war: _("You do not have enough Coins of War to recruit this hero. Complete Island Quests to acquire more coins."),
                        coins_of_wisdom: _("You do not have enough Coins of Wisdom to recruit this hero. Complete Island Quests to acquire more coins."),
                        slots: _("You do not have a free hero slot at the moment. Reach the next culture level to unlock an additional slot.")
                    }
                },

                collection: {
                    title: _('Assign your heroes'),
                    heroes: _('Heroes')
                },

                layout_heroes_overview: {
                    heroes: _('Heroes'),
                    new_feature: _('New!'),
                    tooltips: {
                        comming_soon: _('Here you will soon be able to use our latest new feature: Heroes!'),
                        say_hi: _('Click here to find out more about the new heroes!'),
                        hero_is_attacking: _('This hero is currently attacking:')
                    }
                },
                heroes_welcome: {
                    window_title: _('Council of Heroes'),
                    welcome_text: {
                        with_andromeda: s(_('The heroes of ancient Greece are celebrating their arrival in Grepolis. Win these mighty heroes to your cause and use them in battle against your enemies. %1 Explore your island for exciting quests and complete the challenges to earn valuable Coins of Wisdom and War. You can use these coins to recruit new heroes. %2 Become the most powerful of all the rulers by winning popularity with all the heroes now!'), '<br /><br />', '<br /><br />'),
                        without_andromeda: s(_('Become the most powerful of all the rulers by winning the popularity of all the heroes now! %1 Explore your island for exciting quests and complete the challenges to earn valuable Coins of Wisdom and War. You can use these coins to recruit new heroes. %2 Complete a total of 20 quests to obtain your first hero:'), '<br /><br />', '<br /><br />')
                    },
                    button: _('Continue')
                }
            }
        }
    });
}());