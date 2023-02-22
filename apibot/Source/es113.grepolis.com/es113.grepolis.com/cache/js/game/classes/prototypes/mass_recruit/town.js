/*globals us, GameDataPowers, GameData, MassRecruitUnit, GeneralModifications, ITowns, MM, JSON, GameDataConstructionQueue, ConstructionQueueHelper */

(function() {
    'use strict';

    var Powers = require('enums/powers');
    var Heroes = require('enums/heroes');

    function MassRecruitTown(data, gods_favor) {
        //this.data = $.extend(data, {});

        this.data = data;
        this.obj_units = {};
        this.gods_favor = gods_favor;

        us.each(data.casted_power, function(item, key) {
            var configuration = JSON.parse(item.configuration);
            if (!data.extended_casted_power) {
                data.extended_casted_power = [];
            }

            data.extended_casted_power[key] = GameDataPowers.getTooltipPowerData(GameData.powers[item.power_id], $.extend({
                casted_power_end_at: item.end_at
            }, configuration));
        });

        //Create object for each unit
        this._createUnitObjects(data.units);

        //Calculate additional properties for units
        this.calculateAdditionalProperties(data.all_units);
    }

    MassRecruitTown.prototype._createUnitObjects = function(units) {
        var i, l = units.length,
            unit;

        for (i = 0; i < l; i++) {
            unit = new MassRecruitUnit(units[i]);
            this.obj_units[unit.getId()] = unit;
        }
    };

    MassRecruitTown.prototype.getUnitById = function(unit_id) {
        return us.find(this.obj_units, function(value, key, el) {
            if (key === unit_id) {
                return el;
            }

            return false;
        });
    };

    MassRecruitTown.prototype._updateResources = function(type, value) {
        this.data.resources[type] = value;
    };

    /**
     * Calculate how many units can be build for a given town
     *
     * @param {Object} itown   ITown object (example how to get it: ITowns.getTown(town.id);)
     *
     * @return {Object}
     */
    MassRecruitTown.prototype._getMaxBuildOfUnits = function(itown) {
        var unit, unit_id, units = this.getUnits(),
            res = itown.resources(),
            max_build, gd_unit, unit_max_build,
            max = {},
            factor;

        for (unit_id in units) {
            if (units.hasOwnProperty(unit_id)) {
                unit = units[unit_id];
                gd_unit = GameData.units[unit_id];

                if (gd_unit.id !== 'militia') {
                    factor = GeneralModifications.getUnitBuildResourcesModification(itown.id, gd_unit);
                    //Save research factor for each unit
                    unit.setResearchFactor(factor);

                    max_build = [];

                    if (gd_unit.resources.wood > 0) {
                        max_build.push(parseInt(res.wood / (gd_unit.resources.wood * factor), 10));
                    }

                    if (gd_unit.resources.stone > 0) {
                        max_build.push(parseInt(res.stone / (gd_unit.resources.stone * factor), 10));
                    }

                    if (gd_unit.resources.iron > 0) {
                        max_build.push(parseInt(res.iron / (gd_unit.resources.iron * factor), 10));
                    }

                    if (gd_unit.population > 0) {
                        max_build.push(parseInt(res.population / gd_unit.population, 10));
                    }

                    if (gd_unit.favor) {
                        var favor_cost_modifier = 0;

                        $.each(
                            MM.getOnlyCollectionByName('CastedAlliancePowers').getCastedAlliancePowers(),
                            function(idx, casted_power) {
                                if (casted_power.attributes.power_id === Powers.MYTHICAl_UNIT_FAVOR_COST_BOOST_ALLIANCE) {
                                    favor_cost_modifier += casted_power.attributes.configuration.percent;
                                }
                            }
                        );

                        var hero = MM.getCollections().PlayerHero[0].getHeroOfTown(itown.id);
                        if (hero && hero.getId() === Heroes.ANYSIA) {
                            favor_cost_modifier += 10 + hero.getLevel() * 1;
                        }

                        //To build mythical unit in the town, you need to choose proper god in the temple
                        if (this.hasGod() && ((this.getGod() === gd_unit.god_id) || gd_unit.god_id === 'all')) {
                            //Before they checked if(Layout.favor.hasOwnProperty(gd_unit.god_id))
                            //but I skipped it, because if this.hasGod() then this property should be in the object
                            max_build[max_build.length] = this.gods_favor.getCurrentFavorForGod(
                                gd_unit.god_id, this.getGod()
                            ) / Math.ceil((gd_unit.favor * (1 - (favor_cost_modifier / 100))));
                        }
                    }

                    unit_max_build = Math.floor(Array.prototype.min(max_build));
                    //Array.prototype.min([]) returns Infinity
                    max[unit_id] = Math.max(0, unit_max_build === Infinity || !unit.hasNoDependencies() ? 0 : unit_max_build);
                }
            }
        }

        return max;
    };

    MassRecruitTown.prototype.calculateAdditionalProperties = function(data_all_units) {
        var itown = ITowns.getTown(this.getId()),
            units = this.getUnits(),
            max_build = {},
            unit_id,
            new_resources;

        if (data_all_units) { // pre-calculated by backend
            for (unit_id in data_all_units) {
                if (data_all_units.hasOwnProperty(unit_id)) {
                    max_build[unit_id] = data_all_units[unit_id].max_build;
                }
            }
        } else {
            max_build = this._getMaxBuildOfUnits(itown);
        }

        //Update units array with this information
        for (unit_id in units) {
            if (units.hasOwnProperty(unit_id)) {
                units[unit_id].setMax(max_build[unit_id] || 0);
            }
        }

        //Update resources and free population
        if (typeof itown.getAvailablePopulation() === 'number') {
            this.updatePopulation(itown.getAvailablePopulation());
        }

        new_resources = itown.resources();

        if (new_resources.wood) {
            this.updateWood(new_resources.wood);
        }

        if (new_resources.stone) {
            this.updateStone(new_resources.stone);
        }

        if (new_resources.iron) {
            this.updateIron(new_resources.iron);
        }
    };

    MassRecruitTown.prototype.updateUnits = function(units) {
        var i, l = units.length,
            unit, objUnit;

        for (i = 0; i < l; i++) {
            unit = units[i];
            objUnit = this.obj_units[unit.id];

            //Update
            objUnit.updateCount(unit.count);
            objUnit.updateTotal(unit.total);
        }
    };

    MassRecruitTown.prototype._isUnitOrderQueueFull = function(town_id) {
        var itown = ITowns.getTown(town_id),
            unit_orders_collection = itown.getUnitOrdersCollection(),
            unit_orders = unit_orders_collection.getAllOrders();

        return unit_orders.length === GameDataConstructionQueue.getUnitOrdersQueueLength() * 2; //*2 because queue in barracns and docks have to be full in the same time
    };

    /**
     * Warrning, this methods is used in template, thats why it appears as unused.
     *
     * @return {Boolean}
     */
    MassRecruitTown.prototype.isUnitBuildInactive = function() {
        var id, unit, inactive, total_inactivity = true;
        var is_queue_full = ConstructionQueueHelper.isUnitOrderQueueFull(this.getId());

        if (!is_queue_full) {
            for (id in this.obj_units) {
                if (this.obj_units.hasOwnProperty(id)) {
                    unit = this.obj_units[id];

                    inactive = !unit.getMax() || !unit.hasNoDependencies();

                    if (!inactive) {
                        total_inactivity = false;
                    }
                }
            }
        }

        return total_inactivity;
    };

    MassRecruitTown.prototype.getId = function() {
        return parseInt(this.data.id, 10);
    };

    MassRecruitTown.prototype.hasGod = function() {
        return this.data.god !== null;
    };

    MassRecruitTown.prototype.getGod = function() {
        return this.data.god;
    };

    MassRecruitTown.prototype.getProduction = function() {
        return this.data.production;
    };

    MassRecruitTown.prototype.getResources = function() {
        return this.data.resources;
    };

    MassRecruitTown.prototype.getStorageVolume = function() {
        return this.data.storage_volume;
    };

    MassRecruitTown.prototype.getAvailablePopulation = function() {
        return this.data.free_population;
    };

    MassRecruitTown.prototype.getLink = function() {
        return this.data.frag;
    };

    MassRecruitTown.prototype.getWood = function() {
        return this.data.resources.wood;
    };

    MassRecruitTown.prototype.getIron = function() {
        return this.data.resources.iron;
    };

    MassRecruitTown.prototype.getStone = function() {
        return this.data.resources.stone;
    };

    MassRecruitTown.prototype.getName = function() {
        return this.data.name;
    };

    MassRecruitTown.prototype.getCastedPowers = function() {
        var casted_powers_town_agnostic = MM.getFirstTownAgnosticCollectionByName('CastedPowers'),
            casted_powers_collection = casted_powers_town_agnostic.getFragment(this.getId()),
            casted_powers = casted_powers_collection.getCastedPowers();

        return casted_powers;
    };

    MassRecruitTown.prototype.getExtendedCastedPowers = function() {
        return this.data.extended_casted_power;
    };

    MassRecruitTown.prototype.getUnits = function() {
        return this.obj_units;
    };

    MassRecruitTown.prototype.getPoints = function() {
        return this.data.points;
    };

    MassRecruitTown.prototype.getResourcesRare = function() {
        return this.data.resource_rare;
    };

    MassRecruitTown.prototype.getResourcesPlenty = function() {
        return this.data.resource_plenty;
    };

    MassRecruitTown.prototype.updatePopulation = function(value) {
        this.data.free_population = value;
        this.data.resources.population = value;
    };

    MassRecruitTown.prototype.updateWood = function(value) {
        this._updateResources('wood', value);
    };

    MassRecruitTown.prototype.updateStone = function(value) {
        this._updateResources('stone', value);
    };

    MassRecruitTown.prototype.updateIron = function(value) {
        this._updateResources('iron', value);
    };

    /**
     * barracks
     * docks
     */
    MassRecruitTown.prototype.getUnitsOrders = function(type) {
        var unit_orders_collection = ITowns.getTown(this.getId()).getUnitOrdersCollection(),
            orders_models = unit_orders_collection.getOrders(type);

        return orders_models;
    };

    MassRecruitTown.prototype.getUnitOrderById = function(order_id) {
        var unit_orders_collection = ITowns.getTown(this.getId()).getUnitOrdersCollection();

        return unit_orders_collection.getOrderById(order_id);
    };

    MassRecruitTown.prototype.getPreviousUnitOrderById = function(order_id, building_type) {
        var unit_orders_collection = ITowns.getTown(this.getId()).getUnitOrdersCollection();

        return unit_orders_collection.getPreviousOrderById(order_id, building_type);
    };

    MassRecruitTown.prototype.getNumberOfUnitsFromOrderQueues = function(unit_id) {
        var unit_orders_collection = ITowns.getTown(this.getId()).getUnitOrdersCollection();

        return unit_orders_collection.getNumberOfUnitsFromRunningOrders(unit_id);
    };

    window.MassRecruitTown = MassRecruitTown;
}());