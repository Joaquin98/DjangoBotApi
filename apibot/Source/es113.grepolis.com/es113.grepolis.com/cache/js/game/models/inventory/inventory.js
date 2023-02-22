/*global GrepolisModel */

(function() {
    'use strict';

    var Inventory = function() {}; // never use this, because it will be overwritten

    Inventory.urlRoot = 'Inventory';

    Inventory.buyAdditionalSlot = function() {
        this.execute('extend');
    };

    Inventory.getTotalAmountOfSlots = function() {
        return this.get('total_amount_of_slots');
    };

    Inventory.getAmountOfAccessibleSlots = function() {
        return this.get('accessible_slots');
    };

    /**
     * Listen on any change on the model
     *
     * @param {Object} obj
     * @param {Function} callback
     */
    Inventory.onChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    window.GameModels.Inventory = GrepolisModel.extend(Inventory);
}());