/*global GameViews, GameControllers, GameEvents */

(function() {
    'use strict';

    var BarracksMainViewController = GameControllers.TabController.extend({
        town_researches: null,
        initialize: function() {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        reRender: function() {
            //this.$el.empty();

            //Re-render complete view, because maybe in the different town there are no barracks or docks
            this.renderPage();
        },

        renderPage: function() {
            this.view = new GameViews.BarracksMainView({
                el: this.$el,
                controller: this
            });

            this.registerSubViewsControllers();
            this.registerEventListeners();

            return this;
        },

        /**
         * Register event listeners
         */
        registerEventListeners: function() {
            //Town switch
            this.stopObservingEvent(GameEvents.town.town_switch);
            this.observeEvent(GameEvents.town.town_switch, this.onTownSwitch.bind(this));

            //Town units change
            this.stopObservingEvent(GameEvents.town.units.change);
            this.observeEvent(GameEvents.town.units.change, this.onUnitsChange.bind(this));

            //town units beyond change
            this.stopObservingEvent(GameEvents.town.units_beyond.change);
            this.observeEvent(GameEvents.town.units_beyond.change, this.onUnitsChange.bind(this));

            //Listen on town researches
            this.registerResearchesListener();

            this.stopListening(this.getCollection('remaining_unit_orders'));
            this.getCollection('remaining_unit_orders').onOrderCountChange(this, this.onUnitOrderCountChange.bind(this));
        },

        registerResearchesListener: function() {
            var building_type = this.getBuildingType(),
                has_building = this.hasBuildingWithLevel(building_type, 1);

            //Stop listening on the previous model
            if (this.town_researches !== null) {
                this.stopListening(this.town_researches);
                this.town_researches = null;
            }

            //If the Barracks or Docks are not constructed (at least level 1)
            if (!has_building) {
                return;
            }

            this.town_researches = this.getCollection('towns').getCurrentTown().getResearches();
            this.town_researches.onResearchesChange(this, this.onResearchesChange.bind(this));
        },

        /**
         * Register sub views controllers
         */
        registerSubViewsControllers: function() {
            var has_building = this.hasBuildingWithLevel(this.getBuildingType(), 1);

            if (has_building) {
                this.destroyController('unit_details_controller');
                var unit_details_controller = this.registerController('unit_details_controller', new GameControllers.BarracksUnitDetailsViewController({
                    el: this.$el.find('.unit_details'),
                    parent_controller: this
                }));
                unit_details_controller.renderPage();

                this.destroyController('units_order_controller');
                var units_order_controller = this.registerController('units_order_controller', new GameControllers.BarracksUnitsOrderViewController({
                    el: this.$el.find('.unit_orders'),
                    parent_controller: this
                }));
                units_order_controller.renderPage();

                this.destroyController('banners_controller');
                var banners_controller = this.registerController('banners_controller', new GameControllers.BarracksBannersViewController({
                    el: this.$el,
                    parent_controller: this
                }));
                banners_controller.renderPage();
            }
        },

        getBuildingType: function() {
            return this.parent_controller.getBuildingType();
        },

        getSelectedUnitId: function() {
            return this.parent_controller.getSelectedUnitId();
        },

        getUnits: function() {
            return this.parent_controller.getUnits();
        },

        hasBuildingWithLevel: function(building_id, level) {
            return this.getCollection('towns').getCurrentTown().getBuildings().hasBuildingWithLevel(building_id, level);
        },

        getAvailableGold: function() {
            return this.getModel('player_ledger').getGold();
        },

        onTownSwitch: function() {
            this.parent_controller.onTownSwitch();

            this.reRender();
        },

        onResearchesChange: function() {
            var selected_unit_id = this.getSelectedUnitId();

            //Re-render only unit tabs because that's the only thing which can change
            this.view.renderUnitsTabs(selected_unit_id);
            this.getController('unit_details_controller').onResearchesChange();
        },

        onUnitsChange: function() {
            var selected_unit_id = this.getSelectedUnitId();

            this.view.renderUnitsTabs(selected_unit_id);
        },

        onUnitOrderCountChange: function() {
            var selected_unit_id = this.getSelectedUnitId();

            this.view.renderUnitsTabs(selected_unit_id);
        },

        onSelectUnitTabClick: function(unit_id) {
            this.parent_controller.setSelectedUnitId(unit_id);

            this.view.selectUnit(unit_id);
            this.getController('unit_details_controller').onSelectUnitTabClick();
        },

        onToggleInvisibleUnits: function(state) {
            this.view.toggleInvisibleUnits(state);
        },

        destroy: function() {

        }
    });

    window.GameControllers.BarracksMainViewController = BarracksMainViewController;
}());