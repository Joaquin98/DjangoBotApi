/*globals GameData, CityOverviewHelper */
(function() {
    'use strict';

    /**
     * Class which represents building in the full town overview
     *
     * @param {Object} data
     *     {String} data.building_id
     *     {Number} data.level
     *     {String} data.god_id
     *     {Boolean} data.is_in_construction
     *     {String} building_name
     *     {String} image_map_positions
     *
     * @constructor
     */
    function CityOverviewBuilding(data) {
        this.data = data;
    }

    CityOverviewBuilding.inherits(CityOverviewHelper);

    /**
     * Returns name of the css class
     *
     * @return {String}
     */
    CityOverviewBuilding.prototype.getCssClassName = function() {
        var is_in_construction = this._isInConstruction(),
            level = this.getLevel(),
            building_id = this.getBuildingId(),
            god_id = this._getGodId(),
            construction_string = this._getConstructionString(),
            image_level = this.getImageLevel(building_id, level);

        var class_name = building_id;

        if (building_id === 'hide') {
            return 'hide';
        } else {
            if (building_id === 'statue' && god_id) {
                class_name += '_' + god_id;
            }

            if (level === 0 && is_in_construction) {
                class_name += '_0';
            } else {
                class_name += '_' + image_level + construction_string;
            }

            return class_name;
        }
    };

    /**
     * Returns coordinates string for the area element for the image map
     *
     * @return {String}
     */
    CityOverviewBuilding.prototype.getImageMapCoordinates = function() {
        return this.data.image_map_positions[this.getBuildingId()];
    };

    /**
     * Returns name of the building
     *
     * @return {String}
     */
    CityOverviewBuilding.prototype.getBuildingName = function() {
        return this.data.building_name;
    };

    /**
     * Returns string which represents whether the building is in the construction or not
     *
     * @return {String}
     * @private
     */
    CityOverviewBuilding.prototype._getConstructionString = function() {
        var gd_buildings = GameData.buildings,
            levels = gd_buildings[this.getBuildingId()].image_levels;

        return !this._isInConstruction() || levels.length === 1 ? '' : 'c';
    };

    /**
     * Returns building id
     *
     * @return {String}
     */
    CityOverviewBuilding.prototype.getBuildingId = function() {
        return this.data.building_id;
    };

    /**
     * Returns building level
     *
     * @return {Number}
     */
    CityOverviewBuilding.prototype.getLevel = function() {

        return this.data.level;
    };

    /**
     * Returns god id
     *
     * @return {String}
     * @private
     */
    CityOverviewBuilding.prototype._getGodId = function() {
        return this.data.god_id;
    };

    /**
     * Returns information whether the building is currently in the construction or not
     *
     * @return {Boolean}
     * @private
     */
    CityOverviewBuilding.prototype._isInConstruction = function() {
        return this.data.is_in_construction;
    };

    CityOverviewBuilding.prototype.getCssClassForConstructionMode = function() {
        return '';
    };

    window.CityOverviewBuilding = CityOverviewBuilding;
}());