/*global GameControllers*/
(function() {
    'use strict';

    var ResearchesQueueController = GameControllers.ConstructionQueueBaseController.extend({
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
            return this.getCollection('research_orders');
        },

        getOrders: function() {
            return this.getOrdersCollection().getOrders();
        },

        getOrdersCount: function() {
            return this.getOrdersCollection().getCount();
        },

        /**
         * @overwrite
         */
        getQueueSubContextName: function() {
            return this.getSubContext() + '_research_queue';
        },

        areRequirementsFulfilled: function() {
            return true;
        },

        /**
         * ========================================
         * CONSTRUCTION QUEUE TYPE SPECIFIC METHODS
         * ========================================
         */

        destroy: function() {
            GameControllers.ConstructionQueueBaseController.prototype.destroy.apply(this, arguments);
        }
    });

    window.GameControllers.ResearchesQueueController = ResearchesQueueController;
}());