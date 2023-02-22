/*globals Game, GameData, GeneralModifications, ITowns, us, GameDataResearches */

define('data/units', function() {
    'use strict';

    var HEROES = 'heroes';
    var UNIT_TYPE_ORDER = ['sword', 'slinger', 'archer', 'hoplite', 'rider', 'chariot', 'catapult', 'minotaur', 'manticore', 'zyklop', 'harpy',
        'medusa', 'centaur', 'pegasus', 'cerberus', 'fury', 'griffin', 'calydonian_boar', 'satyr', 'spartoi', 'ladon', 'godsent', 'big_transporter',
        'bireme', 'attack_ship', 'demolition_ship', 'small_transporter', 'trireme', 'colonize_ship', 'siren', 'sea_monster', 'militia'
    ];
    var GROUND_UNITS = require('enums/ground_units');
    var NAVAL_UNITS = require('enums/naval_units');
    var HERO_TYPES = require('enums/heroes');
    var TOWN_TYPES_ENUM = require('enums/town_types');

    var GameDataUnits = {
        /**
         * Determintes if unit build time reduction is enabled
         *
         * @return {Boolean}
         */
        isBuildTimeReductionEnabled: function() {
            return Game.unit_build_time_reduction;
        },

        getUnitTypeOrder: function() {
            return UNIT_TYPE_ORDER;
        },

        /**
         * Returns information about time reduction cost for unit orders
         *
         * @returns {Number}
         */
        getUnitOrderBuildTimeReductionCost: function() {
            return Game.constants.premium.unit_order_build_time_reduction_cost;
        },

        getUnitsRuntimeSetupTime: function() {
            return Game.constants.units.runtime_setup_time;
        },

        /**
         * Calculate how many units can be build for a given town
         *
         * @param {Object} units An object with units you want to calculate max build, for instance: {sword : 'something'}
         *
         * @return {Object}
         */
        getMaxBuild: function(units) {
            var town_id = Game.townId,
                itown = ITowns.getTown(town_id),
                unit_id, res = itown.resources(),
                max_build, gd_unit, gd_units = GameData.units,
                god_id = itown.god(),
                curr_favor = res.favor,
                unit_max_build,
                max = {},
                factor;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    gd_unit = gd_units[unit_id];

                    if (!gd_unit) {
                        throw 'GameDataUnits.getMaxBuild(): incorrect unit_id';
                    }

                    if (gd_unit.id !== 'militia') {
                        factor = GeneralModifications.getUnitBuildResourcesModification(town_id, gd_unit);

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
                            //To build mythical unit in the town, you need to choose proper god in the temple
                            if (god_id && ((gd_unit.god_id === god_id) || gd_unit.god_id === 'all')) {
                                max_build[max_build.length] = curr_favor / gd_unit.favor;
                            }
                        }

                        unit_max_build = Math.floor(Array.prototype.min(max_build));

                        //Array.prototype.min([]) returns Infinity
                        max[unit_id] = Math.max(0, unit_max_build === Infinity || this.hasDependencies(unit_id) ? 0 : unit_max_build);
                    }
                }
            }

            return max;
        },

        /**
         * Its just an alias of getMaxBuild
         *
         * @param {String} unit_id
         *
         * @return {Object}
         */
        getMaxBuildForSingleUnit: function(unit_id) {
            var units = {};

            units[unit_id] = 'something';

            return this.getMaxBuild(units)[unit_id];
        },

        /**
         * Returns unit dependencies
         *
         * @param {String} unit_id
         *
         * @return {Object}
         */
        getDependencies: function(unit_id) {
            var itown = ITowns.getTown(Game.townId),
                town_buildings = itown.getBuildings(),
                town_researches = itown.getResearches(),
                gd_unit = GameData.units[unit_id],
                gd_researches = GameData.researches,
                gd_buildings = GameData.buildings,
                has_dependencies = false,
                building_dep = gd_unit.building_dependencies,
                research_dep = gd_unit.research_dependencies,
                building_id, i, l = research_dep.length;

            var left_building_dep = [],
                left_research_dep = [],
                research_id;

            //Check if all building dependecies are fulfill
            if (building_dep) {
                for (building_id in building_dep) {
                    if (building_dep.hasOwnProperty(building_id) && !town_buildings.hasBuildingWithLevel(building_id, building_dep[building_id])) {
                        left_building_dep.push({
                            id: building_id,
                            name: gd_buildings[building_id].name,
                            level: building_dep[building_id]
                        });

                        has_dependencies = true;
                    }
                }
            }

            for (i = 0; i < l; i++) {
                research_id = research_dep[i];

                if (!town_researches.hasResearch(research_id)) {
                    left_research_dep.push({
                        id: research_id,
                        name: gd_researches[research_id].name
                    });

                    has_dependencies = true;
                }
            }

            return has_dependencies ? {
                buildings: left_building_dep,
                researches: left_research_dep
            } : {};
        },

        /**
         * Checks if unit has dependencies
         *
         * @param {string} unit_id
         * @return {Boolean}
         */
        hasDependencies: function(unit_id) {
            return !us.isEmpty(this.getDependencies(unit_id));
        },

        /**
         * test if given units object has naval units
         *
         * @param {Object} unit_ids object with key as unit_id and value as number of units
         *
         * @returns {Boolean}
         */
        hasNavalUnits: function(unit_ids) {
            var i, naval_units = this.navalUnitIds(),
                naval_units_length = naval_units.length;

            for (i = 0; i < naval_units_length; i++) {
                if (unit_ids[naval_units[i]]) {
                    return true;
                }
            }

            return false;
        },

        /**
         * test if given units object has ground units
         *
         * @param {Object} unit_ids object with key as unit_id and value as number of units
         *
         * @returns {Boolean}
         */
        hasGroundUnits: function(unit_ids) {
            var i, ground_units = this.groundUnitIds(),
                ground_units_length = ground_units.length;

            for (i = 0; i < ground_units_length; i++) {
                if (unit_ids[ground_units[i]]) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Test if a given set of units has transport units
         *
         * @param {Object} unit_ids { unit_id => amount}
         *
         * @returns {Boolean}
         */
        hasTransportUnits: function(unit_ids) {
            return Object.keys(unit_ids).some(
                function(type) {
                    if (typeof GameData.units[type] === "undefined") {
                        return 0;
                    }
                    return GameData.units[type].capacity && unit_ids[type] > 0;
                }
            );
        },

        getEnabledUnits: function() {
            var all_units = GameData.units,
                enabled_gods = GameData.gods,
                enabled_units = {};

            for (var key in all_units) {
                if (all_units.hasOwnProperty(key)) {
                    var unit = all_units[key];
                    if (unit.god_id === undefined || unit.god_id === null || unit.god_id === 'all' || enabled_gods[unit.god_id]) {
                        enabled_units[key] = unit;
                    }
                }
            }

            return enabled_units;
        },

        /**
         * get all unit ids
         *
         * @returns {Array}
         */
        allUnitIds: function() {
            var unit_id, all_unit_ids = [],
                units = GameData.units;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    all_unit_ids.push(unit_id);
                }
            }

            return all_unit_ids;
        },

        /**
         * get all naval unit ids
         *
         * @returns {Array}
         */
        navalUnitIds: function() {
            var unit_id, naval_unit_ids = [],
                units = GameData.units;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id) && units[unit_id].is_naval) {
                    naval_unit_ids.push(unit_id);
                }
            }

            return naval_unit_ids;
        },

        /**
         * get all ground unit ids
         *
         * @returns {Array}
         */
        groundUnitIds: function() {
            var unit_id, ground_unit_ids = [],
                units = GameData.units;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id) && !units[unit_id].is_naval) {
                    ground_unit_ids.push(unit_id);
                }
            }

            return ground_unit_ids;
        },

        /**
         * get all flying unit ids
         *
         * @returns {Array}
         */
        flyingUnitIds: function() {
            var unit_id, flying_unit_ids = [],
                units = GameData.units;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id) && units[unit_id].flying) {
                    flying_unit_ids.push(unit_id);
                }
            }

            return flying_unit_ids;
        },

        /**
         * returns whether a unit has the property "flying" or not
         *
         * @param {string} unit_id
         * @returns {boolean}
         */
        isFlyingUnit: function(unit_id) {
            return this.flyingUnitIds().indexOf(unit_id) !== -1;
        },


        /**
         * test if given units object has flying units
         *
         * @param {Object} unit_ids object with key as unit_id and value as number of units
         *
         * @returns {Boolean}
         */
        hasFlyingUnitsOnly: function(unit_ids) {
            var result = Object.keys(unit_ids).find(function(unit_id) {
                return !(this.isFlyingUnit(unit_id) || GameData.units[unit_id].is_naval);
            }.bind(this));

            return !result;
        },

        /**
         * test if selected units is empty
         *
         * @param {Object} selected_units key is unit_id, value is number
         * @returns {Boolean}
         */
        isEmpty: function(selected_units) {
            var unit_id, units = GameData.units;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id) && selected_units[unit_id]) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Calculate the slowest runtime for a given set of units and a given set of base runtimes
         * If there are naval units, only those taken into consideration
         *
         * @param {Object}       chosen_units  { unit_id => amount }
         * @param {Object}       runtimes      { unit_id => runtime }
         * @param {Object|null}  hero          { attributes => { type => hero_id, level => hero_level } }
         * @param {Boolean|null} town_type
         *
         * @returns {integer}
         */
        getSlowestRuntime: function(chosen_units, runtimes, hero, town_type) {
            if (hero) {
                chosen_units[hero.attributes.type] = 1;
            } else if (chosen_units.hasOwnProperty(HEROES)) {
                chosen_units[chosen_units[HEROES]] = 1;
            }

            if (this.hasNavalUnits(chosen_units)) {
                runtimes = Object.keys(runtimes).reduce(
                    function(filtered, type) {
                        if (GameData.units.hasOwnProperty(type) && GameData.units[type].is_naval) {
                            filtered[type] = runtimes[type];
                        }

                        return filtered;
                    }, {}
                );
            }

            var filtered_runtimes = Object.keys(runtimes).reduce(
                function(filtered, type) {
                    if (chosen_units.hasOwnProperty(type) && chosen_units[type] > 0) {
                        filtered.push(runtimes[type]);
                    }

                    return filtered;
                }, []
            );

            if (!town_type) {
                town_type = TOWN_TYPES_ENUM.TOWN;
            }

            var slowest_runtime = Math.max.apply(this, filtered_runtimes),
                bonus = this.getSpeedBonus(chosen_units, null, hero);

            if (town_type === TOWN_TYPES_ENUM.FARM_TOWN) {
                return Math.max(1, slowest_runtime / bonus);
            }

            // Apply setup time between towns
            var setup_time = 0;
            if (town_type !== TOWN_TYPES_ENUM.ATTACK_SPOT) {
                setup_time = Math.max(60, 900 / Game.game_speed);
            }

            return Math.max(setup_time, ((slowest_runtime - setup_time) / bonus) + setup_time);
        },

        /**
         * Get the bonus that should be applied to units (or a specific unit type),
         * based on the other units they are traveling with
         *
         * @param {Object}      chosen_units { unit_id => amount }
         * @param {string|null} unit_type
         * @param {Object|null} hero         { attributes => { type => hero_id, level => hero_level } }
         *
         * @returns {Number}
         */
        getSpeedBonus: function(chosen_units, unit_type, hero) {
            var bonus = 1.0;

            if (chosen_units.hasOwnProperty(NAVAL_UNITS.SIREN) &&
                (!unit_type || GameData.units[unit_type].is_naval)
            ) {
                bonus += Math.min(chosen_units[NAVAL_UNITS.SIREN] * 0.02, 1);
            }

            if (hero && hero.attributes.type === HERO_TYPES.ATALANTA) {
                bonus += 0.1 + hero.attributes.level * 0.01;
            }

            return bonus;
        },

        /**
         * Caclulates how many ships (fast or slow) will user need to transport units
         *
         * @param {Number} town_id
         * @param {Object} units        key-value array where key is unit id and value
         *                                is amount of units which has to be transported
         *
         * @return {Object}  Hash Array
         *     {Number} total_capacity      represents how many troops can be transported
         *     {Number} total_population    represents how much space is needed to transport units
         *                                    (Remember, some units are 'bigger', for example 'rider')
         *       {Number} slow_boats_needed   determinates how many slow boats (with bigger capacity)
         *                                    will be needed to carry troops
         *       {Number} fast_boats_needed   determinates how many fast boats (with smaller capacity)
         *                                    will be needed to carry troops
         */
        calculateCapacity: function(town_id, units) {
            var gd_units = GameData.units,
                gd_unit,
                town = ITowns.getTown(town_id),
                researches, berth = 0;

            if (town) {
                researches = town.getResearches();
                berth = researches.hasBerth() ? GameDataResearches.getBonusBerth() : 0;
            }

            var unit_id, unit_count,
                total_capacity = 0,
                needed_capacity = 0,
                big_transporter_capacity = gd_units.big_transporter.capacity,
                small_transporter_capacity = gd_units.small_transporter.capacity;

            //Calculate capacity of selected transport ships and total population
            //of selected units
            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    unit_count = units[unit_id];
                    gd_unit = gd_units[unit_id];

                    //Do something only if number of units is bigger than 0, and
                    //if unit doesn't fly, because only that unit can take some place
                    if (unit_count > 0 && !gd_unit.flying) {
                        if (gd_unit.is_naval) {
                            total_capacity += gd_unit.capacity > 0 ? (gd_unit.capacity + berth) * unit_count : 0;
                        } else if (unit_id === GROUND_UNITS.SPARTOI) {
                            needed_capacity += unit_count;
                        } else {
                            needed_capacity += gd_unit.population * unit_count;
                        }
                    }
                }
            }

            return {
                total_capacity: total_capacity,
                needed_capacity: needed_capacity,
                slow_boats_needed: Math.ceil(needed_capacity / (big_transporter_capacity + berth)),
                fast_boats_needed: Math.ceil(needed_capacity / (small_transporter_capacity + berth))
            };
        },

        /**
         * Return the total amount of booty for a given set of units
         *
         * @param {Object} units { unit_id => amount}
         *
         * @returns {Number}
         */
        getTotalBooty: function(units) {
            return Object.keys(units).reduce(
                function(booty, type) {
                    return booty + (GameData.units[type].booty ? GameData.units[type].booty * units[type] : 0);
                },
                0
            );
        },

        /**
         * return translated unit name from GameData.units
         * @returns {string}
         */
        getTranslatedUnitNameSingular: function(unit_id) {
            return GameData.units[unit_id].name;
        },

        /**
         * return translated unit name (plural) from GameData.units
         * @returns {string}
         */
        getTranslatedUnitNamePlural: function(unit_id) {
            return GameData.units[unit_id].name_plural;
        },

        /**
         * return unit speed from GameData.units or GameData.heroes, if it is a hero
         * @param {string} unit_id
         * @returns {Number}
         */
        getUnitSpeed: function(unit_id) {
            var unit = GameData.units[unit_id] || GameData.heroes[unit_id];
            return unit.speed;
        },

        getUnit: function(unit_id) {
            return GameData.units[unit_id];
        },

        getCombinedIconCssClasses: function(unit_id) {
            var unit = this.getUnit(unit_id),
                FUNCTIONS = require('enums/unit_function'),
                result = [];

            if (unit.unit_function === FUNCTIONS.OFFENSIVE_DEFENSIVE) {
                result.push(FUNCTIONS.OFFENSIVE, FUNCTIONS.DEFENSIVE);
            } else {
                result.push(unit.unit_function);
            }

            result = result.concat(unit.special_abilities);
            result.push(unit.category);

            return result;
        }
    };

    window.GameDataUnits = GameDataUnits;

    return GameDataUnits;
});