/* global Game */
(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var Town = window.GameModels.Town;

    var Towns = function() {}; // never use this, becasue it will be overwritten

    Towns.model = Town;
    Towns.model_class = 'Town';

    Towns.getTowns = function() {
        return this.models;
    };

    /**
     * Get the town model for the currently active town
     *
     * @return {Town}
     */
    Towns.getCurrentTown = function() {
        return this.get(Game.townId);
    };

    Towns.isMyOwnTown = function(town_id) {
        var towns = this.models;

        for (var i = 0, l = towns.length; i < l; i++) {
            var town = towns[i];

            if (town.getId() === town_id) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns count of the all towns which belongs to the player
     *
     * @return {Number}
     */
    Towns.getTownsCount = function() {
        return this.models.length;
    };

    Towns.onTownNameChange = function(obj, callback) {
        obj.listenTo(this, 'change:name', callback);
    };

    Towns.onTownCountChange = function(obj, callback) {
        obj.listenTo(this, 'add remove', callback);
    };

    Towns.onTownRemoved = function(obj, callback) {
        obj.listenTo(this, 'remove', callback);
    };

    Towns.getTownsOnIsland = function(island_id) {
        return this.getTowns().filter(function(town) {
            return town.getIslandId() === island_id;
        });
    };

    window.GameCollections.Towns = GrepolisCollection.extend(Towns);
}());