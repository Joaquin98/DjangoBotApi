/*global GameModels, JSON */

(function() {
    "use strict";

    var InventoryItem = GameModels.InventoryItem;

    var PremiumInventoryItem = function() {}; // never use this, because it will be overwritten

    PremiumInventoryItem.urlRoot = 'PremiumInventoryItem';

    PremiumInventoryItem.initialize = function(attributes) {
        InventoryItem.prototype.initialize.apply(this, arguments);
    };

    PremiumInventoryItem.getGroupIdentifier = function() {
        return JSON.stringify(this.getProperties());
    };

    window.GameModels.PremiumInventoryItem = InventoryItem.extend(PremiumInventoryItem);
}());