/*globals GameData */

define('data/inventory', function() {
    'use strict';

    return {
        /**
         * Returns cost of the inventory slot
         *
         * @param {Number} slot_number
         *
         * @return {Number}
         */
        getSlotCost: function(slot_number) {
            var cost = 0;
            $.each(GameData.inventory.cost_of_extension, function(index, item) {
                if (slot_number >= index) {
                    cost = item;
                }
            });
            return cost;
        }
    };
});