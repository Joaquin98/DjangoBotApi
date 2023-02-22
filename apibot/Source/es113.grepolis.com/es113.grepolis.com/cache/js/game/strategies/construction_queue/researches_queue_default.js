/*globals GameViews, GameControllers, BuyForGoldWindowFactory, TooltipFactory, ConfirmationWindowFactory, GameEvents, GameData */

define('strategy/researches_queue_default', function() {
    'use strict';

    var BaseConstructionQueue = require('strategy/base_construction_queue');

    function ResearchesQueueDefault() {
        BaseConstructionQueue.prototype.constructor.apply(this, arguments);
    }

    ResearchesQueueDefault.inherits(BaseConstructionQueue);

    ResearchesQueueDefault.prototype.getTemplateName = function() {
        return 'queue';
    };

    ResearchesQueueDefault.prototype.getIconType = function() {
        return 'research_icon research40x40';
    };

    ResearchesQueueDefault.prototype.getQueueType = function() {
        return 'type_research_queue type_time_reduction';
    };

    ResearchesQueueDefault.prototype.getProgressbarTemplateName = function() {
        return 'tpl_pb_time_without_numbers';
    };

    ResearchesQueueDefault.prototype.getViewClass = function() {
        return GameViews.ResearchesQueueView;
    };

    ResearchesQueueDefault.prototype.getControllerClass = function() {
        return GameControllers.ResearchesQueueController;
    };

    ResearchesQueueDefault.prototype.doInitializeTimer = function(index) {
        //only first order should tick
        return index === 0;
    };

    ResearchesQueueDefault.prototype.doInitializeProgressbar = function(index) {
        //only first order should have progressbar
        return index === 0;
    };

    ResearchesQueueDefault.prototype.doInitializePremiumButton = function( /*index*/ ) {
        return true;
    };

    ResearchesQueueDefault.prototype.onPremiumActionCall = function(_btn, order, orders, price, callback) {
        var data = this.__getHalveBuildingTimeNotEnoughGoldWindowData(order, orders);

        BuyForGoldWindowFactory.openReductResearchBuildTimeForGoldWindow(_btn, data, function() {
            order.halveResearchTime(callback);
        });
    };

    ResearchesQueueDefault.prototype.getBuildTimeReductionButtonTooltip = function(order, price) {
        var l10n = this.getl10n('construction_queue');
        var message = l10n.tooltips.time_reduct.research(price);
        var gold = this.getModel('player_ledger').getGold();

        return TooltipFactory.getPremiumFeatureInfo('gold', message, gold);
    };

    ResearchesQueueDefault.prototype.getCancelOrderTooltip = function(order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.cancel_order.research + '<br />' + TooltipFactory.getRefundTooltip(order.getCancelRefund());
    };

    ResearchesQueueDefault.prototype.onOrderCancel = function(order) {
        ConfirmationWindowFactory.openConfirmationResearchOrderCancel(function() {
            order.cancel();

            $.Observer(GameEvents.building.academy.research.cancel).publish({
                research_id: order.getType()
            });
        }, null, {
            demolish: order.hasTearDown()
        });
    };

    ResearchesQueueDefault.prototype.getCompletionTimeTooltip = function(order) {
        return this.getl10n('construction_queue').tooltips.completion.research(order.getCompletedAtHuman());
    };

    ResearchesQueueDefault.prototype.getItemName = function(research_id) {
        return GameData.researches[research_id].name;
    };

    ResearchesQueueDefault.prototype.getPremiumActionButtonSettings = function( /*order*/ ) {
        return {};
    };

    ResearchesQueueDefault.prototype.getPremiumFeaturePrice = function(order) {
        return this.getOrdersCollection().getPremiumFeaturePrice(order);
    };

    ResearchesQueueDefault.prototype.getOrdersCollection = function() {
        return GameControllers.ResearchesQueueController.prototype.getOrdersCollection.apply(this, arguments);
    };

    ResearchesQueueDefault.prototype.getOrders = function() {
        return GameControllers.ResearchesQueueController.prototype.getOrders.apply(this, arguments);
    };

    return ResearchesQueueDefault;
});