/* global GameEvents */
(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var PremiumInventoryItem = window.GameModels.PremiumInventoryItem;
    var InventoryItems = window.GameCollections.InventoryItems;

    var PremiumInventoryItems = function() {};

    PremiumInventoryItems.model = PremiumInventoryItem;
    PremiumInventoryItems.model_class = 'PremiumInventoryItem';

    PremiumInventoryItems.initialize = function() {
        $.Observer(GameEvents.game.load).subscribe(['PremiumInventoryItems'], this.sort.bind(this));
    };

    PremiumInventoryItems.getItems = function() {
        return this.models;
    };

    PremiumInventoryItems.getItemByModelId = function(model_id) {
        return this.get(model_id);
    };

    PremiumInventoryItems.comparator = InventoryItems.prototype.comparator;

    window.GameCollections.PremiumInventoryItems = GrepolisCollection.extend(PremiumInventoryItems);
}());