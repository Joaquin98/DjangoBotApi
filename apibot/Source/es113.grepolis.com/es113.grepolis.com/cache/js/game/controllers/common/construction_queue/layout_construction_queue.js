/*global WM, GameEvents, GameDataInstantBuy, GameControllers */

(function() {
    'use strict';

    var LayoutConstructionQueueController = GameControllers.ConstructionQueueBaseController.extend({
        renderPage: function() {
            GameControllers.ConstructionQueueBaseController.prototype.renderPage.apply(this, arguments);

            //When minimized window area is shown, put queue over it
            if (WM.isMinimizedWindowsBoxVisible()) {
                this.onShowMinimizedWindowsArea();
            } else {
                this.onHideMinimizedWindowsArea();
            }
        },

        registerEventsListeners: function() {
            GameControllers.ConstructionQueueBaseController.prototype.registerEventsListeners.apply(this, arguments);

            //Handle situation when minimized windows area show up
            this.observeEvent(GameEvents.window.minimized_windows_area.show, this.onShowMinimizedWindowsArea.bind(this));
            this.observeEvent(GameEvents.window.minimized_windows_area.hide, this.onHideMinimizedWindowsArea.bind(this));

            //Listen on buildings changes
            this.observeEvent(GameEvents.quest.reduce_build_time_quest_changed, this.rerenderPage.bind(this));
        },

        /**
         * ========================================
         *     METHODS WHICH OVERWRITES PARENT
         * ========================================
         */

        /**
         * @overwrite
         */
        getOrdersCollection: function() {
            return this.getCollection('building_orders');
        },

        getOrders: function() {
            return this.getOrdersCollection().getOrders();
        },

        getOrdersCount: function() {
            return this.getOrdersCollection().getCount();
        },

        /**
         * @overwrite
         */
        getQueueSubContextName: function() {
            return this.getSubContext() + '_building_queue';
        },

        areRequirementsFulfilled: function() {
            return true;
        },

        /**
         * ========================================
         * CONSTRUCTION QUEUE TYPE SPECIFIC METHODS
         * ========================================
         */

        getBuildingsModel: function() {
            return this.getCollection('towns').getCurrentTown().getBuildings();
        },

        /**
         * Returns building level depends on the building id given as an argument
         *
         * @param {GameModels.BuildingOrder} building_order
         * @return {Number}
         */
        getBuildingLevel: function(building_order) {
            var building_id = building_order.getBuildingId();

            return this.getBuildingsModel().getBuildingLevel(building_id) + this.getOrdersCollection().getBuildingLevelDependsOnBuildingsInTheQueue(building_order);
        },

        getNextBuildingLevel: function(building_order) {
            return GameDataInstantBuy.getNextBuildingLevel(this.getOrdersCollection(), building_order, this.getBuildingsModel());
        },

        /**
         * Handles situation when "Minimized windows area" is being shown
         */
        onShowMinimizedWindowsArea: function() {
            this.view.onShowMinimizedWindowsArea();
        },

        /**
         * Handles situation when "Minimized windows area" is being hidden
         */
        onHideMinimizedWindowsArea: function() {
            this.view.handleOnHideMinimizedWindowsArea();
        },

        destroy: function() {
            GameControllers.ConstructionQueueBaseController.prototype.destroy.apply(this, arguments);
        }
    });

    window.GameControllers.LayoutConstructionQueueController = LayoutConstructionQueueController;
}());