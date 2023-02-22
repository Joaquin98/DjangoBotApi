define('collections/inventory/event_inventory_items', function() {
    'use strict';

    var Collection = window.GrepolisCollection;
    var EventInventoryItem = require('models/inventory/event_inventory_item');

    var EventInventoryItems = Collection.extend({
        model: EventInventoryItem,
        model_class: 'EventInventoryItem',

        getItemProperties: function(item_id) {
            return this.get(item_id).getProperties();
        },

        getItemIds: function() {
            return this.pluck('id');
        },

        onAddOrRemove: function(obj, callback) {
            obj.listenTo(this, 'add remove', callback);
        },

        getItemsCount: function() {
            return this.getItemIds().length;
        }
    });

    window.GameCollections.EventInventoryItems = EventInventoryItems;
    return EventInventoryItems;
});