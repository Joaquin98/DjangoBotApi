/*globals GameViews, GameControllers, TooltipFactory, BuyForGoldWindowFactory, ConfirmationWindowFactory, GameData */

define('strategy/units_queue_default', function() {
    'use strict';

    var BaseConstructionQueue = require('strategy/base_construction_queue');

    function UnitsQueueDefault() {
        BaseConstructionQueue.prototype.constructor.apply(this, arguments);
    }

    UnitsQueueDefault.inherits(BaseConstructionQueue);

    UnitsQueueDefault.prototype.getBuildingType = function() {
        return this.data.building_type;
    };

    UnitsQueueDefault.prototype.getTownId = function() {
        return this.data.town_id;
    };

    UnitsQueueDefault.prototype.getTemplateName = function() {
        return 'queue';
    };

    UnitsQueueDefault.prototype.getIconType = function() {
        return 'unit_icon40x40';
    };

    UnitsQueueDefault.prototype.getQueueType = function() {
        return 'type_unit_queue type_time_reduction';
    };

    UnitsQueueDefault.prototype.getProgressbarTemplateName = function() {
        return 'tpl_pb_time_without_numbers';
    };

    UnitsQueueDefault.prototype.getViewClass = function() {
        return GameViews.UnitsQueueView;
    };

    UnitsQueueDefault.prototype.getControllerClass = function() {
        return GameControllers.UnitsQueueController;
    };

    UnitsQueueDefault.prototype.doInitializeTimer = function(index) {
        //only first order should tick
        return index === 0;
    };

    UnitsQueueDefault.prototype.doInitializeProgressbar = function( /*index*/ ) {
        return false;
    };

    UnitsQueueDefault.prototype.doInitializePremiumButton = function( /*index*/ ) {
        return true;
    };

    UnitsQueueDefault.prototype.onPremiumActionCall = function(_btn, order, orders, price, callback) {
        var data = this.__getHalveBuildingTimeNotEnoughGoldWindowData(order, orders, order.getProductionBuildingType());

        BuyForGoldWindowFactory.openReductUnitBuildTimeForGoldWindow(_btn, data, function() {
            order.buildTimeReduct(callback);
        });
    };

    UnitsQueueDefault.prototype.getBuildTimeReductionButtonTooltip = function(order, price) {
        var l10n = this.getl10n('construction_queue');
        var message = l10n.tooltips.time_reduct.unit(price);
        var gold = this.getModel('player_ledger').getGold();

        return TooltipFactory.getPremiumFeatureInfo('gold', message, gold);
    };

    UnitsQueueDefault.prototype.getCancelOrderTooltip = function(order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.cancel_order.unit + '<br />' + TooltipFactory.getRefundTooltip(order.getCancelRefund());
    };

    UnitsQueueDefault.prototype.onOrderCancel = function(order) {
        ConfirmationWindowFactory.openConfirmationUnitOrderCancel(function() {
            order.cancelOrder();
        });
    };

    UnitsQueueDefault.prototype.getCompletionTimeTooltip = function(order) {
        return this.getl10n('construction_queue').tooltips.completion.unit(order.getCompletedAtHuman());
    };


    UnitsQueueDefault.prototype.getItemName = function(unit_id) {
        return GameData.units[unit_id].name;
    };

    UnitsQueueDefault.prototype.getPremiumActionButtonSettings = function( /*order*/ ) {
        return {};
    };

    UnitsQueueDefault.prototype.getPremiumFeaturePrice = function(order) {
        return this.getOrdersCollection().getPremiumFeaturePrice(order, this.getBuildingType());
    };

    UnitsQueueDefault.prototype.getOrdersCollection = function() {
        return GameControllers.UnitsQueueController.prototype.getOrdersCollection.apply(this, arguments);
    };

    UnitsQueueDefault.prototype.getOrders = function() {
        return GameControllers.UnitsQueueController.prototype.getOrders.apply(this, arguments);
    };

    return UnitsQueueDefault;
});