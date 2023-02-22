/*global GameData */

/**
 * Collection which represents supports
 */
(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var Units = window.GameModels.Units;

    var UnitsCollection = function() {}; // never use this, becasue it will be overwritten

    UnitsCollection.model = Units;
    /**
     * model_class is used for reFetch, Backend Model is still 'Units'
     */
    UnitsCollection.url_root = 'Unit';
    UnitsCollection.model_class = 'Units';

    /**
     * Returns array of models which represents all supports and units in town
     * (units in town are added only for the towns which player owns)
     *
     * @return {Array}
     */
    UnitsCollection.getSupportsAndUnitsInTown = function() {
        return this.models;
    };

    /**
     * Returns array of models which represents all supports
     *
     * @return {Array}
     */
    UnitsCollection.getSupports = function() {
        var model, models = this.getSupportsAndUnitsInTown(),
            i, l = models.length,
            supports = [];

        for (i = 0; i < l; i++) {
            model = models[i];

            if (!model.areTownUnits()) {
                supports.push(model);
            }
        }

        return supports;
    };

    /**
     * Returns model which represents units in specific town or false if there
     * are no units in town
     *
     * @return {GameModels.Units|Boolean}
     */
    UnitsCollection.getUnitsInTown = function() {
        return this.find(function(unit) {
            return unit.areTownUnits();
        }) || false;
    };

    /**
     * Returns key-value array with 'unit_id' as a key and calculated
     * total amount of units as a value which is sum of units in
     * the town (if player who opens the window is owner of the town) and
     * sum of all his supports for this town
     *
     * @return {Object}
     */
    UnitsCollection.calculateTotalAmountOfUnits = function() {
        var support, supports = this.getSupportsAndUnitsInTown(),
            i, l = supports.length,
            unit_id, units, total = {};

        //Loop trough all supports and units from town
        for (i = 0; i < l; i++) {
            support = supports[i];
            units = support.getUnits();

            //Loop trough all units in the support or in town
            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    if (!total.hasOwnProperty(unit_id)) {
                        total[unit_id] = 0;
                    }

                    //Sum all units of the same type
                    total[unit_id] += units[unit_id];
                }
            }
        }

        return total;
    };

    /**
     * Returns key-value array with 'unit_id' as a key and calculated
     * total amount of units as a value which is sum of supporting units in
     * the town
     *
     * @return {Object}
     */
    UnitsCollection.calculateTotalAmountOfSupports = function() {
        return this.reduce(function(summed_supports, unit) {
            if (unit.areSupporting()) {
                return unit.getSumOfUnits(summed_supports);
            } else {
                return summed_supports;
            }
        }, {});
    };

    UnitsCollection.hasNavalUnits = function() {
        var support, supports = this.getSupportsAndUnitsInTown(),
            i, l = supports.length,
            unit_id, units;

        //Loop trough all supports and units from town
        for (i = 0; i < l; i++) {
            support = supports[i];
            units = support.getUnits();

            //Loop trough all units in the support or in town
            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id) && GameData.units[unit_id] /* excluding heroes */ && GameData.units[unit_id].is_naval) {
                    return true;
                }
            }
        }

        return false;
    };

    UnitsCollection.hasLandUnits = function() {
        var support, supports = this.getSupportsAndUnitsInTown(),
            i, l = supports.length,
            unit_id, units;

        //Loop trough all supports and units from town
        for (i = 0; i < l; i++) {
            support = supports[i];
            units = support.getUnits();

            //Loop trough all units in the support or in town
            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id) && (GameData.heroes[unit_id] || (GameData.units[unit_id] && !GameData.units[unit_id].is_naval))) {
                    return true;
                }
            }
        }

        return false;
    };

    UnitsCollection.getLandUnits = function(non_mythological_only_arg, exclude_support) {
        var result = {},
            land_units,
            unit_type, unit_amount;

        this.filter(function(model) {
            if (exclude_support) {
                return model.areTownUnits();
            }
            return true;
        }).forEach(function(model) {
            land_units = model.getLandUnits(non_mythological_only_arg);

            for (unit_type in land_units) {
                if (land_units.hasOwnProperty(unit_type)) {
                    unit_amount = land_units[unit_type];
                    result[unit_type] = (result[unit_type] || 0) + unit_amount;
                }
            }
        });

        return result;
    };

    UnitsCollection.onUnitsChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    UnitsCollection.onUnitsColonizeShipChange = function(obj, callback) {
        obj.listenTo(this, 'change:colonize_ship', callback);
    };

    window.GameCollections.Units = GrepolisCollection.extend(UnitsCollection);
}());