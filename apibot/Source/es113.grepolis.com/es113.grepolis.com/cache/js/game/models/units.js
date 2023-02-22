/*global GameData, GameDataHeroes, TownRelationProvider, GrepolisModel */
(function() {
    'use strict';

    var GameDataUnits = require('data/units');
    var Units = function() {},
        final_class;

    Units.urlRoot = 'Units';
    Units.UNIT_TYPES = GameDataUnits.getUnitTypeOrder();

    function reduceUnitType(closure, start, context) {
        var unit_type_idx, unit_types_length = Units.UNIT_TYPES.length,
            unit_type,
            result = start;

        for (unit_type_idx = 0; unit_type_idx < unit_types_length; ++unit_type_idx) {
            unit_type = Units.UNIT_TYPES[unit_type_idx];
            result = closure.call(context || {}, unit_type, result);
        }

        return result;
    }

    function sortByUnitTypes(units) {
        var result = {};

        return reduceUnitType(function(unit_type, result) {
            if (units.hasOwnProperty(unit_type)) {
                result[unit_type] = units[unit_type];
            }

            return result;
        }, result);
    }

    /**
     * Returns key-value array with units ids and amount of units which
     * are in this specific support
     * todo: can it be something different than support?
     * todo: adjust comment why it is here and what this function does exactly
     * @return {Object}
     */
    Units.getUnits = function() {
        //todo: adjust variable names?
        var units = {},
            i, heroes, hero, hl;

        units = reduceUnitType(function(unit_type, result) {
            var count = this.getUnitCount(unit_type);

            if (count > 0) {
                result[unit_type] = count;
            }

            return result;
        }, units, this);

        // inject heroes into response
        if (this.hasHeroes()) {
            heroes = this.getHeroes();
            hl = heroes.length;
            for (i = 0; i < hl; i++) {
                hero = heroes[i];
                // This method is used for layout and other display stuff in the frontend.
                // In those places the usual unit amount counter represents the level for heroes
                units[hero.getId()] = hero.getLevel();
            }
        }

        return units;
    };

    /**
     * TODO: add comment why this function is here
     *
     * @returns {Array} of heroes
     */
    Units.getHeroes = function() {
        var player_hero, player_heroes = [],
            heroes = this.get('heroes'),
            i, hl;

        if (heroes !== null) {
            hl = heroes.length;

            for (i = 0; i < hl; i++) {
                player_hero = GameDataHeroes.getHeroModel(heroes[i].type);
                //TODO: add method to player hero model that checks if a hero is really in town
                if (player_hero && player_hero.isAssignedToTown() && !player_hero.isTravelingToTown()) {
                    player_heroes.push(player_hero);
                }
            }
        }

        return player_heroes;
    };

    /**
     * TODO: adjust comment why this function is here
     * units model has heroes
     *
     * @returns {Boolean}
     */
    Units.hasHeroes = function() {
        var heroes = this.getHeroes();
        //TODO: heroes is always an array - check condition
        return heroes !== null && heroes.length > 0;
    };

    /**
     * Return the object of units that would be left after substracting the given units
     * TODO: add the one place where and why this function is used
     * TODO: also check if we can move this somewhere else because it's only used in old overview window
     * TODO: rename to something that reflects the difference better (suggestion: getDifference())
     *
     * @param {Object} units_to_substract
     * @returns {Object}
     */
    Units.calculateRemainingUnitsAfterSubstraction = function(units_to_substract) {
        var units = this.getUnits(),
            unit_id;

        for (unit_id in units) {
            if (units.hasOwnProperty(unit_id)) {
                //TODO: there is no check for wrong unit types in units_to_substract
                if (units_to_substract[unit_id]) {
                    units[unit_id] -= units_to_substract[unit_id];
                }
            }
        }

        return units;
    };

    /**
     * Return a map with unit_id -> unit_amount that contains the summed up units of
     * the given map of the same format and this model
     * TODO: check if bug occurs somewhere (beforehand units_to_add was never used due to copy paste)
     * TODO: rename function like the one above because they are connected (it simply adds units to this object)
     *
     * @param {Object} units_to_add
     * @returns {Object} unit_id -> unit_amount
     */
    Units.getSumOfUnits = function(units_to_add) {
        var units = this.getUnits(),
            unit_id;

        for (unit_id in units) {
            if (units.hasOwnProperty(unit_id)) {
                //TODO: what happens if new unit type is added?
                if (units_to_add[unit_id]) {
                    units[unit_id] += units_to_add[unit_id];
                }
            }
        }

        return units;
    };

    Units.getId = function() {
        return this.get('id');
    };

    //TODO: rename function to match the model property
    Units.getTargetPlayerLink = function() {
        return this.get('current_player_link');
    };

    //TODO: rename function to match the model property
    Units.getTargetTownLink = function() {
        return this.get('current_town_link');
    };

    /**
     * The town id where the units are now, empty if they are traveling
     *
     * @returns {integer}
     */
    Units.getCurrentTownId = function() {
        return this.get('current_town_id');
    };

    //TODO: rename function to match property of model
    Units.getOriginTownLink = function() {
        return this.get('home_town_link');
    };

    /**
     * get unit home town id
     * TODO: rename function to match property
     *
     * @returns {integer}
     */
    Units.getOriginTownId = function() {
        return this.get('home_town_id');
    };

    //TODO: change to getHomeTown if function above is renamed
    Units.getOriginTown = function() {
        //TODO: add comment that relation provider is a workaround for now
        var town_relation_provider = new TownRelationProvider(this.getOriginTownId());

        return town_relation_provider.getModel();
    };

    /**
     * are the units on the same island as their home town
     * TODO: reflect home town in function name
     *
     * @returns {boolean}
     */
    Units.isSameIsland = function() {
        //TODO: make sure it's always a js boolean
        return this.get('same_island');
    };

    /**
     * are the units in their hometown?
     * TODO: rename function to areUnitsStationedInTown or something similar
     *
     * @returns {boolean}
     */
    Units.areTownUnits = function() {
        return this.getOriginTownId() === this.getCurrentTownId();
    };

    /**
     * units are traveling?
     *
     * @returns {boolean}
     */
    Units.areTraveling = function() {
        //TODO: add explicit check for null
        return !this.getCurrentTownId();
    };

    /**
     * units are in a foreign town supporting
     *
     * @returns {boolean}
     */
    Units.areSupporting = function() {
        return !this.areTraveling() && !this.areTownUnits();
    };

    Units.getUnitCount = function(unit_id) {
        return this.get(unit_id);
    };

    /**
     * Returns information whether colonization ships are in the town or not
     *
     * @return {Boolean}
     */
    Units.hasColonizationShip = function() {
        var amount = this.get('colonize_ship');

        return amount > 0;
    };

    /**
     *
     * Returns information whether there was a colonization ship before in the town or not
     *
     * @returns {boolean}
     */
    Units.hadAlreadyAColonizationShipBefore = function() {
        var amount = this.previousAttributes().colonize_ship;

        return amount > 0;
    };

    /**
     * TODO: remove the supporting part because it just returns zero if units aren't supporting
     * If the units are supporting, these are the runtimes for each unit back to home town
     *
     * @returns {Object}
     *		{Object} ground_units key is unit_id value is integer
     *		{Object} naval_units  key is unit_id value is integer
     */
    Units.getRuntimes = function(callback) {
        this.execute('getRuntimes', {
            id: this.id
        }, callback);
    };

    Units.sendBack = function() {
        var params = {
            units_id: this.getId()
        };

        this.execute('sendBack', params);
    };

    /**
     * TODO: remove the part with home units because it can be also support units in this town
     *
     * of all home units in this town return all ground units
     *
     * @param {Boolean} non_mythological_only_arg
     * @return {Object}
     */
    Units.getLandUnits = function(non_mythological_only_arg) {
        var land_units = {},
            gd_units = GameData.units,
            origin_town = this.getOriginTown(),
            god_id = origin_town ? origin_town.getGod() : null,
            non_mythological_only = non_mythological_only_arg || false;

        land_units = reduceUnitType(function(unit_type, result) {
            var gd_unit = gd_units[unit_type];

            // filter out mythical units (unless explicitly wanted) which are not for the current town god (or all)
            if (unit_type !== 'militia' && !gd_unit.is_naval &&
                (
                    (!non_mythological_only && (!gd_unit.god_id ||
                        (god_id && (gd_unit.god_id === 'all' ||
                            gd_unit.god_id === god_id)))) ||
                    (non_mythological_only && !gd_unit.god_id)
                )
            ) {
                result[unit_type] = this.getUnitCount(unit_type);
            }

            return result;
        }, land_units, this);

        return land_units;
    };

    Units.getNavalUnits = function(non_mythological_only_arg) {
        var units = {},
            origin_town = this.getOriginTown(),
            god_id = origin_town ? origin_town.getGod() : null,
            non_mythological_only = non_mythological_only_arg || false;

        units = reduceUnitType(function(unit_type, result) {
            var gd_unit = GameData.units[unit_type];

            // filter out mythical units (unless explicitly wanted) which are not for the current town god (or all)
            if (gd_unit.is_naval && (
                    (!non_mythological_only &&
                        (!gd_unit.god_id || (god_id && (gd_unit.god_id === 'all' || gd_unit.god_id === god_id)))) ||
                    (non_mythological_only && !gd_unit.god_id))) {

                result[unit_type] = this.getUnitCount(unit_type);
            }

            return result;
        }, units, this);

        return units;
    };

    Units.getMythicalUnits = function() {
        var units = {},
            origin_town = this.getOriginTown(),
            god_id = origin_town ? origin_town.getGod() : null;

        units = reduceUnitType(function(unit_type, result) {
            var gd_unit = GameData.units[unit_type];

            if (gd_unit.god_id === 'all' || gd_unit.god_id === god_id) {
                result[unit_type] = this.getUnitCount(unit_type);
            }

            return result;
        }, units, this);

        return units;
    };

    Units.sendBackPart = function(units_to_send_back) {
        var params = {
            units_id: this.getId(),
            params: units_to_send_back
        };

        this.execute('sendBackPart', params);
    };

    final_class = GrepolisModel.extend(Units);

    final_class.sortByUnitTypes = sortByUnitTypes;

    window.GameModels.Units = final_class;
}());