/*global GameViews, Game, GameData, GeneralModifications, GameControllers, TooltipFactory */

(function() {
    'use strict';

    var BarracksUnitsOrderViewController = GameControllers.TabController.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.BarracksUnitsOrderView({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();

            return this;
        },

        registerEventListeners: function() {
            var remaining_unit_orders = this.getCollection('remaining_unit_orders');

            //Unit orders
            remaining_unit_orders.onOrderCountChange(this, this.onUnitOrderCountChange.bind(this));

            //Unit order build time reduction
            remaining_unit_orders.onToBeCompletedAtChange(this, this.onToBeCompletedAtChange.bind(this));
        },

        getBuildingType: function() {
            return this.parent_controller.getBuildingType();
        },

        getAvailableGold: function() {
            return this.parent_controller.getAvailableGold();
        },

        getFirstOrder: function(building_type) {
            return this.getCollection('remaining_unit_orders').getFirstOrder(building_type);
        },

        getOrders: function(building_type) {
            return this.getCollection('remaining_unit_orders').getOrders(building_type);
        },

        getOrderById: function(order_id) {
            return this.getCollection('remaining_unit_orders').getOrderById(order_id);
        },

        getPreviousOrderById: function(order_id, building_type) {
            return this.getCollection('remaining_unit_orders').getPreviousOrderById(order_id, building_type);
        },

        getRefundTooltip: function(order) {
            var units_left = order.getUnitsToBuildLeft(),
                refund_factor = GameData.unit_order_refund_factor,
                gd_unit = GameData.units[order.getUnitId()],
                resource_factor = GeneralModifications.getUnitBuildResourcesModification(Game.townId, gd_unit);

            return TooltipFactory.getRefundTooltip({
                favor: Math.floor(gd_unit.favor * units_left * refund_factor),
                wood: Math.floor(gd_unit.resources.wood * units_left * refund_factor * resource_factor),
                stone: Math.floor(gd_unit.resources.stone * units_left * refund_factor * resource_factor),
                iron: Math.floor(gd_unit.resources.iron * units_left * refund_factor * resource_factor)
            });
        },

        onUnitOrderCountChange: function() {
            this.view.reRender();
        },

        onToBeCompletedAtChange: function(order) {
            this.view.onToBeCompletedAtChange(order);
        },

        destroy: function() {

        }
    });

    window.GameControllers.BarracksUnitsOrderViewController = BarracksUnitsOrderViewController;
}());