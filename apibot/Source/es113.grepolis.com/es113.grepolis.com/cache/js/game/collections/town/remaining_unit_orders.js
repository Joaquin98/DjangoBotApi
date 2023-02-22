/* global GameEvents, GameDataInstantBuy, ConstructionQueueHelper, GameDataUnits, us, CollectionAutomaticFetchFactory */

(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var UnitOrder = window.GameModels.UnitOrder;
    var UNIT_TYPES = require('enums/unit_types');

    var RemainingUnitOrders = function() {}; // never use this, because it will be overwritten

    RemainingUnitOrders.model = UnitOrder;
    RemainingUnitOrders.model_class = 'UnitOrder';

    RemainingUnitOrders.initialize = function() {
        this.comparator = function(model) {
            // We are comparing by ID because we want to keep the same order as the orders were created.
            // If last order is instantly bought it should not go to the beginning
            // due to the change of created_at and completed_at.
            return model.id;
        };

        // Force re-sort if order might change
        this.on('change:to_be_completed_at', this.sort.bind(this));

        this.on('remove', function(unit_order) {
            if (unit_order.getKind() === UNIT_TYPES.GROUND) {
                $.Observer(GameEvents.town.units.barracks.order.done).publish(unit_order);
            }

            if (unit_order.getKind() === UNIT_TYPES.NAVAL) {
                $.Observer(GameEvents.town.units.docks.order.done).publish(unit_order);
            }
        });

        CollectionAutomaticFetchFactory.initializeNotificationRequestHandlerForConstructionQueue(this);

        /**
         * we do not sort on model.add during gameload, so we have to do it here manually
         */
        $.Observer(GameEvents.game.start).subscribe(['remaining_unit_orders'], function() {
            this.sort();
        }.bind(this));
    };

    /**
     * Returns all unit orders for the currently selected town
     *
     * @return {Array}
     */
    RemainingUnitOrders.getNumberOfUnitsFromRunningOrders = function(unit_id) {
        return this.reduce(function(memo, unit_order) {
            return memo + (unit_order.getUnitId() === unit_id ? unit_order.getUnitsToBuildLeft() : 0);
        }, 0);
    };

    /**
     * Returns all unit orders for the currently selected town
     *
     * @return {Array}
     */
    RemainingUnitOrders.getAllOrders = function() {
        return this.filter(function(model) {
            return ['barracks', 'docks'].indexOf(model.getProductionBuildingType()) !== -1; //is this check really necessary ?
        });
    };

    /**
     * Returns count of all orders (barracks and docks)
     *
     * @return {Number}
     */
    RemainingUnitOrders.getAllOrdersCount = function() {
        return this.getAllOrders().length;
    };

    /**
     * Returns orders count depends on the type (barracks or docks)
     *
     * @return {Number}
     */
    RemainingUnitOrders.getCount = function(building_type) {
        return this.getOrders(building_type).length;
    };

    /**
     * Returns unit orders depends of the type of the unit
     *
     * @param {String} building_type
     *     Possible values:
     *     - 'barracks'
     *     - 'docks'
     *
     * @return {Array}
     */
    RemainingUnitOrders.getOrders = function(building_type) {
        if (!building_type) {
            throw 'A buildingtype has to be given!';
        }

        return this.filter(function(model) {
            return building_type === model.getProductionBuildingType();
        });
    };

    /**
     * Returns ground units orders
     *
     * @return {Array}
     */
    RemainingUnitOrders.getGroundUnitOrders = function() {
        return this.getOrders('barracks');
    };

    /**
     * Returns active ground unit order
     *
     * @return {GameModels.UnitOrder|null}
     */
    RemainingUnitOrders.getActiveGroundUnitOrder = function() {
        var orders = this.getGroundUnitOrders();

        return orders.length ? orders[0] : null;
    };

    /**
     * Returns ground units orders count
     *
     * @return {Number}
     */
    RemainingUnitOrders.getGroundUnitOrdersCount = function() {
        return this.getGroundUnitOrders().length;
    };

    /**
     * Returns naval unit orders
     *
     * @return {Array}
     */
    RemainingUnitOrders.getNavalUnitOrders = function() {
        return this.getOrders('docks');
    };

    /**
     * Returns active ground unit order
     *
     * @return {GameModels.UnitOrder|null}
     */
    RemainingUnitOrders.getActiveNavalUnitOrder = function() {
        var orders = this.getNavalUnitOrders();

        return orders.length ? orders[0] : null;
    };

    /**
     * Returns naval unit orders count
     *
     * @returns {Number}
     */
    RemainingUnitOrders.getNavalUnitOrdersCount = function() {
        return this.getNavalUnitOrders().length;
    };

    /**
     * @param {Number} order_id
     * @returns {GameModels.UnitOrder}
     */
    RemainingUnitOrders.getOrderById = function(order_id) {
        return this.get(order_id);
    };

    RemainingUnitOrders.getPreviousOrderById = function(order_id, building_type) {
        if (!building_type) {
            throw 'A buildingtype has to be given!';
        }
        var previous_model = null;

        this.find(function(model) {
            if (model.getId() === order_id) {
                return true;
            } else {
                if (building_type === model.getProductionBuildingType()) {
                    previous_model = model;
                }

                return false;
            }
        });

        return previous_model;
    };

    RemainingUnitOrders.isFirstOrder = function(order, building_order) {
        var orders = this.getOrders(building_order);

        for (var i = 0, l = orders.length; i < l; i++) {
            if (i === 0 && orders[i] === order) {
                return true;
            }
        }

        return false;
    };

    RemainingUnitOrders.getFirstOrder = function(building_type) {
        if (!building_type) {
            throw 'A buildingtype has to be given!';
        }

        return this.find(function(model) {
            return building_type === model.getProductionBuildingType();
        });
    };

    RemainingUnitOrders.hasOrders = function(building_type) {
        return this.getOrders(building_type).length;
    };

    RemainingUnitOrders.getPremiumFeaturePrice = function(order, building_type) {
        if (GameDataInstantBuy.isEnabled()) {
            var is_first_order = this.isFirstOrder(order, building_type),
                time_left = is_first_order ? order.getTimeLeft() : order.getDuration();

            return GameDataInstantBuy.getPriceForType(ConstructionQueueHelper.UNIT, time_left);
        } else {
            return GameDataUnits.getUnitOrderBuildTimeReductionCost();
        }
    };

    RemainingUnitOrders.onOrderCountChange = function(obj, callback) {
        obj.listenTo(this, 'add remove', callback);
    };

    RemainingUnitOrders.onToBeCompletedAtChange = function(obj, callback) {
        obj.listenTo(this, 'change:to_be_completed_at', callback);
    };

    RemainingUnitOrders.onOrderPropertyChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    window.GameCollections.RemainingUnitOrders = GrepolisCollection.extend(RemainingUnitOrders);

    /**
     * Mixin GrepolisCollectionAutomaticFetch into Trades
     */
    us.extend(window.GameCollections.RemainingUnitOrders.prototype, window.GrepolisCollectionAutomaticFetch);
}());