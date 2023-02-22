define('collections/casted_alliance_powers', function(require) {
    'use strict';

    var BaseCollection = require_legacy('GrepolisCollection');
    var CastedAlliancePowers = require('models/casted_alliance_powers');

    var CastedAlliancePowersCollection = BaseCollection.extend({
        model: CastedAlliancePowers,
        model_class: 'CastedAlliancePowers',

        getCastedAlliancePowers: function() {
            return this.models;
        },

        getCastedAlliancePowersByOrigin: function(origin) {
            return this.where({
                origin: origin
            });
        },

        onPowerAddRemove: function(obj, callback) {
            obj.listenTo(this, 'add remove', callback);
        },

        onPowerChanged: function(obj, callback) {
            obj.listenTo(this, 'change', callback);
        }
    });

    // this is needed for the model manager to discover this collection
    window.GameCollections.CastedAlliancePowers = CastedAlliancePowersCollection;

    return CastedAlliancePowersCollection;
});