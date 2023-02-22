/*global Game */

(function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var BuildingBuildData = window.GameModels.BuildingBuildData;

    var BuildingBuildDatas = function() {}; // never use this, because it will be overwritten

    BuildingBuildDatas.model = BuildingBuildData;
    BuildingBuildDatas.model_class = 'BuildingBuildData';

    /**
     * Get the town model for the currently active town
     *
     * @return {BuildingBuildData}
     */
    BuildingBuildDatas.getForCurrentTown = function() {
        return this.getForTown(Game.townId);
    };

    /**
     * Get the town model for a given town_id
     *
     * @param {Number} town_id
     * @returns {BuildingBuildData}
     */
    BuildingBuildDatas.getForTown = function(town_id) {
        return this.get(town_id);
    };

    window.GameCollections.BuildingBuildDatas = GrepolisCollection.extend(BuildingBuildDatas);
}());