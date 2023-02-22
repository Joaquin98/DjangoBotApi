/*global GameDataConstructionQueue, GameDataInstantBuy, ConstructionQueueHelper, GameDataBuildings, CollectionAutomaticFetchFactory, us */

(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var ResearchOrder = window.GameModels.ResearchOrder;

    var ResearchOrders = function() {}; // never use this, because it will be overwritten

    ResearchOrders.model = ResearchOrder;
    ResearchOrders.model_class = 'ResearchOrder';

    ResearchOrders.initialize = function(models, options) {
        //There is a sense that only the currenlty active collection (currentCollection in Agnostic collection)
        // should wait for the time to do the request. Rest of collections can be ommited because they are not for the current town
        if (options.created_as_current_collection) {
            CollectionAutomaticFetchFactory.initializeNotificationRequestHandlerForConstructionQueue(this);
        }
    };

    ResearchOrders.getOrders = function() {
        return this.models;
    };

    /**
     * Returns number of researches which are being in the building queue
     *
     * @return {Number}
     */
    ResearchOrders.getCount = function() {
        return this.getOrders().length;
    };

    /**
     * Returns information whether the research queue is full or not
     *
     * @returns {Boolean}
     */
    ResearchOrders.isResearchQueueFull = function() {
        var count = this.getCount(),
            max_count = GameDataConstructionQueue.getResearchOrdersQueueLength();

        return count === max_count;
    };

    ResearchOrders.isFirstOrder = function(order) {
        var orders = this.getOrders();

        for (var i = 0, l = orders.length; i < l; i++) {
            if (i === 0 && orders[i] === order) {
                return true;
            }
        }

        return false;
    };

    ResearchOrders.getFirstOrder = function() {
        var orders = this.getOrders();

        return orders.length > 0 ? orders[0] : null;
    };

    ResearchOrders.isResearchInQueue = function(research_id) {
        var orders = this.getOrders();

        for (var i = 0, l = orders.length; i < l; i++) {
            if (orders[i].getType() === research_id) {
                return true;
            }
        }

        return false;
    };

    ResearchOrders.getOrderById = function(order_id) {
        return this.get(order_id);
    };

    ResearchOrders.getPremiumFeaturePrice = function(order) {
        if (GameDataInstantBuy.isEnabled()) {
            var is_first_order = this.isFirstOrder(order),
                time_left = is_first_order ? order.getTimeLeft() : order.getDuration();

            return GameDataInstantBuy.getPriceForType(ConstructionQueueHelper.RESEARCH, time_left);
        } else {
            return GameDataBuildings.getFinishBuildingOrderCost();
        }
    };

    /**
     * Triggers an even every time when number of researches in order queue changes
     *
     * @param {Backbone.View} view
     * @param {Function} callback
     */
    ResearchOrders.onOrderCountChange = function(view, callback) {
        view.listenTo(this, 'add remove', callback);
    };

    ResearchOrders.onOrderPropertyChange = function(view, callback) {
        view.listenTo(this, 'change', callback);
    };

    window.GameCollections.ResearchOrders = GrepolisCollection.extend(ResearchOrders);

    /**
     * Mixin GrepolisCollectionAutomaticFetch into Trades
     */
    us.extend(window.GameCollections.ResearchOrders.prototype, window.GrepolisCollectionAutomaticFetch);
}());