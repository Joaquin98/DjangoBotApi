/* global GameEvents */
(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var InventoryItem = window.GameModels.InventoryItem;

    var InventoryItems = function() {}; // never use this, becasue it will be overwritten

    InventoryItems.model = InventoryItem;
    InventoryItems.model_class = 'InventoryItem';

    InventoryItems.initialize = function() {
        $.Observer(GameEvents.game.load).subscribe(['InventoryItems'], this.sort.bind(this));
    };

    InventoryItems.getItem = function(index) {
        return this.at(index);
    };

    InventoryItems.getItemByModelId = function(model_id) {
        return this.get(model_id);
    };

    InventoryItems.getCount = function() {
        return this.models.length;
    };

    InventoryItems.onCountChange = function(obj, callback) {
        obj.listenTo(this, 'add remove', callback);
    };

    InventoryItems.comparator = function(model_1, model_2) {
        return model_1.getName().localeCompare(model_2.getName()) ||
            model_1.getPowerId().localeCompare(model_2.getPowerId()) ||
            model_1.getLevel() - model_2.getLevel();
    };

    window.GameCollections.InventoryItems = GrepolisCollection.extend(InventoryItems);
}());