define('features/collected_items/models/collected_item', function() {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');

    var CollectedItem = GrepolisModel.extend({
        urlRoot: 'CollectedItem'
    });

    GrepolisModel.addAttributeReader(CollectedItem.prototype,
        'id',
        'item_id',
        'delta',
        'old_amount',
        'new_amount'
    );

    window.GameModels.CollectedItem = CollectedItem;

    return CollectedItem;
});