/* globals GameData, Game */

(function() {
    "use strict";

    var GameDataFeatureFlags = require('data/features');

    /**
     * Handles the storage management for a town. It contains all code to calculate the capacity.
     * It is used internally by the Town model
     *
     * @class TownStorage
     * @constructor
     *
     * @param {Town} town
     */
    function TS(town) {
        this.town = town;
    }

    /**
     * The current storage capacity
     *
     * @method getCapacity
     *
     * @param {integer} storage_level optional level to calculate the capacity for
     * @return {integer} the capacity at the current or a given level
     */
    TS.prototype.getCapacity = function(storage_level) {
        var storage = this.getBuildingStorage(storage_level);

        storage += this.getResearchBoni();
        storage += this.getWonderBoni();

        storage *= window.GeneralModifications.getStorageVolumeModification();

        storage = this.roundToHundredOnHeroworldMaxLevel(storage);

        return storage;
    };

    /**
     * The current raw storage including hideout capacity but no bonuses
     *
     * @method getBuildingStorage
     *
     * @param {integer} storage_level optional level to calculate the capacity for
     * @return {integer} the raw capacity at the current or a given level
     */
    TS.prototype.getBuildingStorage = function(storage_level) {
        var buildings = this.town.getBuildings(),
            storage;

        storage_level = storage_level || (buildings && buildings.get('storage') || 0);

        storage = Math.pow(storage_level, GameData.buildings.storage.storage_pow) * GameData.buildings.storage.storage_factor;

        if (GameDataFeatureFlags.battlepointVillagesEnabled() && typeof GameData.buildings.storage.offset_value_map[storage_level - 1] !== 'undefined') {
            storage += GameData.buildings.storage.offset_value_map[storage_level - 1];
        }
        storage += storage_level * GameData.buildings.storage.hide_factor;

        return storage;
    };

    TS.prototype.getResearchBoni = function() {
        var storage_volume_bonus = 0,
            researches = this.town.getResearches();

        if (researches && researches.hasResearch('pottery')) {
            storage_volume_bonus += Game.constants.researches.pottery_storage_bonus;
        }

        return storage_volume_bonus;
    };

    TS.prototype.getWonderBoni = function() {
        var storage_volume_bonus = 0,
            wonders = this.town.getWonders();

        if (wonders && us.find(wonders, function(wonder) {
                return wonder.getType() === 'great_pyramid_of_giza' && wonder.isMaxExpansionStage();
            })) {
            storage_volume_bonus += Game.constants.wonder.storage_modification_for_pyramid;
        }

        return storage_volume_bonus;
    };

    TS.prototype.roundToHundredOnHeroworldMaxLevel = function(storage, storage_level) {
        var buildings = this.town.getBuildings();
        storage_level = storage_level || (buildings && buildings.get('storage') || 0);

        if (storage_level === 35) {
            return Math.round((storage / 100), 0) * 100;
        }

        return storage;
    };

    window.TownStorage = TS;
}());