/*global DM, __, _ */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            context_menu: {
                titles: {
                    goToTown: _('City overview'),
                    attack: __('noun|Attack'),
                    support: __('noun|Support'),
                    trading: __('verb|Trade'),
                    god: _('Spells'),
                    info: _('Info'),
                    wonder_donations: _('Member Donations'),
                    claim_info: __('verb|Demand'),
                    pillage_info: _('Loot'),
                    espionage: _('Espionage'),
                    jump_to: _('Go to'),
                    units_info: _('Units'),
                    island_info: _('Island info'),
                    jump_to_island: _('Go to'),
                    ww_info: _('WW info'),
                    invite_a_friend: _('Invite'),
                    colonize: _('Colonize'),
                    select_town: _('Select town'),

                    /* Inventory*/
                    inventory_trash: _('Throw away'),
                    inventory_use: _('Use'),

                    item_reward_use: _('Use'),
                    item_reward_stash: __('verb|Store'),
                    item_reward_trash: _('Throw away'),
                    portal_attack_olympus: _('Portal Attack'),
                    portal_support_olympus: _('Portal Support')
                },
                title_prefixes: {
                    info: _('Upgrade of'),
                    attack: _('Attack on'),
                    trading: _('Trade with'),
                    claim_info: _('Demand from'),
                    pillage_info: _('Looting from'),
                    units_info: _('Demand units from')
                }
            }
        }
    });
}());