/*globals CityOverviewHelper, CityOverviewItem, GameDataBuildings, Game */
(function() {
    'use strict';

    /**
     *
     * @param town_model
     * @constructor
     */
    function CityOverviewItems(data) {
        //Data
        this.image_map_positions = data.image_map_positions;

        //Models
        this.town_model = data.models.current_town;
        this.buildings_model = this.town_model.getBuildings();
        this.phoenician_salesman_model = data.models.phoenician_salesman;
        this.casual_worlds_blessed_town = data.models.casual_worlds_blessed_town;

        //Collections
        this.units_collection = data.collections.units;
        this.building_orders = data.collections.building_orders;
    }

    CityOverviewItems.inherits(CityOverviewHelper);

    /**
     * Returns animation css class names which should be visible in the city overview depends on the conditions
     *
     * @return {Array}
     */
    CityOverviewItems.prototype.getObjects = function() {
        var classes = [];

        var configuration = [
            /*{
            			name : 'Houses',
            			check : 'areHousesVisible',
            			check_args : [],
            			getter : 'getHousesObject',
            			getter_args : []
            		},*/
            {
                name: 'Colonize ship',
                check: 'isColonizeShipVisible',
                check_args: [],
                getter: 'getColonizeShipObject',
                getter_args: []
            }, {
                name: 'Phoenician Salesman',
                check: 'isPhoenicianSalesmanVisible',
                check_args: [],
                getter: 'getPhoenicianSalesmanObject',
                getter_args: []
            }, {
                name: 'Ghost Buildings',
                check: 'areGhostBuildingsVisible',
                check_args: [],
                getter: 'getGhostBuildings',
                getter_args: []
            }, {
                name: 'Farm field level 2',
                check: 'isFarmFieldLevel2Visible',
                check_args: [],
                getter: 'getFarmFieldLevel2',
                getter_args: []
            }, {
                name: 'Farm field level 3',
                check: 'isFarmFieldLevel3Visible',
                check_args: [],
                getter: 'getFarmFieldLevel3',
                getter_args: []
            }, {
                name: 'Static wind mill',
                check: 'isStaticWindMillVisible',
                check_args: [],
                getter: 'getStaticWindMill',
                getter_args: []
            }, {
                name: 'Boat 1',
                check: 'areBoatsVisible',
                check_args: [],
                getter: 'getBoat',
                getter_args: [1]
            }, {
                name: 'Boat 2',
                check: 'areBoatsVisible',
                check_args: [],
                getter: 'getBoat',
                getter_args: [2]
            }, {
                name: 'Boat 3',
                check: 'areBoatsVisible',
                check_args: [],
                getter: 'getBoat',
                getter_args: [3]
            }, {
                name: 'Boat 5',
                check: 'areBoatsVisible',
                check_args: [],
                getter: 'getBoat',
                getter_args: [5]
            }, {
                name: 'Boat 6',
                check: 'areBoatsVisible',
                check_args: [],
                getter: 'getBoat',
                getter_args: [6]
            }, {
                name: 'Blessed Town Place',
                check: 'isTownBlessed',
                check_args: [],
                getter: 'getBlessedTownPlace',
                getter_args: []
            }
        ];

        for (var i = 0, l = configuration.length, config_item; i < l; i++) {
            config_item = configuration[i];

            if (this[config_item.check].apply(this, config_item.check_args)) {
                classes = classes.concat(this[config_item.getter].apply(this, config_item.getter_args));
            }
        }

        return classes;
    };

    /**
     * =======================================================
     * Boats
     * =======================================================
     */
    CityOverviewItems.prototype.areBoatsVisible = function() {
        return true;
    };

    CityOverviewItems.prototype.getBoat = function(num) {
        return [new CityOverviewItem({
            building_id: 'boat' + num,
            level: null
        })];
    };

    /**
     * =======================================================
     * Static wind mill
     * =======================================================
     */
    CityOverviewItems.prototype.isStaticWindMillVisible = function() {
        var max_population = this.town_model.getMaxPopulation(),
            used_population = this.town_model.getUsedPopulation();

        //Show static wind mill only when available population is 0
        return max_population === used_population;
    };

    CityOverviewItems.prototype.getStaticWindMill = function() {
        return [new CityOverviewItem({
            building_id: 'mill_static',
            level: null
        })];
    };

    /**
     * =======================================================
     * Farm fields
     * =======================================================
     */
    CityOverviewItems.prototype.isFarmFieldLevel2Visible = function() {
        var building_id = 'farm',
            farm_level = this.buildings_model.getBuildingLevel(building_id),
            min_farm_level = GameDataBuildings.getImageLevelForBuilding(building_id, 2);

        return farm_level >= min_farm_level;
    };

    CityOverviewItems.prototype.getFarmFieldLevel2 = function() {
        return [new CityOverviewItem({
            building_id: 'field',
            level: 2
        })];
    };

    CityOverviewItems.prototype.isFarmFieldLevel3Visible = function() {
        var building_id = 'farm',
            farm_level = this.buildings_model.getBuildingLevel(building_id),
            min_farm_level = GameDataBuildings.getImageLevelForBuilding(building_id, 3);

        return farm_level >= min_farm_level;
    };

    CityOverviewItems.prototype.getFarmFieldLevel3 = function() {
        return [new CityOverviewItem({
            building_id: 'field',
            level: 3
        })];
    };

    /**
     * =======================================================
     * Phoenician Salesman
     * =======================================================
     */

    CityOverviewItems.prototype.isPhoenicianSalesmanVisible = function() {
        return this.phoenician_salesman_model.isInCurrentTown() === true;
    };

    CityOverviewItems.prototype.getPhoenicianSalesmanObject = function() {
        var building_id = 'trader';

        return [new CityOverviewItem({
            building_id: building_id,
            level: 1,
            image_map_positions: this.image_map_positions[building_id]
        })];
    };

    /**
     * =======================================================
     * Colonize Ship
     * =======================================================
     */

    CityOverviewItems.prototype.isColonizeShipVisible = function() {
        var units_in_town = this.units_collection.getUnitsInTown();

        if (!units_in_town) {
            return false;
        }

        return units_in_town.hasColonizationShip() === true;
    };

    CityOverviewItems.prototype.getColonizeShipObject = function() {
        return [new CityOverviewItem({
            building_id: 'ship',
            level: 1
        })];
    };

    /**
     * =======================================================
     * Houses
     * =======================================================
     */

    CityOverviewItems.prototype.areHousesVisible = function() {
        var building_id = 'farm',
            level = this.buildings_model.getBuildingLevel(building_id),
            image_level = this.getImageLevel(building_id, level);

        return image_level > 1;
    };

    CityOverviewItems.prototype.getHousesObject = function() {
        var building_id = 'farm',
            level = this.buildings_model.getBuildingLevel(building_id),
            image_level = this.getImageLevel(building_id, level);

        return [new CityOverviewItem({
            building_id: 'houses',
            level: image_level
        })];
    };

    /**
     * =======================================================
     * Ghost Buildings - half transparent, not clickable
     * =======================================================
     */

    CityOverviewItems.prototype.areGhostBuildingsVisible = function() {
        return true;
    };

    CityOverviewItems.prototype.getGhostBuildings = function() {
        var buildings = this.buildings_model.getBuildings(),
            current_town = this.town_model,
            building_orders = this.building_orders,
            result = [],
            special_building_spots = GameDataBuildings.getSpecialBuildings(),
            special1_occupied = GameDataBuildings.isSpecialBuildSpotOccupied(special_building_spots.special1, buildings),
            special2_occupied = GameDataBuildings.isSpecialBuildSpotOccupied(special_building_spots.special2, buildings);

        us.each(buildings, function(building_level, building_id) {
            var requirements_fulfilled = GameDataBuildings.isBuildingRequirementsFulfilled(building_orders, current_town, building_id);

            if (!requirements_fulfilled) {
                if (!this.areSpecialTutorialQuestsRulesApplied(building_id, buildings)) {
                    return;
                }
            }

            //Show transparent images only for building which has not been build
            if (building_level !== 0) {
                return;
            }

            //Show transparent images in special buildings spots if they are not build
            if (special_building_spots.special1.indexOf(building_id) > -1 && special1_occupied) {
                return;
            }
            if (special_building_spots.special2.indexOf(building_id) > -1 && special2_occupied) {
                return;
            }

            result.push(new CityOverviewItem({
                building_id: building_id,
                level: 0,
                cssClassForConstructionMode: 'half_transparent'
            }));
        }.bind(this));

        return result;
    };

    CityOverviewItems.prototype.isTownBlessed = function() {
        return this.casual_worlds_blessed_town && this.casual_worlds_blessed_town.getTownId() === Game.townId;
    };

    CityOverviewItems.prototype.getBlessedTownPlace = function() {
        return [new CityOverviewItem({
            building_id: 'blessed_town_place',
            level: null
        })];
    };

    /**
     * Special rules for Tutorial Quests which makes not constructed building visible even if the requirements are
     * not fulfilled (GP-11767)
     *
     * @param {String} building_id
     * @return {Boolean}
     */
    CityOverviewItems.prototype.areSpecialTutorialQuestsRulesApplied = function(building_id, buildings) {
        /**
         * Rules for quests:
         */
        if (building_id === 'docks' && buildings.main >= 12) {
            return true;
        }

        if (building_id === 'academy' && buildings.barracks >= 5) {
            return true;
        }

        if (building_id === 'hide' && buildings.market >= 3) {
            return true;
        }

        if (building_id === 'tower' && buildings.main >= 12) {
            return true;
        }

        if (building_id === 'theater' && buildings.main >= 12) {
            return true;
        }

        if (building_id === 'wall' && buildings.main >= 3) {
            return true;
        }

        return false;
    };

    window.CityOverviewItems = CityOverviewItems;
}());