define('collections/capped_powers_progresses', function(require) {
    'use strict';

    var BaseCollection = require_legacy('GrepolisCollection');
    var CappedPowersProgressModel = require('models/capped_powers_progress');

    var CappedPowersProgresses = BaseCollection.extend({
        model: CappedPowersProgressModel,
        model_class: 'CappedPowersProgress',

        getCappedPowerProgresses: function() {
            return this.models;
        },

        getCappedPowerProgressesForPowerIdAndType: function(power_id, type) {
            var progress = this.where({
                casted_power_id: power_id,
                type: type
            });
            return (progress.length > 0) ? progress[0] : null;
        }
    });

    // this is needed for the model manager to discover this collection
    window.GameCollections.CappedPowersProgresses = CappedPowersProgresses;

    return CappedPowersProgresses;
});