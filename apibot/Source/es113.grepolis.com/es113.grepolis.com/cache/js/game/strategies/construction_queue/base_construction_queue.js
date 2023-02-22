/*globals GameControllers */

define('strategy/base_construction_queue', function() {
    'use strict';

    function BaseConstructionQueue(data) {
        //Parent class is called during game load because of .inherits(), so 'data' might be undefined
        if (typeof data !== 'undefined') {
            this.data = data;
            this.collections = data.collections || {};
            this.models = data.models || {};
            this.l10n = data.l10n || {};
        }
    }

    /**
     * @see GameControllers.BaseController
     */
    BaseConstructionQueue.prototype.getl10n = function() {
        return GameControllers.BaseController.prototype.getl10n.apply(this, arguments);
    };

    /**
     * @see GameControllers.BaseController
     */
    BaseConstructionQueue.prototype.getCollection = function() {
        return GameControllers.BaseController.prototype.getCollection.apply(this, arguments);
    };

    BaseConstructionQueue.prototype.getOrderById = function(order_id) {
        return this.getOrdersCollection().getOrderById(order_id);
    };

    /**
     * @see GameControllers.BaseController
     */
    BaseConstructionQueue.prototype.getModel = function() {
        return GameControllers.BaseController.prototype.getModel.apply(this, arguments);
    };

    BaseConstructionQueue.prototype.getIconType = function() {
        throw 'Please implement getIconType method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getQueueType = function() {
        throw 'Please implement getQueueType method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getTemplateName = function() {
        throw 'Please implement getTemplateName method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getViewClass = function() {
        throw 'Please implement getViewClass method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getControllerClass = function() {
        throw 'Please implement getControllerClass method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.onPremiumActionCall = function() {
        throw 'Please implement onPremiumActionCall method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getBuildTimeReductionButtonTooltip = function() {
        throw 'Please implement getBuildTimeReductionButtonTooltip method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getCancelOrderTooltip = function() {
        throw 'Please implement getCancelOrderTooltip method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.onOrderCancel = function() {
        throw 'Please implement onOrderCancel method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getCompletionTimeTooltip = function() {
        throw 'Please implement getCompletionTimeTooltip method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getItemName = function() {
        throw 'Please implement getItemName method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.doInitializeTimer = function() {
        throw 'Please implement doInitializeTimer method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.doInitializeProgressbar = function() {
        throw 'Please implement doInitializeProgressbar method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.doInitializePremiumButton = function() {
        throw 'Please implement doInitializePremiumButton method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getPremiumFeaturePrice = function() {
        throw 'Please implement getPremiumFeaturePrice method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getOrdersCollection = function() {
        throw 'Please implement getOrdersCollection method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getOrders = function() {
        throw 'Please implement getOrders method for the strategy which inherits from BaseConstructionQueue';
    };

    BaseConstructionQueue.prototype.getCurrentTownModel = function() {
        return GameControllers.ConstructionQueueBaseController.prototype.getCurrentTownModel.apply(this, arguments);
    };

    BaseConstructionQueue.prototype.__getHalveBuildingTimeNotEnoughGoldWindowData = function(order, orders, building_type) {
        return {
            type: order.getType(),
            order_id: order.getId(),
            completed_at: order.getToBeCompletedAt(),
            completed_at_prev: this._getCompletedAtOfPreviousOrder(order, orders),
            building_type: building_type || null
        };
    };

    BaseConstructionQueue.prototype._getCompletedAtOfPreviousOrder = function(order, orders) {
        var completed_at_prev = 0;

        // determine the previous completed_at to calculate the real build time of current order
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].getId() < order.getId()) {
                completed_at_prev = orders[i].getToBeCompletedAt();
            }
        }

        return completed_at_prev;
    };

    return BaseConstructionQueue;
});