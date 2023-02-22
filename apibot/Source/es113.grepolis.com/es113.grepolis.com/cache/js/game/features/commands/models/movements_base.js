/*globals Timestamp */
define('features/commands/models/movements_base', function() {
    'use strict';

    var Model = require_legacy('GrepolisModel');

    return Model.extend({

        getRealTimeLeft: function() {
            return this.getArrivalAt() - Timestamp.now();
        },

        /**
         * Returns timestamp when troops will reach the target
         *
         * @return {Number}
         */
        getArrivalAt: function() {
            return this.get('arrival_at');
        },

        /**
         * Determinates whether the command can be canceled or not
         *
         * @return {Boolean}
         */
        isCancelable: function() {
            return this.get('cancelable') === true;
        },

        /**
         * Returns movement id
         *
         * @return {Number}
         */
        getId: function() {
            return this.get('id');
        },

        /**
         * Determinates whether movement is incoming or outgoing
         *
         * @return {Boolean}
         */
        isIncommingMovement: function() {
            return false;
        },

        isReturning: function() {
            return false;
        },

        /**
         * Returns timestamp which determinates when movement was started
         *
         * @return {Number}
         */
        getStartedAt: function() {
            return this.get('started_at');
        },

        getCancelableUntil: function() {
            return -1;
        },

        /**
         * Returns time left until this command can not canceled any more
         *
         * @returns {Integer}
         */
        getCancelTimeLeft: function() {
            return -1;
        },

        /**
         * returns the unified, state aware finish timestamp
         * @returns {*|Number}
         */
        getCommandFinishTimestamp: function() {
            return this.getArrivalAt();
        },

        isAborted: function() {
            return this.getType() === 'abort';
        }
    });
});