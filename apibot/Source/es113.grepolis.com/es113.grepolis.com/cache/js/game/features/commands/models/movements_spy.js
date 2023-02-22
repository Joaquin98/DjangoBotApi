/*global window, Timestamp */

define('features/commands/models/movements_spy', function() {
    'use strict';

    var MovementsBase = require('features/commands/models/movements_base');

    /**
     * @property {window.GameModels.MovementsSpy}
     */
    var MovementsSpy = MovementsBase.extend({
        urlRoot: 'MovementsSpy',

        /**
         * Returns the time left until the spy arrives
         *
         * @returns {Number}
         */
        getTimeLeft: function() {
            return Math.max(0, this.getArrivalAt() - Timestamp.now());
        },

        /**
         * Returns group id (Commands are splited to multiple groups like 'unit_movements',
         * 'spy_movements', 'colonization_movements', 'revolts', 'conquers_movements')
         *
         * @return {String}
         */
        getGroupId: function() {
            return 'spy_movements';
        },

        /**
         * Returns movement type
         *     Possible types:
         *     - "attack_land"
         *     - "farm_attack"
         *
         * return {String}
         */
        getType: function() {
            return 'attack_spy';
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
         * Returns time left until this spy can not canceled any more
         *
         * @returns {Number}
         */
        getCancelTimeLeft: function() {
            return Math.max(0, this.getCancelableUntil() - Timestamp.now());
        },

        /**
         * Returns the spying id
         *
         * @return {Number}
         */
        getSpyingId: function() {
            return this.get('spying_id');
        },

        getCancelableUntil: function() {
            return this.get('cancelable_until');
        },

        /**
         * Returns the command id
         *
         * @return {Number}
         */
        getCommandId: function() {
            return this.getSpyingId();
        },

        getPayedIron: function() {
            return this.get('payed_iron');
        }
    });

    window.GameModels.MovementsSpy = MovementsSpy;

    return MovementsSpy;
});