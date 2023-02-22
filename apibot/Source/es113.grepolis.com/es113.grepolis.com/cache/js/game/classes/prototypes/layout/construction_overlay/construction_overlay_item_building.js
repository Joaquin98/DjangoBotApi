/*globals ConstructionOverlayItemBase, GameData */
(function() {
    "use strict";

    function ConstructionOverlayItemBuilding() {
        ConstructionOverlayItemBase.apply(this, arguments);
    }

    ConstructionOverlayItemBuilding.inherits(ConstructionOverlayItemBase);

    ConstructionOverlayItemBuilding.prototype.getId = function() {
        return this.data.building_id;
    };

    /**
     * @see parent class
     */
    ConstructionOverlayItemBuilding.prototype.getName = function() {
        return this._getName(this.getId());
    };

    /**
     * Returns information whether the building is a special building spot
     *
     * @return {Boolean}
     */
    ConstructionOverlayItemBuilding.prototype.isSpecialBuildingSpot = function() {
        return false;
    };

    /**
     * Returns true if the building is at max level
     *
     * @return {Boolean}
     */
    ConstructionOverlayItemBuilding.prototype.isAtMaxLevel = function() {
        return this.getBuildingLevel(this.getId()) === this.getBuildingMaxLevel();
    };

    /**
     * true if building has an buildingorder
     * @return {Boolean}
     */
    ConstructionOverlayItemBuilding.prototype.isInConstruction = function() {
        return this.getHighestBuildingOrderLevel() !== 0;
    };

    /**
     * returns current level as String or "max"
     * @return {String}
     */
    ConstructionOverlayItemBuilding.prototype.getBuildingLevelString = function() {
        if (this.isAtMaxLevel()) {
            return "max";
        }

        return this.getBuildingLevel().toString();
    };

    /**
     * Returns the highest building order level
     *
     * @return {Number}
     */
    ConstructionOverlayItemBuilding.prototype.getHighestBuildingOrderLevel = function() {
        var building_id = this.getId(),
            all_orders = this.getCollection('building_orders').getOrders(),
            building_has_orders = false,
            building_orders_count = 0;

        us.each(all_orders, function(order) {
            if (order.getBuildingId() === building_id) {
                building_has_orders = true;
                building_orders_count += order.hasTearDown() ? -1 : 1;
            }
        });

        return building_has_orders ? this.getBuildingLevel(building_id) + building_orders_count : 0;
    };

    /**
     * Returns true if the highest building order > current level
     *
     * @return {Boolean}
     */
    ConstructionOverlayItemBuilding.prototype.isUpgrading = function() {
        return (this.getHighestBuildingOrderLevel() > this.getBuildingLevel(this.getId()));
    };

    /**
     * Returns building's max level
     *
     * @return {Number}
     */
    ConstructionOverlayItemBuilding.prototype.getBuildingMaxLevel = function() {
        var gd_building = GameData.buildings[this.getId()],
            max_level = (gd_building) ? gd_building.max_level : 1;

        return max_level;
    };

    /**
     * true if the building can be upgraded by using cost reduction with gold
     *
     * @param {String} [building_id]
     * @return {Boolean}
     */
    ConstructionOverlayItemBuilding.prototype.isUpgradeableWithGold = function() {
        return !(this.getBuildingConstructionRequirementsData(this.getId(), true).upgrade_not_possible);
    };

    ConstructionOverlayItemBuilding.prototype.getReducedBuildingBuildCosts = function() {
        var building_build_datas_model = this.getCollection('building_build_datas').getForCurrentTown(),
            building_build_datas = building_build_datas_model.getBuildingData(),
            building_data = building_build_datas[this.getId()];

        return building_data.resources_for_reduced;
    };

    ConstructionOverlayItemBuilding.prototype.getReduceButtonToolTip = function() {
        return this.getBuildingConstructionRequirementsData(this.getId(), true).result;
    };

    window.ConstructionOverlayItemBuilding = ConstructionOverlayItemBuilding;
}());