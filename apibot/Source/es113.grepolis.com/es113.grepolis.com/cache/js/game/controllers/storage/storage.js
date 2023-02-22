/* globals GameControllers, GameEvents, BuyForGoldWindowFactory, GameData, GameDataPremium */

(function() {
    "use strict";

    var StorageController = GameControllers.TabController.extend({

        initialize: function(options) {
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function(data) {
            //Data from the server is given though "data" argument

            this.view = new window.GameViews.StorageView({
                controller: this,
                el: this.$el
            });

            this.observeEvent(GameEvents.town.town_switch, this.reloadWindow.bind(this));
            this.registerEventHandlers();

            return this;
        },

        registerEventHandlers: function() {
            var town_model = this.getCollection('towns').getCurrentTown();

            town_model.onBuildingLvlChange(this, 'storage', this.view.reRender.bind(this.view));

            town_model.onResourceWoodChange(this, function(model, value) {
                this.view.updateResources(value, 'wood');
            }.bind(this));

            town_model.onResourceStoneChange(this, function(model, value) {
                this.view.updateResources(value, 'stone');
            }.bind(this));

            town_model.onResourceIronChange(this, function(model, value) {
                this.view.updateResources(value, 'iron');
            }.bind(this));
        },

        reRegisterEventHandlers: function() {
            this.stopListening();
            this.registerEventHandlers();
        },

        reloadWindow: function() {
            this.reRegisterEventHandlers();
            this.view.reRender();
        },

        onBuyTraderBtnClicked: function(e, _btn) {
            BuyForGoldWindowFactory.openBuyTraderWindow(_btn, function() {

                var premium = this.getModel('premium_features');
                premium.extend(premium.TRADER);

            }.bind(this));
        },

        getRenderData: function() {
            /*jshint validthis:true */
            var town = this.getCollection('towns').getCurrentTown();
            var storage_level = town.getBuildings().getBuildingLevel('storage');
            var storage_capacity = town.getStorageCapacity();

            return {
                storage_capacity: storage_capacity,
                storage_level: storage_level,
                storage_max_level: GameData.buildings.storage.max_level,
                storage_capacity_next: town.getStorageCapacity(storage_level + 1),
                hide_capacity: town.getUnlootableCapacity(),
                hide_capacity_next: town.getUnlootableCapacity(storage_level + 1),

                wood: this.getResourceDetails('wood'),
                stone: this.getResourceDetails('stone'),
                iron: this.getResourceDetails('iron'),

                has_trader: this.getModel('premium_features').isActivated('trader'),
                trader_res_boost: GameDataPremium.getTraderResourceBoost() * 100
            };
        },

        /**
         *	Returns an object with information about a resource. Example:
         *	getResourceDetail('wood', this.controller) ->
         *	{
         *		// current amount of that resource in storage + hideout
         *		amount: 500,
         *		// number of seconds left until storage capacity reached
         *		to_go: 40000,
         *		// number of seconds that would be needed to fill empty storage with the current production rate
         *		complete: 505000
         *	}
         */
        getResourceDetails: function(resource_type) {
            var town = this.getCollection('towns').getCurrentTown(),
                resources = town.getResources(),
                storage_capacity = town.getStorageCapacity();

            return {
                amount: resources[resource_type],
                to_go: (storage_capacity - resources[resource_type]) / town.getProduction(resource_type),
                complete: storage_capacity / town.getProduction(resource_type)
            };
        },

        destroy: function() {

        }
    });

    window.GameControllers.StorageController = StorageController;
}());