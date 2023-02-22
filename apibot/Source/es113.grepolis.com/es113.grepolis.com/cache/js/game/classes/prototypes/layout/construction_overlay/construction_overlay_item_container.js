/*globals ConstructionOverlayItemBase */
(function() {
    "use strict";

    function ConstructionOverlayItemContainer() {
        ConstructionOverlayItemBase.apply(this, arguments);
    }

    ConstructionOverlayItemContainer.inherits(ConstructionOverlayItemBase);

    ConstructionOverlayItemContainer.prototype.getId = function() {
        return this.data.building_id;
    };

    /**
     * @see parent class
     */
    ConstructionOverlayItemContainer.prototype.getName = function(building_id) {
        return this._getName(building_id);
    };

    /**
     * Returns information whether the building is a special building spot
     *
     * @return {Boolean}
     */
    ConstructionOverlayItemContainer.prototype.isSpecialBuildingSpot = function() {
        return true;
    };

    window.ConstructionOverlayItemContainer = ConstructionOverlayItemContainer;
}());