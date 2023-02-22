/*globals GameViews, GameControllers, BuyForGoldWindowFactory, TooltipFactory, ConfirmationWindowFactory, GameData, GameDataInstantBuy */

define('strategy/buildings_queue_instant_buy', function() {
    'use strict';

    var BaseConstructionQueue = require('strategy/base_construction_queue');

    function BuildingsQueueInstantBuy() {
        BaseConstructionQueue.prototype.constructor.apply(this, arguments);
    }

    BuildingsQueueInstantBuy.inherits(BaseConstructionQueue);

    BuildingsQueueInstantBuy.prototype.getTemplateName = function() {
        return 'queue_instant_buy';
    };

    BuildingsQueueInstantBuy.prototype.getIconType = function() {
        return 'building_icon40x40';
    };

    BuildingsQueueInstantBuy.prototype.getQueueType = function() {
        return 'type_building_queue type_instant_buy';
    };

    BuildingsQueueInstantBuy.prototype.getProgressbarTemplateName = function() {
        return 'tpl_pb_single';
    };

    BuildingsQueueInstantBuy.prototype.getViewClass = function() {
        return GameViews.ConstructionQueueInstantBuyBaseView(GameViews.LayoutConstructionQueue);
    };

    BuildingsQueueInstantBuy.prototype.getControllerClass = function() {
        return GameControllers.ConstructionQueueInstantBuyBaseController(GameControllers.LayoutConstructionQueueInstantBuyController);
    };

    BuildingsQueueInstantBuy.prototype.doInitializeTimer = function(index) {
        return index === 0;
    };

    BuildingsQueueInstantBuy.prototype.doInitializeProgressbar = function(index) {
        //only first order should have progressbar
        return index === 0;
    };

    BuildingsQueueInstantBuy.prototype.doInitializePremiumButton = function(index) {
        return index === 0;
    };

    BuildingsQueueInstantBuy.prototype.onPremiumActionCall = function(_btn, order, orders, price, callback) {
        BuyForGoldWindowFactory.openBuildingsInstantBuyForGoldWindow(_btn, price, order, function() {
            order.buyInstant(callback);
        });
    };

    BuildingsQueueInstantBuy.prototype.getBuildTimeReductionButtonTooltip = function( /*order, price*/ ) {
        //No tooltip necessary
        return '';
    };

    BuildingsQueueInstantBuy.prototype.getCancelOrderTooltip = function(order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.cancel_order.building(order.hasTearDown()) + '<br />' + TooltipFactory.getRefundTooltip(order.getCancelRefund());
    };

    BuildingsQueueInstantBuy.prototype.onOrderCancel = function(order) {
        ConfirmationWindowFactory.openConfirmationBuildingOrderCancel(function() {
            order.cancel();
        }, null, {
            demolish: order.hasTearDown()
        });
    };

    BuildingsQueueInstantBuy.prototype.getCompletionTimeTooltip = function(order) {
        return this.getl10n('construction_queue').tooltips.completion.research(order.getCompletedAtHuman());
    };


    BuildingsQueueInstantBuy.prototype.getItemName = function(building_id) {
        return GameData.buildings[building_id].name;
    };

    BuildingsQueueInstantBuy.prototype.getPremiumActionButtonSettings = function(building_order) {
        var price = this.getPremiumFeaturePrice(building_order),
            l10n = this.getl10n().construction_queue,
            disabled = !this._areRequirementsFulfilled(building_order) || building_order.getTimeLeft() === 0;

        if (price === 0) {
            return {
                caption: l10n.free,
                icon: false,
                css_classes: 'instant_buy type_free',
                disabled: disabled
            };
        } else {
            return {
                caption: price,
                icon: true,
                icon_type: 'gold',
                disabled: disabled
            };
        }
    };

    BuildingsQueueInstantBuy.prototype._areRequirementsFulfilled = function(building_order) {
        return this._getBuildingMissingRequirements(building_order).length === 0;
    };

    BuildingsQueueInstantBuy.prototype._getBuildingMissingRequirements = function(building_order) {
        return GameDataInstantBuy.getBuildingMissingRequirements(this.getOrdersCollection(), this._getCurrentTownModel(), building_order);
    };

    BuildingsQueueInstantBuy.prototype._getCurrentTownModel = function() {
        return this.getCollection('towns').getCurrentTown();
    };

    BuildingsQueueInstantBuy.prototype.getPremiumFeaturePrice = function(order) {
        return this.getOrdersCollection().getPremiumFeaturePrice(order);
    };

    BuildingsQueueInstantBuy.prototype.getOrdersCollection = function() {
        return GameControllers.LayoutConstructionQueueController.prototype.getOrdersCollection.apply(this, arguments);
    };

    BuildingsQueueInstantBuy.prototype.getOrders = function() {
        return GameControllers.LayoutConstructionQueueController.prototype.getOrders.apply(this, arguments);
    };

    return BuildingsQueueInstantBuy;
});