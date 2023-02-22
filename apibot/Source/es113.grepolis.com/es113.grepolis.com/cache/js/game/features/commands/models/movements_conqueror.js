/*global define, Timestamp */

define('features/commands/models/movements_conqueror', function() {
    'use strict';

    var Model = require_legacy('GrepolisModel');

    var MovementsConqueror = Model.extend({
        urlRoot: 'MovementsConqueror',

        initialize: function() {

        },

        /**
         * Returns time left until conquer is finished
         *
         * @return {Number} seconds
         */
        getTimeLeft: function() {
            return Math.max(0, this.getConquestFinishedAt() - Timestamp.now());
        },

        getRealTimeLeft: function() {
            return this.getConquestFinishedAt() - Timestamp.now();
        },

        /**
         * Returns group id (Commands are splited to multiple groups like 'unit_movements',
         * 'spy_movements', 'colonization_movements', 'revolts', 'conquers_movements')
         */
        getGroupId: function() {
            return 'conqueror_units';
        },

        /**
         * Returns timestamp when conquering has finished
         *
         * @return {Number}
         */
        getConquestFinishedAt: function() {
            return this.get('conquest_finished_at');
        },

        /**
         * Returns game units id
         *
         * @return {Number}
         */
        getId: function() {
            return this.get('id');
        },

        /**
         * Returns base64 link to the town
         *
         * @return {String}
         */
        getTownLink: function() {
            return this.get('link');
        },

        /**
         * Returns name of the town
         *
         * @return {String}
         */
        getTownName: function() {
            return this.get('town_name');
        },

        /**
         * Returns id of the town
         *
         * @return {String}
         */
        getTownId: function() {
            return this.get('target_town_id');
        },
        /**
         * Returns the id of the units that are used to conquer
         *
         * @return {Number}
         */
        getUnitId: function() {
            return this.get('unit_id');
        },

        /**
         * Returns command type
         *
         * return {String} conqueror
         */
        getType: function() {
            return 'conqueror';
        },

        /**
         * Returns information that the colonization can not be canceled
         *
         * @return {Boolean}
         */
        isCancelable: function() {
            return false;
        },

        isReturning: function() {
            return false;
        },

        /**
         * Returns time left for command to be canceled (this command can not be
         * canceled, its created for compatibility reasons)
         *
         * @return {Integer}
         */
        getCancelTimeLeft: function() {
            return -1;
        },

        getCancelableUntil: function() {
            return -1;
        },

        /**
         * returns the unified, state aware finish timestamp
         * @returns {*|Number}
         */
        getCommandFinishTimestamp: function() {
            return this.getConquestFinishedAt();
        }
    });

    window.GameModels.MovementsConqueror = MovementsConqueror;
    return window.GameModels.MovementsConqueror;
});