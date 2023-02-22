/* global Timestamp, GrepolisModel, DateHelper, GameEvents */

(function() {
    'use strict';

    var ResearchOrder = GrepolisModel.extend({
        urlRoot: 'ResearchOrder',
        initialize: function() {
            this.on('remove', function(research_order) {
                $.Observer(GameEvents.town.research.done).publish(research_order);
            });
        },

        /**
         * @returns {Number}
         */
        getId: function() {
            return this.get('id');
        },

        /**
         *
         * @returns {string}
         */
        getType: function() {
            return this.get('research_type');
        },

        /**
         * Returns timestamp which indicates when the order has been put on the queue
         *
         * @return {Number}
         */
        getCreatedAt: function() {
            return this.get('created_at');
        },

        /**
         * Returns timestamp which indicates when the order will be finished
         *
         * @return {Number}
         */
        getToBeCompletedAt: function() {
            return this.get('to_be_completed_at');
        },

        /**
         * Returns amount of the time left till the order will be completed
         *
         * @returns {number}
         */
        getTimeLeft: function() {
            return Math.max(0, this.getRealTimeLeft());
        },

        getRealTimeLeft: function() {
            return this.getToBeCompletedAt() - Timestamp.now();
        },

        /**
         * Returns how much time in total the order needs to be finished
         * (keep in mind that it can be changed by time reduction)
         *
         * @return {Number}
         */
        getDuration: function() {
            return Math.max(0, this.getToBeCompletedAt() - this.getCreatedAt());
        },

        /**
         *
         * @returns {Number}
         */
        getTownId: function() {
            return this.get('town_id');
        },

        /**
         * create a new research order from this new model
         *
         * var model = new GameModels.ResearchOrder({research_type: 'some_type'})
         * model.research()
         *
         * @param callbacks
         */
        research: function(callbacks) {
            this.execute('research', {
                id: this.getType()
            }, callbacks);
        },

        /**
         * Revert a research
         *
         * @todo better be in Academy model
         * @param callbacks
         */
        revert: function(callbacks) {
            this.execute('revert', {
                id: this.getType()
            }, callbacks);
        },

        /**
         * cancel the last research order
         *
         * @todo better be in Academy model
         * @param callbacks
         */
        cancel: function(callbacks) {
            this.execute('cancel', {}, callbacks);
        },

        /**
         * Reduce research time for an order
         *
         * @param callbacks
         */
        halveResearchTime: function(callbacks) {
            this.execute('halveResearchTime', {
                order_id: this.getId()
            }, callbacks);
        },

        /**
         * Instantly buy research
         *
         * @param callbacks
         */
        buyInstant: function(callbacks) {
            this.execute('buyInstant', {
                order_id: this.getId()
            }, callbacks);
        },

        getCancelRefund: function() {
            return this.get('cancel_refund');
        },

        /**
         * Returns building order completion human readable date
         *
         * @return {String}
         */
        getCompletedAtHuman: function() {
            return DateHelper.formatDateTimeNice(this.getToBeCompletedAt(), true);
        },

        /**
         * Added for the compatibility with building orders
         *
         * @return {Boolean}
         */
        hasTearDown: function() {
            return false;
        },

        isBeingTearingDown: function() {
            return this.hasTearDown() === true;
        }
    });

    window.GameModels.ResearchOrder = ResearchOrder;
}());