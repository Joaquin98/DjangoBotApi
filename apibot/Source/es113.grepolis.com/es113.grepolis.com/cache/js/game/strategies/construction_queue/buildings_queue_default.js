/*globals GameViews, GameControllers, BuyForGoldWindowFactory, TooltipFactory, ConfirmationWindowFactory, GameData */

define('strategy/buildings_queue_default', function() {
    'use strict';

    var BaseConstructionQueue = require('strategy/base_construction_queue');

    function BuildingsQueueDefault() {
        BaseConstructionQueue.prototype.constructor.apply(this, arguments);
    }

    BuildingsQueueDefault.inherits(BaseConstructionQueue);

    BuildingsQueueDefault.prototype.getTemplateName = function() {
        return 'queue';
    };

    BuildingsQueueDefault.prototype.getIconType = function() {
        return 'building_icon40x40';
    };

    BuildingsQueueDefault.prototype.getQueueType = function() {
        return 'type_building_queue type_time_reduction';
    };

    BuildingsQueueDefault.prototype.getProgressbarTemplateName = function() {
        return 'tpl_pb_time_without_numbers';
    };

    BuildingsQueueDefault.prototype.getViewClass = function() {
        return GameViews.LayoutConstructionQueue;
    };

    BuildingsQueueDefault.prototype.getControllerClass = function() {
        return GameControllers.LayoutConstructionQueueController;
    };

    BuildingsQueueDefault.prototype.doInitializeTimer = function(index) {
        //only first order should tick
        return index === 0;
    };

    BuildingsQueueDefault.prototype.doInitializeProgressbar = function(index) {
        //only first order should have progressbar
        return index === 0;
    };

    BuildingsQueueDefault.prototype.doInitializePremiumButton = function(index) {
        return true;
    };

    BuildingsQueueDefault.prototype.onPremiumActionCall = function(_btn, order, orders, price, callback) {
        var onConfirm = function() {
            order.halveBuildTime(callback);
            _btn.enable();
        };

        var data = this.__getHalveBuildingTimeNotEnoughGoldWindowData(order, orders);
        BuyForGoldWindowFactory.openReductBuildingBuildTimeForGoldWindow(_btn, data, onConfirm);
    };

    BuildingsQueueDefault.prototype.getBuildTimeReductionButtonTooltip = function(order, price) {
        var l10n = this.getl10n('construction_queue');

        var message = l10n.tooltips.time_reduct.building(price, order.hasTearDown()),
            gold = this.getModel('player_ledger').getGold();

        return TooltipFactory.getPremiumFeatureInfo('gold', message, gold);
    };

    BuildingsQueueDefault.prototype.getCancelOrderTooltip = function(order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.cancel_order.building(order.hasTearDown()) + '<br />' + TooltipFactory.getRefundTooltip(order.getCancelRefund());
    };

    BuildingsQueueDefault.prototype.onOrderCancel = function(order) {
        ConfirmationWindowFactory.openConfirmationBuildingOrderCancel(function() {
            order.cancel();
        }, null, {
            demolish: order.hasTearDown()
        });
    };

    BuildingsQueueDefault.prototype.getCompletionTimeTooltip = function(building_order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.completion.building(building_order.getCompletedAtHuman());
    };

    BuildingsQueueDefault.prototype.getItemName = function(building_id) {
        return GameData.buildings[building_id].name;
    };

    BuildingsQueueDefault.prototype.getPremiumActionButtonSettings = function( /*order*/ ) {
        return {};
    };

    BuildingsQueueDefault.prototype.getPremiumFeaturePrice = function(order) {
        return this.getOrdersCollection().getPremiumFeaturePrice(order);
    };

    BuildingsQueueDefault.prototype.getOrdersCollection = function() {
        return GameControllers.LayoutConstructionQueueController.prototype.getOrdersCollection.apply(this, arguments);
    };

    BuildingsQueueDefault.prototype.getOrders = function() {
        return GameControllers.LayoutConstructionQueueController.prototype.getOrders.apply(this, arguments);
    };

    return BuildingsQueueDefault;
});