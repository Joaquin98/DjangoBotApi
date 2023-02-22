/*globals CityOverviewHelper */
(function() {
    "use strict";

    /**
     * Class which represents building in the full town overview
     *
     * @param {Object} data
     *     {String} data.building_id
     *
     * @constructor
     */
    function CityOverviewItem(data) {
        this.data = data;
        if (!this.data.cssClassForConstructionMode) {
            this.data.cssClassForConstructionMode = "";
        }
    }

    CityOverviewItem.inherits(CityOverviewHelper);

    /**
     * Returns name of the css class
     *
     * @return {String}
     */
    CityOverviewItem.prototype.getCssClassName = function() {
        var building_id = this.getBuildingId(),
            level = this.getLevel();

        return building_id + (level !== null ? "_" + level : "");
    };

    /**
     * Returns building id
     *
     * @return {String}
     */
    CityOverviewItem.prototype.getBuildingId = function() {
        return this.data.building_id;
    };

    /**
     * Returns building level
     *
     * @return {Number}
     */
    CityOverviewItem.prototype.getLevel = function() {
        return this.data.level;
    };

    CityOverviewItem.prototype.getCssClassForConstructionMode = function() {
        return this.data.cssClassForConstructionMode;
    };

    /**
     * Returns coordinates string for the area element for the image map
     *
     * @return {String}
     */
    CityOverviewItem.prototype.getImageMapCoordinates = function() {
        if (this.data.image_map_positions) {
            return this.data.image_map_positions;
        }
        return null;
    };

    /**
     * Returns name of the building
     *
     * @return {String}
     */
    CityOverviewItem.prototype.getBuildingName = function() {
        return this.data.building_name;
    };

    window.CityOverviewItem = CityOverviewItem;
}());