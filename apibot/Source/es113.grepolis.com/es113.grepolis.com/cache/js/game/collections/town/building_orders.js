/*global GameEvents, GameDataConstructionQueue, us, GameDataInstantBuy, ConstructionQueueHelper, GameDataBuildings, CollectionAutomaticFetchFactory */

(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var BuildingOrder = window.GameModels.BuildingOrder;

    var BuildingOrders = function() {}; // never use this, becasue it will be overwritten

    BuildingOrders.model = BuildingOrder;
    BuildingOrders.model_class = 'BuildingOrder';

    BuildingOrders.initialize = function(models, options) {
        this.on('remove', function(building_order) {
            $.Observer(GameEvents.town.building.order.done).publish(building_order);
        });

        this.on('add', function(building_order) {
            $.Observer(GameEvents.town.building.order.start).publish(building_order);
        });

        this.comparator = function(model) {
            return model.getCreatedAt();
        };

        //There is a sense that only the currenlty active collection (currentCollection in Agnostic collection)
        // should wait for the time to do the request. Rest of collections can be ommited because they are not for the current town
        if (options.created_as_current_collection) {
            CollectionAutomaticFetchFactory.initializeNotificationRequestHandlerForConstructionQueue(this);
        }

        /**
         * we do not sort on model.add during gameload, so we have to do it here manually
         */
        $.Observer(GameEvents.game.start).subscribe(['building_orders'], function() {
            this.sort();
        }.bind(this));
    };

    /**
     * Returns number of active building orders
     *
     * @returns {Number}
     */
    BuildingOrders.getCount = function() {
        return this.length;
    };

    /**
     * Returns information whether the building queue is full or not
     *
     * @returns {Boolean}
     */
    BuildingOrders.isBuildingQueueFull = function() {
        var count = this.getCount(),
            max_count = GameDataConstructionQueue.getBuildingOrdersQueueLength();

        //Why bigger or equals ? Because you can construct 7 buildings, and minute later your advisor will expire...
        return count >= max_count;
    };

    /**
     * Returns number of building orders which upgrades or downgrades the same building type
     * as the one given as agrument
     *
     * @param {GameModels.BuildingOrder} building_order
     * @return {Number}
     */
    BuildingOrders.getCountOfPreviousOrdersInQueueOfSameType = function(building_order) {
        var building_id = building_order.getBuildingId(),
            order, orders = this.getOrders(),
            count = 0;

        for (var i = 0, l = orders.length; i < l; i++) {
            order = orders[i];

            if (order === building_order) {
                return count;
            }

            if (order.getBuildingId() === building_id) {
                count++;
            }
        }

        return count;
    };

    /**
     * Returns building level for building on buildings order depends on the building orders which are before it
     *
     * @param {GameModels.BuildingOrder} building_order
     * @return {Number}
     */
    BuildingOrders.getBuildingLevelDependsOnBuildingsInTheQueue = function(building_order) {
        var building_id = building_order.getBuildingId(),
            order, orders = this.getOrders(),
            count = 0;

        for (var i = 0, l = orders.length; i < l; i++) {
            order = orders[i];

            if (order === building_order) {
                return count;
            }

            if (order.getBuildingId() === building_id) {
                count += order.hasTearDown() ? -1 : 1;
            }
        }

        return count;
    };


    /**
     * Returns an array of building order models
     *
     * @param {String} building_id
     * @return {Number}
     */
    BuildingOrders.getCountOfOrdersInQueueOfSameType = function(building_id) {
        var orders = us.filter(this.getOrders(), function(order) {
            return order.getBuildingId() === building_id;
        });

        return orders.length;
    };

    BuildingOrders.isFirstOrder = function(order) {
        var orders = this.getOrders();

        for (var i = 0, l = orders.length; i < l; i++) {
            if (i === 0 && orders[i] === order) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns an array of building order models
     *
     * @return {Array}
     */
    BuildingOrders.getOrders = function() {
        return this.models;
    };

    BuildingOrders.getFirstOrder = function() {
        var orders = this.getOrders();

        return orders.length > 0 ? orders[0] : null;
    };

    /**
     * Returns order models depends on the building type
     *
     * @param building_id
     * @return {BuildingOrder|undefined}
     */
    BuildingOrders.getOrder = function(building_id) {
        return this.find(function(order) {
            return order.getBuildingId() === building_id;
        });
    };

    BuildingOrders.getOrderById = function(order_id) {
        return this.get(order_id);
    };

    BuildingOrders.isBuildingTearingDown = function(building_id) {
        return this.find(function(order) {
            return order.getBuildingId() === building_id && order.isBeingTearingDown();
        }) !== undefined;
    };

    /**
     * Listens on the building order count change
     *
     * @param {Backbone.View} obj
     * @param {Function}callback
     */
    BuildingOrders.onOrderCountChange = function(obj, callback) {
        obj.listenTo(this, 'add remove', callback);
    };

    BuildingOrders.onOrderPropertyChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    BuildingOrders.getPremiumFeaturePrice = function(order) {
        if (GameDataInstantBuy.isEnabled()) {
            var is_first_order = this.isFirstOrder(order),
                time_left = is_first_order ? order.getTimeLeft() : order.getDuration();

            return GameDataInstantBuy.getPriceForType(ConstructionQueueHelper.BUILDING, time_left);
        } else {
            return GameDataBuildings.getFinishBuildingOrderCost();
        }
    };

    window.GameCollections.BuildingOrders = GrepolisCollection.extend(BuildingOrders);

    /**
     * Mixin GrepolisCollectionAutomaticFetch into Trades
     */
    us.extend(window.GameCollections.BuildingOrders.prototype, window.GrepolisCollectionAutomaticFetch);
}());