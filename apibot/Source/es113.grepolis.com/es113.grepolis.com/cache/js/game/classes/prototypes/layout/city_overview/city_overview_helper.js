/*globals GameData */
(function() {
    "use strict";

    /**
     * @constructor
     */
    function CityOverviewHelper() {

    }

    /**
     * Returns level number for the building image
     *
     * @param {String} building_id
     * @param {Number} level
     *
     * @return {Number}
     */
    CityOverviewHelper.prototype.getImageLevel = function(building_id, level) {
        var building = GameData.buildings[building_id],
            levels = (building) ? building.image_levels : [],
            j = 0;

        while (level >= levels[j] && j < levels.length) {
            j++;
        }

        return j;
    };

    window.CityOverviewHelper = CityOverviewHelper;
}());