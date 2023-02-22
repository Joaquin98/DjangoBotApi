/* globals MM, Game */
define('helpers/default_colors', function() {
    'use strict';

    var GameData = require('game/data');
    var FILTERS = require('enums/filters');

    /**
     * helper for getting default colors for different types
     */
    var HelperDefaultColors = {
        /**
         * get default color from the game data by id
         * @param {String} id
         * @returns {String}
         */
        getDefaultColorByIdFromGameData: function(id) {
            return GameData.default_flag_colors[id];
        },

        /**
         * Get default color by given type, id and additonal_id (like alliance id)
         * Depending on type different functions are called to get the next prio default color
         * @param {String} type
         * @param {Number} id
         * @param {Number} additional_id
         * @returns {String}
         */
        getDefaultColor: function(type, id, additional_id) {
            var color;

            if (type === FILTERS.ALLIANCE_TYPES.PACT || type === FILTERS.ALLIANCE_TYPES.ENEMY || type === FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE) {
                color = this.getDefaultColorByIdFromGameData(type);
            } else if (type === 'text') {
                color = '000000';
            } else {
                if (type === FILTERS.FILTER_TYPES.PLAYER) {
                    color = this.getDefaultColorForPlayer(id, additional_id);
                } else if (type === FILTERS.FILTER_TYPES.ALLIANCE) {
                    color = this.getDefaultColorForAlliance(id);
                }
            }

            return color;
        },

        /**
         * Getting default color for alliance, by considering the priorities for default colors of alliances
         * @param {Number} id
         * @returns {String}
         */
        getDefaultColorForAlliance: function(id) {
            var color;

            id = parseInt(id, 10);

            if (MM.getOnlyCollectionByName('AlliancePact').isAllianceWithCurrentAllianceInPeacePact(id)) {
                color = this.getDefaultColorForPeacePacts();
            } else if (MM.getOnlyCollectionByName('AlliancePact').isAllianceWithCurrentAllianceInWarPact(id)) {
                color = this.getDefaultColorForWarPacts();
            } else if (id === Game.alliance_id) {
                color = this.getDefaultColorByIdFromGameData(FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE);
            } else {
                color = this.getDefaultColorByIdFromGameData(FILTERS.DEFAULT_PLAYER);
            }

            return color;
        },

        /**
         * Getting default color for peace pact
         * @returns {String}
         */
        getDefaultColorForPeacePacts: function() {
            var color,
                custom_colors = MM.getOnlyCollectionByName('CustomColor');

            if (custom_colors.getPeacePactCustomColorIfSet()) {
                color = custom_colors.getPeacePactCustomColorIfSet().getColor();
            } else {
                color = this.getDefaultColorByIdFromGameData(FILTERS.ALLIANCE_TYPES.PACT);
            }

            return color;
        },

        /**
         * Getting default color for war pact
         * @returns {String}
         */
        getDefaultColorForWarPacts: function() {
            var color,
                custom_colors = MM.getOnlyCollectionByName('CustomColor');

            if (custom_colors.getWarPactCustomColorIfSet()) {
                color = custom_colors.getWarPactCustomColorIfSet().getColor();
            } else {
                color = this.getDefaultColorByIdFromGameData(FILTERS.ALLIANCE_TYPES.ENEMY);
            }

            return color;
        },

        /**
         * Getting default color for other player (not the current player) considering the priorities
         * @param {Number} additional_id
         * @param {Number} id
         * @returns {String}
         */
        getDefaultColorForOtherPlayer: function(additional_id, id) {
            var custom_colors = MM.getOnlyCollectionByName('CustomColor'),
                alliance_pacts = MM.getOnlyCollectionByName('AlliancePact'),
                parsed_additional_id = parseInt(additional_id, 10),
                color;

            if (parsed_additional_id === Game.alliance_id || parsed_additional_id === 0) {
                color = custom_colors.getCustomColorForOwnAlliance() || this.getDefaultColorForMemberOfAlliance(id);
            } else if (custom_colors.checkIfAllianceHasCustomColor(additional_id)) {
                color = custom_colors.checkIfAllianceHasCustomColor(additional_id).getColor();
            } else if (alliance_pacts.isAllianceWithCurrentAllianceInPeacePact(parseInt(additional_id, 10))) {
                color = this.getDefaultColorForPeacePacts();
            } else if (alliance_pacts.isAllianceWithCurrentAllianceInWarPact(parseInt(additional_id, 10))) {
                color = this.getDefaultColorForWarPacts();
            } else {
                color = this.getDefaultColorByIdFromGameData(FILTERS.DEFAULT_PLAYER);
            }

            return color;
        },

        /**
         * Getting default color for current player
         * @param {Number} id
         * @param {Number} additional_id
         * @returns {String}
         */
        getDefaultColorForPlayer: function(id, additional_id) {
            var color;

            if (id === Game.player_id) {
                color = this.getDefaultColorByIdFromGameData(FILTERS.OWN_PLAYER);
            } else {
                color = this.getDefaultColorForOtherPlayer(additional_id, id);
            }

            return color;
        },

        /**
         * Getting default color for an alliance member
         * @param {Number} id
         * @returns {String}
         */
        getDefaultColorForMemberOfAlliance: function(id) {
            var color;

            if (parseInt(id, 10) === Game.player_id) {
                color = this.getDefaultColorByIdFromGameData(FILTERS.OWN_PLAYER);
            } else {
                color = this.getDefaultColorByIdFromGameData(FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE);
            }

            return color;
        }
    };

    return HelperDefaultColors;
});