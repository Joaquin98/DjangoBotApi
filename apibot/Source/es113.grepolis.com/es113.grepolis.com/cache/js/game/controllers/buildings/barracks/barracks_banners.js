/*globals GameViews, Game, GameEvents, GameControllers, Timestamp */

(function() {
    'use strict';

    var BarracksBannersViewController = GameControllers.TabController.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        reRender: function() {
            this.view.reRender();
        },

        renderPage: function() {
            this.view = new GameViews.BarracksBannersView({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();

            return this;
        },

        registerEventListeners: function() {
            var reRender = this.reRender.bind(this);

            if (this.showBannerInBarracks()) {
                this.getModel('premium_features').onCommanderChange(this, reRender);
            } else if (this.showBannerInDocks()) {
                this.observeEvent(GameEvents.premium.merchant.immediate_call, reRender);
                this.observeEvent(GameEvents.premium.merchant.run_out, reRender);
            }
        },

        getBuildingType: function() {
            return this.parent_controller.getBuildingType();
        },

        hasBuilding: function() {
            return this.parent_controller.hasBuildingWithLevel(this.getBuildingType(), 1);
        },

        getAvailableGold: function() {
            return this.parent_controller.getAvailableGold();
        },

        getPhoenicianSalesmanCurrentTownId: function() {
            return this.getModel('phoenician_salesman').getCurrentTownId();
        },

        showBannerInBarracks: function() {
            return this.hasBuilding() && this.getBuildingType() === 'barracks' && (!Game.premium_features.commander || Game.premium_features.commander < Timestamp.now());
        },

        showBannerInDocks: function() {
            return this.hasBuilding() && this.getBuildingType() === 'docks';
        },

        extendCommander: function() {
            this.getModel('premium_features').extendCommander();
        },

        destroy: function() {

        }
    });

    window.GameControllers.BarracksBannersViewController = BarracksBannersViewController;
}());