/*globals GameDataInstantBuy, NotificationLoader, ITowns, GameDataConstructionQueue */

(function() {
    'use strict';

    var ConstructionQueueHelper = {
        UNIT: 'unit',
        BUILDING: 'building',
        RESEARCH: 'research',
        HERO: 'hero',

        isUnitOrderQueueFull: function(town_id) {
            var itown = ITowns.getTown(town_id),
                unit_orders_collection = itown.getUnitOrdersCollection(),
                unit_orders = unit_orders_collection.getAllOrders();

            return unit_orders.length === GameDataConstructionQueue.getUnitOrdersQueueLength() * 2; //*2 because queue in barracns and docks have to be full in the same time
        },

        getQueueType: function(strategy) {
            return strategy.getQueueType();
        },

        doInitializeTimer: function(strategy, index) {
            return strategy.doInitializeTimer(index);
        },

        doInitializeProgressbar: function(strategy, index) {
            return strategy.doInitializeProgressbar(index);
        },

        doInitializePremiumButton: function(strategy, index) {
            return strategy.doInitializePremiumButton(index);
        },

        doInitializePremiumButtonInTheTooltip: function(strategy, index) {
            return !this.doInitializePremiumButton(strategy, index);
        },

        isResearchQueue: function(strategy) {
            return this.getQueueType(strategy).indexOf('type_research_queue') > -1;
        },

        isUnitQueue: function(strategy) {
            return this.getQueueType(strategy).indexOf('type_unit_queue') > -1;
        },

        isBuildingQueue: function(strategy) {
            return this.getQueueType(strategy).indexOf('type_building_queue') > -1;
        },

        getCompletionTimeTooltip: function(strategy, order) {
            return strategy.getCompletionTimeTooltip(order);
        },

        getItemName: function(strategy, item_id) {
            return strategy.getItemName(item_id);
        },

        getViewClass: function(strategy) {
            return strategy.getViewClass();
        },

        getPremiumActionButtonSettings: function(strategy, order) {
            return strategy.getPremiumActionButtonSettings(order);
        },

        /**
         * callback is only for mass recruit
         */
        onPremiumActionCall: function(strategy, orders, order, _btn, callback) {
            strategy.onPremiumActionCall(_btn, order, orders, GameDataInstantBuy.getPremiumFeaturePrice(strategy, order), function() {
                NotificationLoader.resetNotificationRequestTimeout(1000);

                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    };

    window.ConstructionQueueHelper = ConstructionQueueHelper;
}());