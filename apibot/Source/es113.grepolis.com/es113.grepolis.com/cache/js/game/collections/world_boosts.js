define('collections/world_boosts', function(require) {
    'use strict';

    var BaseCollection = require_legacy('GrepolisCollection');
    var WorldBoostModel = require('models/world_boost');
    var BOOST_TYPES = require('enums/world_boost_types');

    var WorldBoosts = BaseCollection.extend({
        model: WorldBoostModel,
        model_class: 'WorldBoost',

        getWorldBoosts: function() {
            return this.models;
        },

        getWorldBoostFactorForUnitRecruitTime: function(gd_unit) {
            var boosts = this.getWorldBoosts(),
                boost,
                i,
                count = boosts.length,
                factor = 1.0;

            for (i = 0; i < count; i++) {
                boost = boosts[i];
                if (boost.getBoostType() === BOOST_TYPES.UNIT_ORDER_TIME) {
                    var percent = boost.getPercent() / 100.0;

                    if (percent !== 0 && boost.isUnitBoostForUnit(gd_unit)) {
                        factor *= 1 - percent;
                    }
                }
            }

            return Math.max(0.01, factor);
        }
    });

    window.GameCollections.WorldBoosts = WorldBoosts;

    return WorldBoosts;
});