/*global GameEvents, GameDataConstructionQueue, ConstructionQueueHelper, GameDataInstantBuy, GameControllers */

(function() {
    'use strict';

    var ConstructionQueueBaseController = GameControllers.BaseController.extend({
        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            this.registerEventsListeners();
        },

        rerenderPage: function() {
            this.unregisterComponents(this.getQueueSubContextName());

            if (this.view) {
                this.view.rerender();
            }
        },

        renderPage: function() {
            var ViewClass = this.getViewClass();

            this.view = new ViewClass({
                el: this.$el,
                controller: this
            });

            return this;
        },

        registerEventsListeners: function() {
            var rerenderPage = this.rerenderPage.bind(this);

            //Academy window listens on town switch
            this.observeEvent(GameEvents.town.town_switch, rerenderPage);

            //Listen on buildings changes
            this.getOrdersCollection().onOrderCountChange(this, rerenderPage);
            this.getOrdersCollection().onOrderPropertyChange(this, rerenderPage);

            // listen for activation event for curator
            this.getModel('premium_features').onCuratorChange(this, this._handleCuratorActivation.bind(this));
            this.getModel('player_ledger').onGoldChange(this, rerenderPage);
        },

        getTooltipPosition: function() {
            return this.options.tooltip_position;
        },

        /**
         * Returns strategy instance
         *
         * @return {Strategy}
         */
        getQueueStrategy: function() {
            return this.getStrategy('queue');
        },

        /**
         * Returns queue template
         *
         * @return {String}
         */
        getQueueTemplate: function() {
            return this.getTemplate(this.getQueueStrategy().getTemplateName());
        },

        getIconType: function() {
            return this.getQueueStrategy().getIconType();
        },

        /**
         * Determinates whether or not advisor overlay should be shown,
         * respects the egde case where a user can have 5 orders and
         * the Advisor feature runs out.
         * The advisor can only be shown if <= 2 orders
         *
         * @return {Boolean}
         */
        showAdvisorOverlay: function() {
            var has_curator = this.getModel('premium_features').hasCurator(),
                queue_type = this.getQueueType(),
                order_queue_can_display_overlay = this.getOrdersCount() <= GameDataConstructionQueue.getLength(queue_type);

            if (ConstructionQueueHelper.isUnitQueue(this.getQueueStrategy())) {
                return false;
            } else {
                return !has_curator && order_queue_can_display_overlay;
            }
        },

        /**
         * Activates 'curator' advisor for the player
         */
        extendCurator: function() {
            this.getModel('premium_features').extendCurator();
        },

        getCancelOrderTooltip: function(order) {
            return this.getQueueStrategy().getCancelOrderTooltip(order);
        },

        onOrderCancel: function(order) {
            return this.getQueueStrategy().onOrderCancel(order);
        },

        onCountdownFinish: function() {
            //NotificationLoader.resetNotificationRequestTimeout(1000);
        },

        getCompletionTimeTooltip: function(order) {
            return ConstructionQueueHelper.getCompletionTimeTooltip(this.getQueueStrategy(), order);
        },

        getItemName: function(item_id) {
            return ConstructionQueueHelper.getItemName(this.getQueueStrategy(), item_id);
        },

        getViewClass: function() {
            return ConstructionQueueHelper.getViewClass(this.getQueueStrategy());
        },

        isResearchQueue: function() {
            return ConstructionQueueHelper.isResearchQueue(this.getQueueStrategy());
        },

        isUnitQueue: function() {
            return ConstructionQueueHelper.isUnitQueue(this.getQueueStrategy());
        },

        isBuildingQueue: function() {
            return ConstructionQueueHelper.isBuildingQueue(this.getQueueStrategy());
        },

        getQueueType: function() {
            return ConstructionQueueHelper.getQueueType(this.getQueueStrategy());
        },

        doInitializeTimer: function(index) {
            return ConstructionQueueHelper.doInitializeTimer(this.getQueueStrategy(), index);
        },

        doInitializeProgressbar: function(index) {
            return ConstructionQueueHelper.doInitializeProgressbar(this.getQueueStrategy(), index);
        },

        doInitializePremiumButton: function(index) {
            return ConstructionQueueHelper.doInitializePremiumButton(this.getQueueStrategy(), index);
        },

        getOrderById: function(order_id) {
            return this.getOrdersCollection().getOrderById(order_id);
        },

        getPremiumFeaturePrice: function(order) {
            return GameDataInstantBuy.getPremiumFeaturePrice(this.getQueueStrategy(), order);
        },

        getCurrentTownModel: function() {
            return this.getCollection('towns').getCurrentTown();
        },

        getOrdersCollection: function() {
            throw 'Please implement getOrdersCollection for your type of the construction queue';
        },
        getOrders: function() {
            throw 'Please implement getOrders for your type of the construction queue';
        },
        getOrdersCount: function() {
            throw 'Please implement getOrdersCount for your type of the construction queue';
        },
        getQueueSubContextName: function() {
            throw 'Please implement getQueueSubContextName for your type of the construction queue';
        },
        areRequirementsFulfilled: function() {
            throw 'Please implement areRequirementsFulfilled for your type of the construction queue';
        },

        /**
         * Handles situation when 'Curator' has been activated
         *
         * @private
         */
        _handleCuratorActivation: function() {
            //Remove advisor banner
            this.view.removeAdvisorContainer();
            //Rerender queue
            this.rerenderPage();
        },

        destroy: function() {
            //It has to be here as long as the old Senat is not changed to the new window.
            this.unregisterComponents(this.getQueueSubContextName());
        }
    });

    window.GameControllers.ConstructionQueueBaseController = ConstructionQueueBaseController;
}());