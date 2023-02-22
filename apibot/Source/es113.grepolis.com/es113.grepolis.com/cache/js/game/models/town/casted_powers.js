/* globals window, GameDataPowers, GameData, GrepolisModel  */

(function() {
    'use strict';

    var CastedPowers = GrepolisModel.extend({
        urlRoot: 'CastedPowers',

        /**
        configuration: null
        end_at: 1379275540
        extended: 0
        id: 38
        level: null
        origin_player_id: 4
        power_id: "happiness"
        town_id: 105
         */

        defaults: {
            end_at: null,
            power_id: null,
            level: null,
            extended: 0,
            town_id: null,
            configuration: {}
        },

        getEndAt: function() {
            return this.get('end_at');
        },

        isCallOfTheOcean: function() {
            return this.getPowerId() === 'call_of_the_ocean';
        },

        getPowerId: function() {
            return this.get('power_id');
        },

        getCssPowerId: function() {
            return GameDataPowers.getCssPowerId(this.attributes);
        },

        getCssPowerIdWithLevel: function() {
            return GameDataPowers.getCssPowerIdWithLevel(this.getCssPowerId(), this.getLevel(), this.getPowerId());
        },

        isExtendable: function() {
            return GameData.powers[this.getPowerId()].favor > 0 &&
                (this.get('extended') > 0 && GameData.powers[this.getPowerId()].extendible === true);
        },

        getGodId: function() {
            return GameData.powers[this.getPowerId()].god_id;
        },

        getLevel: function() {
            return this.hasConfiguration() ? this.getConfiguration().level : false;
        },

        getSkin: function() {
            return this.hasConfiguration() ? this.getConfiguration().type : '';
        },

        getTownId: function() {
            return this.get('town_id');
        },

        getId: function() {
            return this.get('id');
        },

        isNegative: function() {
            var power_id = this.getPowerId(),
                gd_powers = GameData.powers;

            return gd_powers[power_id].negative === true;
        },

        setDefaultPowerConfiguration: function() {
            this.set('configuration', GameData.powers[this.getPowerId()].meta_defaults);
        },

        /**
         * return the configuration or the default configuration from GameData.
         */
        getConfiguration: function() {
            return this.get('configuration');
        },

        hasConfiguration: function() {
            return this.get('configuration') !== null;
        },

        /**
         * Extends power for gold
         *
         * @param {Object|Function} [callbacks]
         *
         * @returns {void}
         */
        extend: function(callbacks) {
            var params = {
                id: this.getId()
            };

            this.execute('extend', params, callbacks);
        },

        /**
         * Cast power
         *
         * @param {Object|Function} [callbacks]
         *
         * @returns {void}
         */
        cast: function(callbacks) {
            var params = {
                power_id: this.getPowerId(),
                target_id: this.getTownId()
            };

            this.execute('cast', params, callbacks);
        }
    });

    window.GameModels.CastedPowers = CastedPowers;
}());