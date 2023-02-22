/*globals GameViews, GameControllers, BuyForGoldWindowFactory, TooltipFactory, ConfirmationWindowFactory, GameEvents, GameData */

define('strategy/researches_queue_instant_buy', function() {
    'use strict';

    var BaseConstructionQueue = require('strategy/base_construction_queue');

    function ResearchesQueueInstantBuy() {
        BaseConstructionQueue.prototype.constructor.apply(this, arguments);
    }

    ResearchesQueueInstantBuy.inherits(BaseConstructionQueue);

    ResearchesQueueInstantBuy.prototype.getTemplateName = function() {
        return 'queue_instant_buy';
    };

    ResearchesQueueInstantBuy.prototype.getIconType = function() {
        return 'research_icon research40x40';
    };

    ResearchesQueueInstantBuy.prototype.getQueueType = function() {
        return 'type_research_queue type_instant_buy';
    };

    ResearchesQueueInstantBuy.prototype.getProgressbarTemplateName = function() {
        return 'tpl_pb_single';
    };

    ResearchesQueueInstantBuy.prototype.getViewClass = function() {
        return GameViews.ConstructionQueueInstantBuyBaseView(GameViews.ResearchesQueueView);
    };

    ResearchesQueueInstantBuy.prototype.getControllerClass = function() {
        return GameControllers.ConstructionQueueInstantBuyBaseController(GameControllers.ResearchesQueueInstantBuyController);
    };

    ResearchesQueueInstantBuy.prototype.doInitializeTimer = function(index) {
        return index === 0;
    };

    ResearchesQueueInstantBuy.prototype.doInitializeProgressbar = function(index) {
        //only first order should have progressbar
        return index === 0;
    };

    ResearchesQueueInstantBuy.prototype.doInitializePremiumButton = function(index) {
        return index === 0;
    };

    ResearchesQueueInstantBuy.prototype.onPremiumActionCall = function(_btn, order, orders, price, callback) {
        BuyForGoldWindowFactory.openResearchesInstantBuyForGoldWindow(_btn, price, function() {
            order.buyInstant(callback);
        });
    };

    ResearchesQueueInstantBuy.prototype.getBuildTimeReductionButtonTooltip = function( /*order, price*/ ) {
        //No tooltip necessary
        return '';
    };

    ResearchesQueueInstantBuy.prototype.getCancelOrderTooltip = function(order) {
        var l10n = this.getl10n('construction_queue');

        return l10n.tooltips.cancel_order.research + '<br />' + TooltipFactory.getRefundTooltip(order.getCancelRefund());
    };

    ResearchesQueueInstantBuy.prototype.onOrderCancel = function(order) {
        ConfirmationWindowFactory.openConfirmationResearchOrderCancel(function() {
            order.cancel();

            $.Observer(GameEvents.building.academy.research.cancel).publish({
                research_id: order.getType()
            });
        }, null, {
            demolish: order.hasTearDown()
        });
    };

    ResearchesQueueInstantBuy.prototype.getCompletionTimeTooltip = function(order) {
        return this.getl10n('construction_queue').tooltips.completion.research(order.getCompletedAtHuman());
    };

    ResearchesQueueInstantBuy.prototype.getItemName = function(research_id) {
        return GameData.researches[research_id].name;
    };

    ResearchesQueueInstantBuy.prototype.getPremiumActionButtonSettings = function(order) {
        var price = this.getPremiumFeaturePrice(order),
            l10n = this.getl10n('construction_queue');

        var disabled = order.getTimeLeft() === 0;

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

    ResearchesQueueInstantBuy.prototype.getPremiumFeaturePrice = function(order) {
        return this.getOrdersCollection().getPremiumFeaturePrice(order);
    };

    ResearchesQueueInstantBuy.prototype.getOrdersCollection = function() {
        return GameControllers.ResearchesQueueController.prototype.getOrdersCollection.apply(this, arguments);
    };

    ResearchesQueueInstantBuy.prototype.getOrders = function() {
        return GameControllers.ResearchesQueueController.prototype.getOrders.apply(this, arguments);
    };

    return ResearchesQueueInstantBuy;
});