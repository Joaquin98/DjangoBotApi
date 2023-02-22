/*global GameControllers*/
(function() {
    'use strict';

    var UnitsQueueController = GameControllers.ConstructionQueueBaseController.extend({
        renderPage: function() {
            GameControllers.ConstructionQueueBaseController.prototype.renderPage.apply(this, arguments);
        },

        registerEventsListeners: function() {
            GameControllers.ConstructionQueueBaseController.prototype.registerEventsListeners.apply(this, arguments);
        },

        /**
         * ========================================
         *     METHODS WHICH OVERWRITES PARENT
         * ========================================
         */

        /**
         * @overwrite
         */
        getOrdersCollection: function() {
            return this.getCollection('remaining_unit_orders');
        },

        getOrders: function() {
            return this.getOrdersCollection().getOrders(this.getBuildingType());
        },

        getOrdersCount: function() {
            return this.getOrdersCollection().getCount(this.getBuildingType());
        },

        /**
         * @overwrite
         */
        getQueueSubContextName: function() {
            return this.getSubContext() + '_unit_queue';
        },

        /**
         * @overwrite
         */
        areRequirementsFulfilled: function() {
            return true;
        },

        /**
         * ========================================
         * UNITS QUEUE TYPE SPECIFIC METHODS
         * ========================================
         */

        getBuildingType: function() {
            return this.options.building_type;
        },

        destroy: function() {
            GameControllers.ConstructionQueueBaseController.prototype.destroy.apply(this, arguments);
        }
    });

    window.GameControllers.UnitsQueueController = UnitsQueueController;
}());