/*globals us, TooltipFactory, GameData, GameModels, GameDataBuildings */
(function() {
    'use strict';

    /**
     * Class which represents building in the full town overview
     *
     *
     * @constructor
     */
    function ConstructionOverlayItemBase(data) {
        this.data = data;
    }

    ConstructionOverlayItemBase.prototype.getModel = function(name) {
        return this.data.models[name];
    };

    ConstructionOverlayItemBase.prototype.getCollection = function(name) {
        return this.data.collections[name];
    };

    ConstructionOverlayItemBase.prototype._getBuildings = function() {
        return this.getModel('current_town').getBuildings().getBuildings();
    };

    /**
     * Returns name of the building or string which describes special buildings
     *
     * @param {String} building_id
     * @return {String}
     */
    ConstructionOverlayItemBase.prototype._getName = function(building_id) {
        var gd_building = GameData.buildings[building_id],
            name = gd_building ? gd_building.name : this.data.l10n.construction_overlay.special_building;

        return name;
    };

    /**
     * Returns level of the building
     *
     * @return {Number}
     */
    ConstructionOverlayItemBase.prototype.getBuildingLevel = function() {
        var buildings = this._getBuildings();

        return buildings[this.getId()] || 0;
    };

    /**
     * Upgrades building by one level
     */
    ConstructionOverlayItemBase.prototype.upgrade = function() {
        this._upgrade(this.getId(), false);
    };

    /**
     * Upgrades building by one level
     */
    ConstructionOverlayItemBase.prototype.upgradeWithCostReduction = function() {
        this._upgrade(this.getId(), true);
    };

    ConstructionOverlayItemBase.prototype._upgrade = function(building_id, reduced) {
        var upgradeOrder = new GameModels.BuildingOrder({
            building_type: building_id
        });

        upgradeOrder.buildUp(reduced);
    };

    /**
     * Returns tooltip construct building button
     *
     * @param {String} [building_id]
     * @return {String} tooltip
     */
    ConstructionOverlayItemBase.prototype.getBuildButtonToolTip = function(building_id) {
        return this.getBuildingConstructionRequirementsData(building_id || this.getId(), false).result;
    };

    /**
     * Returns true if the building can be further upgraded
     *
     * @param {String} [building_id]
     * @return {Boolean}
     */
    ConstructionOverlayItemBase.prototype.isUpgradeable = function(building_id) {
        return !(this.getBuildingConstructionRequirementsData(building_id || this.getId(), false).upgrade_not_possible);
    };

    /**
     * Returns the Construction requirements from the TooltipFactory
     * To use the TooltipFactory the data has to be transformed first into a compatible
     * format
     * The function may return an stub object indicating a error
     *
     * @param {String} building_id
     * @param {Boolean} for_reduced		true to query the requirements for cost reduced build
     * @returns {Object} TooltipFactory.getBuildingConstructionRequirements
     */
    ConstructionOverlayItemBase.prototype.getBuildingConstructionRequirementsData = function(building_id, for_reduced) {
        var building_build_datas_model, building_build_datas,
            building, full_queue, town_id, gold, upgrade_check,
            on_error_result = {
                error: true,
                upgrade_not_possible: true,
                result: null
            };

        // each of the following steps can fail (return undefined) independently
        building_build_datas_model = this.getCollection('building_build_datas').getForCurrentTown();

        if (!building_build_datas_model) {
            return on_error_result;
        }

        building_build_datas = building_build_datas_model.getBuildingData();

        if (!building_build_datas) {
            return on_error_result;
        }

        building = this.proxyBuildingObjectForTooltipFactory(building_id, building_build_datas[building_id]);

        if (!building) {
            return on_error_result;
        }

        full_queue = this.getCollection('building_orders').isBuildingQueueFull();
        town_id = this.getModel('current_town').getId();
        gold = this.getModel('player_ledger').getGold();

        if (for_reduced) {
            upgrade_check = TooltipFactory.getBuildingConstructionRequirementsWidthCostReduction(town_id, building, gold, full_queue);
        } else {
            upgrade_check = TooltipFactory.getBuildingConstructionRequirements(town_id, building, full_queue, true);
        }

        return upgrade_check;
    };

    /**
     * Creates object which is used to create the tooltip for the building
     *
     * @param building_id
     * @param building_build_data
     *
     * @return {Object}
     */
    ConstructionOverlayItemBase.prototype.proxyBuildingObjectForTooltipFactory = function(building_id, building_build_data) {
        var gd_building = GameData.buildings[building_id];

        if (!building_build_data) {
            return null;
        }

        return {
            build_time: building_build_data.building_time,
            building: us.clone(gd_building),
            can_tear_down: building_build_data.can_tear_down,
            can_upgrade: building_build_data.can_upgrade,
            can_upgrade_reduced: building_build_data.can_upgrade_reduced,
            controller: 'building_main',
            description: gd_building.description,
            enough_resources: building_build_data.enough_resources,
            enough_storage: building_build_data.enough_storage,
            get_dependencies: building_build_data.missing_dependencies,
            level: building_build_data.level,
            max_level: building_build_data.has_max_level,
            name: gd_building.name,
            needed_resources: building_build_data.resources_for,
            needed_resources_reduced: building_build_data.resources_for_reduced,
            next_level: building_build_data.next_level,
            pop: building_build_data.population_for,
            special: gd_building.special
            // not send
            //pop_tear_down: 6
            //tear_down_time: '2:50:06',
            //enough_population: true
        };

        /* sent, but not transposed
        group_locked: false
        tear_down_level: 11
        */
    };

    /**
     * Determinates whether the building containes sub buildinds (like special1 and special2)
     *
     * @returns {boolean}
     */
    ConstructionOverlayItemBase.prototype.isContainer = function() {
        return this.getSubBuildings().length > 0;
    };

    ConstructionOverlayItemBase.prototype.getSubBuildings = function() {
        var sub_buildings = GameDataBuildings.getSpecialBuildings();

        return sub_buildings[this.data.building_id] || [];
    };

    window.ConstructionOverlayItemBase = ConstructionOverlayItemBase;
}());