/*globals Timestamp */

(function() {
    "use strict";

    var DateHelper = require('helpers/date'),
        GrepolisModel = require_legacy('GrepolisModel');

    var BuildingOrder = GrepolisModel.extend({
        urlRoot: 'BuildingOrder',

        /**
         * Returns building order id
         *
         * @return {String}
         */
        getId: function() {
            return this.id;
        },

        /**
         * Determines whether the building order is an order to destroy or not
         *
         * @return {Boolean}
         */
        hasTearDown: function() {
            return this.get('tear_down') !== false;
        },

        isBeingTearingDown: function() {
            return this.hasTearDown() === true;
        },

        /**
         * Returns building id which is being in the construction or demolition
         *
         * @return {String}
         */
        getBuildingId: function() {
            return this.getType();
        },

        getType: function() {
            return this.get('building_type');
        },

        /**
         * Returns the town id that the building construction is being made
         *
         * @return {Number}
         */
        getTownId: function() {
            return this.get('town_id');
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
         * (keep in mind that it can be changed by build time reduction)
         *
         * @return {Number}
         */
        getDuration: function() {
            return Math.max(0, this.getToBeCompletedAt() - this.getCreatedAt());
        },

        /**
         * Returns how many resources you would get back when canceling this order
         *
         * @return {Object}
         */
        getCancelRefund: function() {
            return this.get('cancel_refund');
        },

        /**
         * Returns in percentages how much time has left till the order will be completed
         *
         * @return {Number}
         */
        getPercentageLeft: function() {
            var time_left = this.getTimeLeft(),
                time_total = this.getDuration();

            if (time_total === 0) {
                return 0;
            }

            return 1 - (time_left / time_total);

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
         * Place a new building order in the queue to raise a building level
         *
         * @param {Boolean} build_reduced use gold to build with less resources
         */
        buildUp: function(build_reduced, callback) {
            this.execute('buildUp', {
                building_id: this.getBuildingId(),
                town_id: this.getTownId(),
                build_for_gold: build_reduced
            }, (function() {
                if (typeof(callback) === 'function') {
                    callback();
                }
            }).bind(this));
        },

        /**
         * Places a tear down building order in the queue to reduce a building level
         */
        tearDown: function(callback) {
            this.execute('tearDown', {
                building_id: this.getBuildingId(),
                town_id: this.getTownId()
            }, (function() {
                if (typeof(callback) === 'function') {
                    callback();
                }
            }).bind(this));
        },

        /**
         * Cancels a building order (build up or tear down)
         * (Basically this bit of a hack executing this on a specific order since canceling always cancels the last order)
         */
        cancel: function(callback) {
            this.execute('cancel', {
                town_id: this.getTownId()
            }, (function() {
                if (typeof(callback) === 'function') {
                    callback();
                }
            }).bind(this));
        },

        /**
         * Halve build time of an order by using gold
         */
        halveBuildTime: function(callback) {
            this.execute('halveBuildTime', {
                order_id: this.getId()
            }, (function() {
                if (typeof(callback) === 'function') {
                    callback();
                }
            }).bind(this));
        },

        /**
         * Halve build time of an order by using gold
         */
        buyInstant: function(callback) {
            this.execute('buyInstant', {
                order_id: this.getId()
            }, (function() {
                if (typeof(callback) === 'function') {
                    callback();
                }
            }).bind(this));
        }
    });

    window.GameModels.BuildingOrder = BuildingOrder;
}());