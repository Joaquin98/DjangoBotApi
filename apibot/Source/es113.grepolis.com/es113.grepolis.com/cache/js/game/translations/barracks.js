/*global _*/

(function() {
    'use strict';

    var l10n_barracks = {
        window_title: _('Barracks'),
        tabs: []
    };

    var l10n_docks = {
        window_title: _('Harbor'),
        tabs: []
    };

    var common_l10n = {
        'costs': _('Costs'),
        'details': _('Unit information'),
        'cost_details': {
            'wood': _('Wood'),
            'favor': _('Favor'),
            'stone': _('Stone'),
            'population': _('Population'),
            'iron': _('Silver coins'),
            'buildtime_barracks': _('Recruitment time'),
            'buildtime_docks': _('Construction time')
        },
        'requirements': _('Required'),
        'buildings': _('Buildings'),
        'researches': __('noun|Research'),
        'level': _('Level'),
        'barracks_queue': _('In training'),
        'docks_queue': _('Construction queue'),
        'no_result_barracks': _('No units in training'),
        'no_result_docks': _('No orders in the construction queue'),
        'does_not_exist': _('not available'),
        'requirements2': _('Requirements'),
        'incorrect_number_of_units': _('Invalid number of units'),
        'show_all_units': _('Show all units'),
        'show_possible_to_build_units': _('Only show researched units.'),
        'refund_tooltip': _('Reimbursement: %1'),
        'captain_adv': _('Summon the %1 commander %2 now and increase your troop strength.'),
        'captain_bonus': _('%1 stronger land units'),
        'activate': _('Activate'),
        'completed_at': _('Completion %1'),
        'wnd_title': _('Building view'),
        'phoenician_trader': {
            'title': _('Phoenician merchant'),
            'on_the_way': _('En route to %1.'),
            'arrival': _('Arrival %1.'),
            'currently_in': _('Is currently in %1.'),
            'visiting_city': _('Visiting this city.'),
            'do_handel': __('verb|Trade'),
            'invite': _('Summon to %1 immediately'),
            'invite_tooltip': _('You can summon the merchant immediately for %1 gold.'),
            'invite_tooltip_plural': _('You can summon the merchant immediately for %1 gold.'),
            'gold': _('Available gold: %1'),
            'gold_plural': _('Available gold: %1'),
            'invite_question': _('Are you sure you want to summon the merchant for %1 gold now?'),
            'invite_question_plural': _('Are you sure you want to summon the merchant for %1 gold now?')
        },
        'tooltips': {
            'def_hack': _('Defense blunt weapons'),
            'def_pierce': _('Defense sharp weapons'),
            'def_distance': _('Defense distance weapons'),
            'att_hack': _('Attack (blunt weapon)'),
            'att_pierce': _('Attack (sharp weapon)'),
            'att_distance': _('Attack (distance weapon)'),
            'booty': {
                'title': _('Booty'),
                'descr': _('States the maximum amount of resources that this unit can bring along.')
            },
            'speed': _('Speed'),
            'ship_attack': _('Attack value'),
            'ship_defense': _('Defense value'),
            'ship_transport': {
                'title': _('Transport capacity'),
                'descr': _('States how many units the ship can transport.')
            },
            'units_show': _('Show all units'),
            'show_values': _('Unit information'),
            'order_total': _('All units from this city'),
            'order_count': _('Units in this city')
        }
    };

    DM.loadData({
        l10n: {
            barracks: $.extend(true, l10n_barracks, common_l10n),
            docks: $.extend(true, l10n_docks, common_l10n)
        }
    });
}());