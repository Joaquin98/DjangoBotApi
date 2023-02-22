/*globals us, DM */

define('helpers/buildings', function(require) {
    'use strict';

    var GameData = require('game/data');
    var Game = require('game');

    var GameDataBuildings = {
        /**
         * Returns image level for specific building relatively to the stage (fro example, farm has 3 stages at following levels: 1, 14, 28)
         *
         * @param {String} building_id
         * @param {Number} stage
         *
         * @return {Number}
         */
        getImageLevelForBuilding: function(building_id, stage) {
            return GameData.buildings[building_id].image_levels[stage - 1];
        },

        getBuildingMaxLevel: function(building_id) {
            return GameData.buildings[building_id].max_level;
        },

        /**
         * Determinates whether new barracks and docks are enabled
         *
         * @return {Boolean}
         */
        areNewBarracksAndDocksEnabled: function() {
            return Game.new_unit_buildings;
        },

        getHideStorageLevelUnlimited: function() {
            return Game.constants.common.hide_storage_level_unlimited;
        },

        getMaxStorageLimitPerHideLevel: function() {
            return Game.constants.common.max_storage_limit_per_hide_level;
        },

        getBuildingBuildCostReductionPrice: function() {
            return GameData.building.build_cost_reduction;
        },

        getBuildingBuildCostReduction: function() {
            return (1 - this.getBuildingBuildCostReductionFactor()) * 100;
        },

        isBuildCostReductionEnabled: function() {
            return Game.features.build_cost_reduction_enabled === true;
        },

        getFinishBuildingOrderCost: function() {
            return Game.constants.premium.finish_building_order_cost;
        },

        getBuildingBuildCostReductionFactor: function() {
            return GameData.building.build_cost_reduction_factor;
        },

        /**
         * Return true if all requirements for a given building as matched
         *
         * @param {Object} GameCollections.BuildingOrders 	building_orders
         * @param {Object} GameModels.Town 	                current_town
         * @param {String}                                  building_id
         *
         * @return {Boolean}
         */
        isBuildingRequirementsFulfilled: function(building_orders, current_town, building_id) {
            var gd_building = GameData.buildings[building_id],
                dependencies = gd_building.dependencies,
                buildings_model = current_town.getBuildings(),
                buildings = buildings_model.getBuildings(),
                requirements_fulfilled = true;

            us.each(dependencies, function(required_building_level, required_building_id) {
                var actual_building_level = buildings[required_building_id];

                //Add also buildings which are being constructed
                actual_building_level += building_orders.getCountOfOrdersInQueueOfSameType(required_building_id);

                if (actual_building_level < required_building_level) {
                    requirements_fulfilled = false;
                }
            });

            return requirements_fulfilled;
        },

        getSpecialBuildings: function() {
            return {
                special1: ["theater", "thermal", "library", "lighthouse"],
                special2: ["tower", "statue", "oracle", "trade_office"]
            };
        },

        /**
         * returns true, if a special buildings spot has a building build on it
         *
         * @param {Array} special_buildings list of special buildings_ids
         * @param {Object} buildings from BuildingModel.getBuildings()
         * @returns {Boolean}
         */
        isSpecialBuildSpotOccupied: function(special_buildings, buildings) {
            for (var i = 0, l = special_buildings.length; i < l; i++) {
                var special_building_id = special_buildings[i];
                if (buildings[special_building_id] > 0) {
                    return true;
                }
            }
            return false;
        },

        getNoBuildingTemplateData: function(building_id) {
            var building_data = GameData.buildings[building_id],
                l10n = DM.getl10n('COMMON', 'no_building');

            return {
                l10n: DM.getl10n('COMMON', 'no_building'),
                building_data: building_data,
                dependencies: this._getNoBuildingDependencies(l10n, building_data.dependencies),
                has_dependencies: us.keys(building_data.dependencies).length > 0
            };
        },

        /**
         * Takes dependencies object from building data and return array of translated and prepared string
         *
         * @param {Object} dependencies
         * @return {Array} of string, one string for each dependency
         */
        _getNoBuildingDependencies: function(l10n, dependencies) {
            var data_buildings = GameData.buildings,
                building_name_level = l10n.building_name_level,
                translated_dependencies = [],
                translated;

            for (var building_id in dependencies) {
                if (dependencies.hasOwnProperty(building_id)) {
                    translated = s(_(building_name_level), data_buildings[building_id].name, dependencies[building_id]);
                    translated_dependencies.push(translated);
                }
            }

            return translated_dependencies;
        },

        getBuildingDemolishionTooltip: function(building_id, population_teardown, teardown_time) {
            var txt = '<h5>' + GameData.buildings[building_id].name + '</h5>';
            txt += '<img src="' + Game.img() + '/game/res/pop.png" alt="' + _('Food') + '"/>';
            txt += _('Free population that will become available:') + ' ' + population_teardown + '<br/>';
            txt += '<img src="' + Game.img() + '/game/res/time.png" alt="' + _('Time') + '"/>';
            txt += _('Demolition time:') + ' ' + teardown_time + '<br/>';

            return txt;
        },

        /**
         * get all non-special buildings
         * @returns {Building}
         */
        getRegularBuildings: function() {
            return us.filter(GameData.buildings, function(building) {
                return !building.special;
            });
        }
    };

    window.GameDataBuildings = GameDataBuildings;

    return GameDataBuildings;
});