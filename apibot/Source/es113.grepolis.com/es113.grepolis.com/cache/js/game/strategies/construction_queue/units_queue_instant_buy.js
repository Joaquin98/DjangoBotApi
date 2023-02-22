/*globals GameViews, GameControllers, TooltipFactory, BuyForGoldWindowFactory, ConfirmationWindowFactory, GameData */

define('strategy/units_queue_instant_buy', function() {
    'use strict';

    var BaseConstructionQueue = require('strategy/base_construction_queue');

    function UnitsQueueInstantBuy() {
        BaseConstructionQueue.prototype.constructor.apply(this, arguments);
    }

    UnitsQueueInstantBuy.inherits(BaseConstructionQueue);

    UnitsQueueInstantBuy.prototype.getBuildingType = function() {
        return this.data.building_type;
    };

    UnitsQueueInstantBuy.prototype.getTownId = function() {
        return this.data.town_id;
    };

    UnitsQueueInstantBuy.prototype.getTemplateName = function() {
        return 'queue_instant_buy';
    };

    UnitsQueueInstantBuy.prototype.getIconType = function() {
        return 'unit_icon40x40';
    };

    UnitsQueueInstantBuy.prototype.getQueueType = function() {
        return 'type_unit_queue type_instant_buy';
    };

    UnitsQueueInstantBuy.prototype.getProgressbarTemplateName = function() {
        return 'tpl_pb_single';
    };

    UnitsQueueInstantBuy.prototype.getViewClass = function() {
        return GameViews.ConstructionQueueInstantBuyBaseView(GameViews.UnitsQueueView);
    };

    UnitsQueueInstantBuy.prototype.getControllerClass = function() {
        return GameControllers.ConstructionQueueInstantBuyBaseController(GameControllers.UnitsQueueInstantBuyController);
    };

    UnitsQueueInstantBuy.prototype.doInitializeTimer = function(index) {
        return index === 0;
    };

    UnitsQueueInstantBuy.prototype.doInitializeProgressbar = function(index) {
        //only first order should have progressbar
        return index === 0;
    };

    UnitsQueueInstantBuy.prototype.doInitializePremiumButton = function(index) {
        //only first order should have progressbar
        return index === 0;
    };

    UnitsQueueInstantBuy.prototype.onPremiumActionCall = function(_btn, order, orders, price, callback) {
        BuyForGoldWindowFactory.openUnitsInstantBuyForGoldWindow(_btn, price, function() {
            order.buyInstant(callback);
        });
    };

    UnitsQueueInstantBuy.prototype.getBuildTimeReductionButtonTooltip = function( /*order, price*/ ) {
        //No tooltip necessary
        return '';
    };

    UnitsQueueInstantBuy.prototype.getCancelOrderTooltip = function(order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.cancel_order.unit + '<br />' + TooltipFactory.getRefundTooltip(order.getCancelRefund());
    };

    UnitsQueueInstantBuy.prototype.onOrderCancel = function(order) {
        ConfirmationWindowFactory.openConfirmationUnitOrderCancel(function() {
            order.cancelOrder();
        });
    };

    UnitsQueueInstantBuy.prototype.getCompletionTimeTooltip = function(order) {
        return this.getl10n('construction_queue').tooltips.completion.unit(order.getCompletedAtHuman());
    };

    UnitsQueueInstantBuy.prototype.getItemName = function(unit_id) {
        return GameData.units[unit_id].name;
    };

    UnitsQueueInstantBuy.prototype._isInstantBuyBlocked = function() {
        return this.getCollection('feature_blocks').isInstantBuyBlocked(this.getTownId());
    };

    UnitsQueueInstantBuy.prototype.getPremiumActionButtonSettings = function(order) {
        var price = this.getPremiumFeaturePrice(order);

        var disabled = order.getTimeLeft() === 0 || this._isInstantBuyBlocked();

        return {
            caption: price,
            icon: true,
            icon_type: 'gold',
            disabled: disabled
        };
    };

    UnitsQueueInstantBuy.prototype.getPremiumFeaturePrice = function(order) {
        return this.getOrdersCollection().getPremiumFeaturePrice(order, this.getBuildingType());
    };

    UnitsQueueInstantBuy.prototype.getOrdersCollection = function() {
        return GameControllers.UnitsQueueController.prototype.getOrdersCollection.apply(this, arguments);
    };

    UnitsQueueInstantBuy.prototype.getOrders = function() {
        return GameControllers.UnitsQueueController.prototype.getOrders.apply(this, arguments);
    };

    return UnitsQueueInstantBuy;
});