/*global define, Timestamp */

define('features/commands/models/movements_revolt', function() {
    'use strict';

    var MovementsBase = require('features/commands/models/movements_base');

    return MovementsBase.extend({

        initialize: function() {},

        getTimeLeft: function() {
            return Math.max(0, this.getRealTimeLeft());
        },

        getRealTimeLeft: function() {
            if (this.isArising()) {
                return this.getStartedAt() - Timestamp.now();
            }

            return this.getFinishedAt() - Timestamp.now();
        },

        /**
         * Returns timestamp when revolt ends
         *
         * @return {Number}
         */
        getFinishedAt: function() {
            return this.get('finished_at');
        },

        /**
         * Returns group id (Commands are splited to multiple groups like 'unit_movements',
         * 'spy_movements', 'colonization_movements', 'revolts', 'conquers_movements')
         */
        getGroupId: function() {
            return 'revolts';
        },

        /**
         * Returns if this revolt is in foreign town
         *
         * @return {Boolean}
         */
        isBeyond: function() {
            return this.get('beyond');
        },

        isArising: function() {
            return this.get('arising');
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
            if (this.isArising()) {
                return 'revolt_arising';
            }

            return 'revolt_running';
        },

        getTownLink: function() {
            return this.get('link');
        },

        /**
         * Returns information that the colonization can not be canceled
         *
         * @return {Boolean}
         */
        isCancelable: function() {
            return false;
        },

        /**
         * returns the unified, state aware finish timestamp
         * @returns {*|Number}
         */
        getCommandFinishTimestamp: function() {
            if (this.isArising()) {
                return this.getStartedAt();
            }

            return this.getFinishedAt();
        }
    });
});