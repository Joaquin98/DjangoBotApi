define('models/inventory/event_inventory_item', function() {
    'use strict';

    var GrepolisModel = window.GrepolisModel;
    var EventInventoryItem = GrepolisModel.extend({
        useReward: function(callback) {
            return this.execute('utilize', {
                inventory_item_id: this.getId()
            });
        },

        stashReward: function(callback) {
            return this.execute('stash', {
                inventory_item_id: this.getId()
            });
        },

        trashReward: function(callback) {
            return this.execute('trash', {
                inventory_item_id: this.getId()
            });
        }
    });

    GrepolisModel.addAttributeReader(EventInventoryItem.prototype,
        'id',
        'count',
        'properties'
    );

    window.GameModels.EventInventoryItem = EventInventoryItem;
    return EventInventoryItem;
});