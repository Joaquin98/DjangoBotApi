define('features/collected_items/collections/collected_items', function(require) {
    'use strict';

    var GrepolisCollection = require_legacy('GrepolisCollection'),
        CollectedItem = require('features/collected_items/models/collected_item');

    var CollectedItems = GrepolisCollection.extend({
        model: CollectedItem,
        model_class: 'CollectedItem',

        onCollectedItemsAddChange: function(obj, callback) {
            obj.listenTo(this, 'add change', callback);
        }
    });

    window.GameCollections.CollectedItems = CollectedItems;

    return CollectedItems;
});