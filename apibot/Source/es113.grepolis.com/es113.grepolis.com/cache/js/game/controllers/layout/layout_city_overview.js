/* global us, GameData, GameControllers, GameViews, GameEvents, CityOverviewBuilding, CityOverviewItems,
CityOverviewAnimations, PhoenicianSalesmanWindowFactory, MarketWindowFactory, StorageWindowFactory,
BuildingWindowFactory, Game, GodSelectionWindowFactory */
(function() {
    'use strict';

    var Buildings = require('enums/buildings');

    var LayoutCityOverviewController = GameControllers.BaseController.extend({
        view: null,
        current_town_model: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            //this.l10n = options.l10n;
            this.self = this;
            this.current_town_model = this.getCollection('towns').getCurrentTown();

            this.image_map_positions = this._prepareImageMapPositions();

            this.registerEventsListeners();

            this.publishEvent(GameEvents.building.city_overview.initialized);
        },

        rerenderPage: function(building_order, building_orders) {
            this.view.rerender();
        },

        renderPage: function() {
            this.view = new GameViews.LayoutCityOverview({
                el: this.$el,
                controller: this
            });

            return this;
        },

        /**
         * handles window opening after clicking on map
         */
        openWindow: function(building_id) {
            switch (building_id) {
                case Buildings.PHOENICIAN_MERCHANT:
                    PhoenicianSalesmanWindowFactory.openPhoenicianSalesmanWindow();
                    break;
                case Buildings.STORAGE:
                    StorageWindowFactory.openWindow();
                    break;
                case Buildings.MARKET:
                    MarketWindowFactory.openWindow();
                    break;
                case Buildings.TEMPLE:
                    GodSelectionWindowFactory.openWindow();
                    break;
                default:
                    BuildingWindowFactory.open(building_id);
            }
        },

        /**
         * centers a view in case of e.g. windows resize, if a view exists when event is fired
         */
        recenterView: function() {
            if (this.view) {
                this.view.center();
            }
        },

        /**
         * Performs actions when construction mode is being enabled
         */
        activateConstructionMode: function() {
            this.view.activateConstructionMode();
        },

        /**
         * Performs actions when construction mode is being disabled
         */
        deactivateConstructionMode: function() {
            this.view.deactivateConstructionMode();
        },

        /**
         * Returns buildings model
         *
         * @return {GameModels.Buildings}
         */
        getBuildingsModel: function() {
            return this.current_town_model.getBuildings();
        },

        /**
         * Returns buildings object
         *
         * @return {Object}
         */
        getBuildings: function() {
            return this.getBuildingsModel().getBuildings();
        },

        /**
         * Returns god id for the current town
         *
         * @return {String}
         */
        getGod: function() {
            return this.current_town_model.getGod();
        },

        /**
         * Returns objects which represent building animations
         *
         * @return {Array}
         */
        getBuildingAnimationsObjects: function() {
            var animations = new CityOverviewAnimations({
                models: {
                    current_town: this.current_town_model,
                    player_gods: this.getModel('player_gods'),
                    casual_worlds_blessed_town: this.getModel('casual_worlds_blessed_town')
                },
                collections: {
                    building_orders: this.getCollection('building_orders'),
                    unit_orders: this.getCollection('unit_orders'),
                    research_orders: this.getCollection('research_orders'),
                    celebrations: this.getCollection('celebrations')
                }
            });

            return animations.getObjects();
        },

        /**
         * Returns objects which represents buildings
         *
         * @return {Array}
         */
        getBuildingObjects: function() {
            var building_objects = [],
                building_orders = this.getCollection('building_orders'),
                buildings = this.getBuildings(),
                god_id = this.getGod(),
                image_map_positions = this.getImageMapPositions();

            us.each(buildings, function(building_level, building_id) {
                var is_in_construction = !!building_orders.getOrder(building_id),
                    building_name = GameData.buildings[building_id].name;

                if (building_level >= 1 || (building_level === 0 && is_in_construction)) {
                    building_objects.push(new CityOverviewBuilding({
                        building_id: building_id,
                        level: building_level,
                        god_id: god_id,
                        is_in_construction: is_in_construction,
                        building_name: building_name,
                        image_map_positions: image_map_positions
                    }));
                }
            });

            return building_objects;
        },

        /**
         * Returns objects which represents everything which is not an animation and nor building
         *
         * @return {Array}
         */
        getItemsObjects: function() {
            var items = new CityOverviewItems({
                image_map_positions: this.getImageMapPositions(),
                models: {
                    current_town: this.current_town_model,
                    phoenician_salesman: this.getModel('phoenician_salesman'),
                    casual_worlds_blessed_town: this.getModel('casual_worlds_blessed_town')
                },
                collections: {
                    units: this.getCollection('units'),
                    building_orders: this.getCollection('building_orders')
                }
            });

            return items.getObjects();
        },

        getImageMapPositions: function() {
            return this.image_map_positions;
        },

        /**
         * Registers event listeners
         */
        registerEventsListeners: function() {
            var buildings_order_collection = this.getCollection('building_orders'),
                player_gods_model = this.getModel('player_gods'),
                research_orders_collection = this.getCollection('research_orders'),
                phoenician_salesman_model = this.getModel('phoenician_salesman'),
                celebrations_collection = this.getCollection('celebrations'),
                unit_orders_collection = this.getCollection('unit_orders'),
                units = this.getCollection('units'),
                current_town_model = this.current_town_model,
                rerenderPage = this.rerenderPage.bind(this);

            //Listen on buildings changes
            buildings_order_collection.onOrderCountChange(this, rerenderPage);
            buildings_order_collection.onOrderPropertyChange(this, rerenderPage);

            //Listen on town switch
            this.observeEvent(GameEvents.town.town_switch, function() {
                //Update current town model (don't use 'current_town_model' saved in variable here!!!)
                this.current_town_model = this.getCollection('towns').getCurrentTown();
                //Rerender city overview
                this.rerenderPage();
            }.bind(this));

            //Listen on resources change
            this.observeEvent(GameEvents.town.resources.limit_reached, rerenderPage);
            this.observeEvent(GameEvents.town.resources.limit_freed, rerenderPage);
            this.observeEvent(GameEvents.town.population.limit_reached, rerenderPage);
            this.observeEvent(GameEvents.town.population.limit_freed, rerenderPage);

            this.observeEvent(GameEvents.ui.layout_construction_queue.construction_mode.activated, this.activateConstructionMode.bind(this));
            this.observeEvent(GameEvents.ui.layout_construction_queue.construction_mode.deactivated, this.deactivateConstructionMode.bind(this));

            // Listen on night mode change
            this.observeEvent(GameEvents.game.night, function() {
                // wrapped in anonymous function because view doesn't exist yet
                this.view.setNightMode(Game.night_mode);
            }.bind(this));

            //Listen on favor change
            player_gods_model.onGodsFavorChange(this, rerenderPage);

            //Listen on god change
            current_town_model.onGodChange(this, rerenderPage);

            //Listen on research change
            research_orders_collection.onOrderCountChange(this, rerenderPage);
            research_orders_collection.onOrderPropertyChange(this, rerenderPage);

            //Listen on phoenician salesman
            phoenician_salesman_model.onCurrentTownChange(this, rerenderPage);

            //Listen on the celebrations
            celebrations_collection.onCelebrationsEventsCountChange(this, rerenderPage);

            unit_orders_collection.onOrderCountChange(this, rerenderPage);
            units.onUnitsColonizeShipChange(this, function(model) {
                if (!model.hadAlreadyAColonizationShipBefore() && model.hasColonizationShip()) {
                    rerenderPage();
                }
            });

            // listen for window resize and trigger re-centering of the view
            this.observeEvent(GameEvents.document.window.resize, this.recenterView.bind(this));
        },

        _prepareImageMapPositions: function() {
            var corrected_positions = {},
                gd_click_map = GameData.city_overview.click_map,
                positions = gd_click_map.start_offsets,
                relative_positions = gd_click_map.map_points;

            us.each(relative_positions, function(position_string, building_id) {
                var building_offset = positions[building_id],
                    position_array = position_string.split(','),
                    current_coord = 'x',
                    result_array = [],
                    i, coord;

                if (!building_offset) {
                    return;
                }

                for (i = 0; i < position_array.length; i++) {
                    coord = parseInt(position_array[i], 10) + parseInt(building_offset[current_coord], 10);
                    current_coord = (current_coord === 'x') ? 'y' : 'x';
                    result_array.push(coord);
                }

                corrected_positions[building_id] = result_array.join(',');
            });

            return corrected_positions;
        },

        isCityNightModeEnabled: function() {
            return this.getModel('player_settings').isCityNightModeEnabled();
        },

        destroy: function() {
            this.publishEvent(GameEvents.building.city_overview.destroyed);
        }
    });

    window.GameControllers.LayoutCityOverviewController = LayoutCityOverviewController;
}());