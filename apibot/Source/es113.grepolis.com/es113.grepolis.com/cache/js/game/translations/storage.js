/*global _, s, ngettext */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            storage: {
                window_title: _('Building view - %1 (%2)'),
                tabs: [_('Tab 1')],
                activate: _('Activate'),
                buy_trader: DM.getl10n('premium').buy_trader.tooltip,
                warehouse: _('Warehouse'),
                wood: _('Wood'),
                stone: _('Stone'),
                iron: _('Silver coins'),
                storage_full: _('Full at earliest'),
                capacity: function(capacity) {
                    return s(_('Current warehouse capacity: %1 per resource'), capacity);
                },
                in_hideout: function(in_hideout) {
                    return s(_('of these in the hideout: %1 per resource'), in_hideout);
                },
                capacity_next: function(next_level, capacity_next) {
                    return s(_('Storage capacity at level %1: %2 per resource'), next_level, capacity_next);
                },
                in_hideout_next: function(next_level, in_hideout_next) {
                    return s(_('Capacity of the hideout at level %1: %2 per resource'), next_level, in_hideout_next);
                },
                storage_capacity: function(current_storage_volume) {
                    return s(ngettext(
                            'Current warehouse capacity: %1 per resource',
                            'Current warehouse capacity: %1 per resource', current_storage_volume),
                        current_storage_volume);
                },
                storage_unlootable: function(current_unlootable) {
                    return s(_('of these in the hideout: %1 per resource'), current_unlootable);
                },
                storage_lootable: function(lootable) {
                    return s(_('Lootable resources: %1'), lootable);
                },
                storage_capacity_next: function(next_level, next_storage_volume) {
                    return s(_('Storage capacity at level %1: %2 per resource'), next_level, next_storage_volume);
                },
                storage_unlootable_next: function(next_level, next_unlootable_volume) {
                    return s(_('Capacity of the hideout at level %1: %2 per resource'), next_level, next_unlootable_volume);
                },
                trader_boost: function(boost) {
                    return s(_('+%1% resource production'), boost);
                },
                capacity_hideout: function(hide_capacity) {
                    return s(_('Capacity of the hideout: %1 per resource'), hide_capacity);
                }
            }
        }
    });
}());