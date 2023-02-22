/*global GameViews, GameControllers, GameEvents, TooltipFactory, StorageWindowFactory, BuildingWindowFactory */

(function() {
    'use strict';

    var LayoutResourcesBarController = GameControllers.BaseController.extend({
        town_model: null,

        initialize: function(options) {
            var _self = this;

            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            //Set town model
            this.setTownModelReference();

            this.observeEvent(GameEvents.town.town_switch, function() {
                _self.rerender();
            });
        },

        rerender: function() {
            this.renderPage();
        },

        getTownModelReference: function() {
            return this.town_model;
        },

        setTownModelReference: function() {
            this.town_model = this.getCollection('towns').getCurrentTown();
        },

        getStorageCapacity: function() {
            return this.getTownModelReference().getStorageCapacity();
        },

        renderPage: function() {
            if (this.view) {
                this.view.destroy();
                this.view = null;
            }

            this.setTownModelReference();

            this.view = new GameViews.LayoutResourcesBar({
                el: this.$el,
                controller: this
            });

            this.bindEventListeners();

            return this;
        },

        getIndicatorsData: function() {
            var town_model = this.getTownModelReference(),
                type, types = ['wood', 'stone', 'iron'],
                i, l = types.length,
                indicators = [],
                resource_rare = town_model.getResourceRare(),
                resource_plenty = town_model.getResourcePlenty();

            for (i = 0; i < l; i++) {
                type = types[i];

                indicators.push({
                    name: type,
                    value: town_model.getResource(type),
                    rare: type === resource_rare,
                    plenty: type === resource_plenty
                });
            }

            indicators.push({
                name: 'population',
                value: town_model.getAvailablePopulation()
            });

            return indicators;
        },

        handleClickOnTheIndicators: function(type) {
            switch (type) {
                case 'wood': // fall through
                case 'stone': // fall through
                case 'iron':
                    StorageWindowFactory.openWindow();
                    break;
                case 'population':
                    BuildingWindowFactory.open('farm');
                    break;
            }
        },

        getTooltip: function(type) {
            var town_model = this.getTownModelReference();

            switch (type) {
                case 'population':
                    return TooltipFactory.getPopulationTooltip();
                case 'wood':
                case 'stone':
                case 'iron':
                    return TooltipFactory.getResourcesTooltip(type, {
                        production: town_model.getProductionPerHour(type),
                        storage_size: town_model.getStorageCapacity(),
                        resource_rare: town_model.getResourceRare(),
                        resource_plenty: town_model.getResourcePlenty()
                    });
            }
        },


        bindEventListeners: function() {
            var town_model = this.getTownModelReference();

            town_model.onBuildingLvlChange(this, 'storage', this.view.rerender.bind(this.view));


            town_model.onResourceWoodChange(this, function(model, value) {
                this.view.updateResources(value, 'wood');
            }.bind(this));

            town_model.onResourceStoneChange(this, function(model, value) {
                this.view.updateResources(value, 'stone');
            }.bind(this));

            town_model.onResourceIronChange(this, function(model, value) {
                this.view.updateResources(value, 'iron');
            }.bind(this));

            town_model.onUsedPopulationChange(this, function(model, value) {
                this.view.updateUsedPopulation(value);
            }.bind(this));

            town_model.onAvailablePopulationChange(this, function(model, value) {
                this.view.updateAvailablePopulation(value);
            }.bind(this));
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutResourcesBarController = LayoutResourcesBarController;
}());