define('models/capped_powers_progress', function() {
    'use strict';

    var GrepolisModel = window.GrepolisModel;
    var CappedPowersProgress = GrepolisModel.extend({
        urlRoot: 'CappedPowersProgress',

        defaults: {
            casted_power_id: null,
            player_id: null,
            type: null,
            limit: null,
            progress: null
        },

        getPowerId: function() {
            return this.get('casted_power_id');
        },

        getPlayerId: function() {
            return this.get('player_id');
        },

        getType: function() {
            return this.get('type');
        },

        getLimit: function() {
            return this.get('limit');
        },

        getProgress: function() {
            return this.get('progress');
        }
    });

    window.GameModels.CappedPowersProgress = CappedPowersProgress;
    return CappedPowersProgress;
});