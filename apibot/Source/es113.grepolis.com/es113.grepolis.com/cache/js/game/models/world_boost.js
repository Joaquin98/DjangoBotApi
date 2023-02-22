define('models/world_boost', function() {
    'use strict';

    var BOOST_TYPES = require('enums/world_boost_types');
    var GrepolisModel = window.GrepolisModel;

    var WorldBoost = GrepolisModel.extend({
        urlRoot: 'WorldBoost',

        getPercent: function() {
            var configuration = this.getConfiguration();

            return configuration.percent ? configuration.percent : 0;
        },

        getType: function() {
            var configuration = this.getConfiguration();

            return configuration.type ? configuration.type : '';
        },

        isUnitBoostType: function() {
            var boost_type = this.getBoostType();

            return boost_type === BOOST_TYPES.UNIT_ATTACK ||
                boost_type === BOOST_TYPES.UNIT_DEFENSE ||
                boost_type === BOOST_TYPES.UNIT_ORDER_TIME;
        },

        isUnitBoostForUnit: function(unit) {
            var type = this.getType();

            return this.isUnitBoostType() && this.doesUnitTypeMatch(type, unit);
        },

        // private
        doesUnitTypeMatch: function(type, unit) {
            return type === 'all' ||
                type === unit.unit_id ||
                (type === 'ground' && !unit.is_naval) ||
                (type === 'naval' && unit.is_naval) ||
                (type === 'mythical' && unit.god_id) ||
                (type === 'non-mythical' && !unit.god_id);
        }
    });

    GrepolisModel.addAttributeReader(WorldBoost.prototype,
        'id',
        'boost_type',
        'configuration'
    );

    window.GameModels.WorldBoost = WorldBoost;
    return WorldBoost;
});