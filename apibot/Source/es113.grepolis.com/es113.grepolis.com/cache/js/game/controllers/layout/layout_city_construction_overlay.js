/*global GameEvents, GameData, us, GameDataBuildings, ConstructionOverlayItemBuilding,
ConstructionOverlayItemContainer, CityOverviewItems, GameMixins, ConstructionQueueStrategyFactory, GameControllers,
Game, GameViews, GameDataInstantBuy */

(function() {
    'use strict';

    var Class = GameControllers.BaseController.extend(GameMixins.IntantBuyController);
    var features = require('data/features');

    var LayoutCityConstructionOverlay = Class.extend({
        view: null,
        current_town_model: null,
        construction_mode_active: false,
        buttons_special_pressed: {}, //stores informations whether special buildings containers are opened

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            this.building_orders = this.getCollection('building_orders');
            this.current_town_model = this.getCollection('towns').getCurrentTown();

            //Strategies has to be updated because 'town_id' changes for them
            this.updateStrategies();

            this._createConstructionOverlayView();

            //Fetch data only when there are some buildings orders, otherwise postpone it till user will click on the hammer
            if (this.building_orders.getCount() > 0) {
                this._updateCurrentTownData();
            }

            this.registerEventsListeners();
            this.registerModeDependingEventsListeners();

            this.registerUpdatePremiumButtonsCaptionsTimer();
        },

        updateStrategies: function() {
            var models = {
                player_ledger: this.getModel('player_ledger')
            };

            var collections = {
                feature_blocks: this.getCollection('feature_blocks'),
                unit_orders: this.getCollection('remaining_unit_orders'),
                towns: this.getCollection('towns')
            };

            this.addStrategy('ground_unit_queue', ConstructionQueueStrategyFactory.getUnitQueueStrategyInstance(Game.townId, 'barracks', models, collections));
            this.addStrategy('naval_unit_queue', ConstructionQueueStrategyFactory.getUnitQueueStrategyInstance(Game.townId, 'docks', models, collections));
        },


        getInstantBuyType: function() {
            return 'building';
        },

        getOrderStrategy: function(queue_type, unit_kind) {
            switch (queue_type) {
                case 'type_unit_queue':
                    return this.getStrategy(unit_kind + '_unit_queue');
                case 'type_research_queue':
                    return this.getStrategy('research_queue');
                case 'type_building_queue':
                    return this.getStrategy('building_queue');
                default:
                    throw 'Not supported strategy type';
            }
        },

        registerEventsListeners: function() {
            // Listen on town switch
            this.observeEvent(GameEvents.town.town_switch, function() {
                this.updateStrategies();
                this.resetSpecialBuildiungPressedStates();
                this._updateCurrentTownData();
                this.view.closeSpecialBuildingOverlay.bind(this.view);
            }.bind(this));

            // Listen on construction mode button
            this.observeEvent(GameEvents.ui.layout_construction_queue.construction_mode.activated, this.toggleConstructionMode.bind(this));
            this.observeEvent(GameEvents.ui.layout_construction_queue.construction_mode.deactivated, this.toggleConstructionMode.bind(this));
            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.island_view.click, this.view.closeSpecialBuildingOverlay.bind(this.view));
            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.strategic_map.click, this.view.closeSpecialBuildingOverlay.bind(this.view));
        },

        registerModeDependingEventsListeners: function() {
            this.registerConstructionModeEventsListeners();
            this.registerNormalModeEventsListeners();
        },

        registerNormalModeEventsListeners: function() {
            var rerenderPage = function() {
                //It makes sense to rerender the view only in this specific mode
                if (!this.isConstructionModeEnabled()) {
                    this.rerenderPage();
                }
            }.bind(this);

            this.listenToMultiEvents('all_events_normal_mode_to_force_update', [{
                    obj: this.getCollection('building_orders'),
                    method: 'onOrderCountChange'
                },
                {
                    obj: this.getCollection('building_orders'),
                    method: 'onOrderPropertyChange'
                },
                {
                    obj: this.getCollection('remaining_unit_orders'),
                    method: 'onOrderCountChange'
                },
                {
                    obj: this.getCollection('remaining_unit_orders'),
                    method: 'onOrderPropertyChange'
                },
                {
                    obj: this.getCollection('research_orders'),
                    method: 'onOrderCountChange'
                }
            ], rerenderPage);
        },

        registerConstructionModeEventsListeners: function() {
            var rerenderPage = function() {
                if (this.isConstructionModeEnabled()) {
                    this._updateCurrentTownData();
                }
            }.bind(this);

            this.listenToMultiEvents('all_events_construction_mode_to_force_update', [{
                    obj: this.getBuildingsModel(),
                    method: 'onBuildingLevelChange'
                },
                {
                    obj: this.getCollection('building_orders'),
                    method: 'onOrderCountChange'
                },
                {
                    obj: this.getCollection('building_orders'),
                    method: 'onOrderPropertyChange'
                },
                {
                    obj: this.getCollection('casted_powers'),
                    method: 'onCastedPowerCountChange'
                },
                {
                    obj: this.getModel('premium_features'),
                    method: 'onCuratorChange'
                }
            ], rerenderPage);
        },

        /**
         * Creates view
         *
         * @private
         */
        _createConstructionOverlayView: function() {
            this.view = new GameViews.LayoutCityConstructionOverlay({
                el: this.$el.find('.js-city-construction-overlay-viewport'),
                $parent: this.$el,
                controller: this
            });
        },

        /**
         * Prevents situation when somebody is clicking 'build time reduction' button twice
         * Will also hide the premium_action button because of consistency to construction queue where the buttons also get hidden when timer is set to zero
         */
        disableConstructionModeButtons: function() {
            var comp = this.getComponents('pressed_mode_components');

            for (var com_name in comp) {
                if (comp.hasOwnProperty(com_name) && comp[com_name].disable) {
                    comp[com_name].disable();
                    if (features.isInstantBuyEnabled() && com_name.indexOf('premium_action_') !== -1) {
                        comp[com_name].hide();
                    }
                }
            }
        },

        /**
         * Fetches data about the buildings which can be build from the server
         *
         * @private
         */
        _updateCurrentTownData: function() {
            if (this.isConstructionModeEnabled()) {
                this.disableConstructionModeButtons();
            }

            this.stopListening(this.current_town_model);

            //Update current town model
            this.current_town_model = this.getCollection('towns').getCurrentTown();
            // Fetch data about which buildings can be build/destroyed etc. (precalculated data from backend)
            this.current_town_model.getBuildingBuildData(function() {
                this.rerenderPage();
            }.bind(this));

            //Listen on resources change
            this.current_town_model.onResourcesChange(this, function() {
                //In normal mode there is nothing which depends on the resources
                if (this.isConstructionModeEnabled()) {
                    this.rerenderPage();
                }
            }.bind(this));

            //Listen on researches change
            this.current_town_model.getResearches().onResearchesChange(this, function() {
                //refetch data to see if architecture price reduction is researched (GP-12199)
                this._updateCurrentTownData();
            }.bind(this));
        },

        rerenderPage: function() {
            this._renderPage();
            this.openSpecialBuildingsContainers();
            this.registerUpdatePremiumButtonsCaptionsTimer();
        },

        renderPage: function() {
            // This method is called by the parent class, but we have to call it after we load the data from the server
            return this;
        },

        _renderPage: function() {
            // check if the view exists before trying to render:
            // e.g. when doing town switch we might get a delayed response (e.g. from getBuildingBuildData)
            // but the user has already switched to the map -> no view, js error
            if (this.view) {
                this.view.render();
            }
        },

        /**
         * Returns true if construction mode is enabled
         *
         * @return {Boolean}
         */
        isConstructionModeEnabled: function() {
            return this.construction_mode_active === true;
        },

        getFirstBuildingOrderInQueue: function() {
            return this.getCollection('building_orders').getFirstModel();
        },

        getFirstBuildingOrder: function() {
            return this.getCollection('building_orders').getFirstOrder();
        },

        /**
         * renders the overlay frames for the buildings and special buildings
         * If a special building is under construction, it is rendered like a normal building
         * else, a special container holding a choice to build one special building is rendered
         *
         * @returns [Array] ConstructionOverlayItemBuilding
         */
        getConstructedBuildings: function() {
            var buildings_to_render = [],
                is_construction_mode = this.isConstructionModeEnabled();

            //
            // SPECIAL BUILDINGS (if a special building is constructed, render it like a normal building)
            //

            us.each(this.getSpecialBuildings(), function(building_level, building_id) {
                if (is_construction_mode && building_level > 0) {
                    buildings_to_render.push(this.getConstructionOverlayItemBuilding(building_id));
                }
            }.bind(this));

            //
            // NORMAL BUILDINGS
            //
            us.each(this.getNormalBuildings(), function(building_level, building_id) {
                // skip this building if we are in normal mode and have no building orders
                if (!is_construction_mode && !this.isBuildingUnderConstruction(building_id)) {
                    return;
                }

                if (is_construction_mode) {
                    if (!this.isBuildingRequirementsFulfilled(building_id)) {
                        if (!this.areSpecialTutorialQuestsRulesApplied(building_id)) {
                            return;
                        }
                    }
                }

                buildings_to_render.push(this.getConstructionOverlayItemBuilding(building_id));
            }.bind(this));

            //
            // SPECIAL BUILDINGS SPOTS ('special1', 'special2')
            //
            var special_building_spots = GameDataBuildings.getSpecialBuildings();

            us.each(special_building_spots, function(building_id_array, special_building_spot_name) {
                //If the building has not been built yet
                if (!GameDataBuildings.isSpecialBuildSpotOccupied(building_id_array, this.getSpecialBuildings())) {
                    var under_construction_building_id = this.getFirstSpecialBuildingUnderConstructionId(building_id_array);

                    if (under_construction_building_id !== null) {
                        buildings_to_render.push(this.getConstructionOverlayItemBuilding(under_construction_building_id));
                        return;
                    }

                    if (is_construction_mode) {
                        if (this.isSpecialBuildingSpotPossible(building_id_array)) {
                            buildings_to_render.push(this.getConstructionOverlayItemContainer(special_building_spot_name));
                        }
                    }

                }
            }.bind(this));

            return buildings_to_render;
        },

        /**
         * Returns true if we should show the build buttons
         *
         * @return {Boolean}
         */
        areBuildButtonsVisible: function(building) {
            // not shown if not in construction mode
            if (!this.isConstructionModeEnabled()) {
                return false;
            }

            // not shown if at max level
            if (building.isAtMaxLevel()) {
                return false;
            }

            // no shown if we are upgrading to the max level already
            if (building.isUpgrading() && building.getBuildingLevel() === building.getBuildingMaxLevel() - 1) {
                return false;
            }

            return true;
        },

        getConstructionOverlayItemBuilding: function(building_id) {
            return new ConstructionOverlayItemBuilding(this.getConstructionOverlayItemData(building_id));
        },

        getConstructionOverlayItemContainer: function(building_id) {
            return new ConstructionOverlayItemContainer(this.getConstructionOverlayItemData(building_id));
        },

        getConstructionOverlayItemData: function(building_id) {
            return {
                building_id: building_id,
                models: {
                    player_ledger: this.getModel('player_ledger'),
                    current_town: this.getCollection('towns').getCurrentTown()
                },
                collections: {
                    building_build_datas: this.getCollection('building_build_datas'),
                    building_orders: this.getCollection('building_orders')
                },
                l10n: this.l10n
            };
        },

        /**
         * Returns buildings models for current_town
         */
        getBuildingsModel: function() {
            return this.current_town_model.getBuildings();
        },

        /**
         * Returns all buildings and levels for the current town
         *
         * @return {Object}
         */
        getBuildings: function() {
            return this.getBuildingsModel().getBuildings();
        },

        /**
         * Toggle the construction mode, rerenders the page
         */
        toggleConstructionMode: function() {
            this.construction_mode_active = !this.construction_mode_active;

            if (this.construction_mode_active) {
                //Fetch data and rerender overview
                this._updateCurrentTownData();
            } else {
                //Simply rerender overview
                this.rerenderPage();
            }
        },

        /**
         * Checks whether the special rules for Tutorial Quests wants to display buildings
         *
         * @param {String} building_id
         * @return {Boolean}
         */
        areSpecialTutorialQuestsRulesApplied: function(building_id) {
            var buildings_levels = this.getBuildings();

            return CityOverviewItems.prototype.areSpecialTutorialQuestsRulesApplied(building_id, buildings_levels);
        },

        /**
         * Returns true if at least one of a given set of slot_buildings_ids
         * has fullfilled build requirements
         *
         * @param {Array} slot_buildings_ids    Array of building_id
         *
         * @return {Boolean}
         */
        isSpecialBuildingSpotPossible: function(slot_buildings_ids) {
            var building_id;

            for (var i = 0, l = slot_buildings_ids.length; i < l; i++) {
                building_id = slot_buildings_ids[i];

                if (this.isBuildingRequirementsFulfilled(building_id) || this.areSpecialTutorialQuestsRulesApplied(building_id)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Return true if all requirements for a given building as matched
         *
         * @param {String} building_id
         *
         * @return {Boolean}
         */
        isBuildingRequirementsFulfilled: function(building_id) {
            return GameDataBuildings.isBuildingRequirementsFulfilled(
                this.getCollection('building_orders'),
                this.current_town_model,
                building_id
            );
        },

        /**
         * Return buildings not marked as special (special=false in GameData.buildings)
         *
         * @return {Object}
         */
        getNormalBuildings: function() {
            return this._filterBuildings('special', false);
        },

        /**
         * Return buildings marked as special (special=true in GameData.buildings)
         *
         * @return {Object}
         */
        getSpecialBuildings: function() {
            return this._filterBuildings('special', true);
        },

        /**
         * Filters the currentTown.buildings object for given property and value from GameData.buildings
         *
         * @param {String} property     Name of the GameData.buildings property to look for
         * @param {Boolean} value        Value that needs to match to pass the test
         *
         * @return {Object} GameData.buildings object
         */
        _filterBuildings: function(property, value) {
            var buildings = this.getBuildings(),
                gd_buildings = GameData.buildings,
                result = {};

            us.each(buildings, function(building_level, building_id) {
                if (gd_buildings[building_id][property] === value) {
                    result[building_id] = building_level;
                }
            });

            return result;
        },

        /**
         * Given an array of building_id returns the id of the first
         * building under construction or null, if none
         *
         * @param {Array} building_id_array    Array of building_ids
         *
         * @return {String|null}
         */
        getFirstSpecialBuildingUnderConstructionId: function(building_id_array) {
            var building_id;

            for (var i = 0, l = building_id_array.length; i < l; i++) {
                building_id = building_id_array[i];

                if (this.isBuildingUnderConstruction(building_id)) {
                    return building_id;
                }
            }

            return null;
        },

        getOrders: function() {
            return this.building_orders.getOrders();
        },

        /**
         * Returns true if a building has building_orders otherwise false
         *
         * @param {String} building_id
         *
         * @return {Boolean}
         */
        isBuildingUnderConstruction: function(building_id) {
            var orders = this.getOrders();

            for (var i = 0, l = orders.length; i < l; i++) {
                if (orders[i].getBuildingId() === building_id) {
                    return true;
                }
            }

            return false;
        },

        upgradeBuilding: function(building_id) {
            var building = this.getConstructionOverlayItemBuilding(building_id);

            if (building.isUpgradeable()) {
                building.upgrade();
            }
        },

        /**
         * Sets value which represents tha the special building container should be opened
         *
         * @param {String} building_id
         */
        setSpecialBuildingPressed: function(building_id) {
            this.buttons_special_pressed[building_id] = true;
        },

        /**
         * Sets value which represents tha the special building container should be closed
         *
         * @param {String} building_id
         */
        setSpecialBuildingUnPressed: function(building_id) {
            this.buttons_special_pressed[building_id] = false;
        },

        /**
         * Resets the button press state
         */
        resetSpecialBuildiungPressedStates: function() {
            this.buttons_special_pressed = {};
        },

        /**
         * Checks whether the special buildings containers should be opened or closed
         */
        openSpecialBuildingsContainers: function() {
            var building_id, special_buildings = us.keys(GameDataBuildings.getSpecialBuildings());

            for (var i = 0, l = special_buildings.length; i < l; i++) {
                building_id = special_buildings[i];

                if (this.buttons_special_pressed[building_id]) {
                    this.view.onClickOpenContainerButton(building_id);
                }
            }
        },

        getNormalModeOrders: function() {
            var orders = {},
                first_building_order = this.getFirstBuildingOrder();

            var first_naval_unit_order = this.getCollection('remaining_unit_orders').getActiveNavalUnitOrder() || null;
            var first_ground_unit_order = this.getCollection('remaining_unit_orders').getActiveGroundUnitOrder() || null;
            var first_research_order = this.getCollection('research_orders').getFirstOrder() || null;

            if (first_naval_unit_order) {
                orders.docks = {
                    primary_order: null,
                    secondary_order: first_naval_unit_order
                };
            }

            if (first_ground_unit_order) {
                orders.barracks = {
                    primary_order: null,
                    secondary_order: first_ground_unit_order
                };
            }

            if (first_research_order) {
                orders.academy = {
                    primary_order: null,
                    secondary_order: first_research_order
                };
            }

            if (first_building_order) {
                var first_building_order_id = first_building_order.getType();

                //Put building order in the proper place
                if (orders.hasOwnProperty(first_building_order_id)) {
                    orders[first_building_order_id].primary_order = first_building_order;
                } else {
                    orders[first_building_order_id] = {
                        primary_order: first_building_order,
                        secondary_order: null
                    };
                }
            }

            return orders;
        },

        getSecondaryOrderIconName: function(building_id) {
            switch (building_id) {
                case 'docks':
                case 'barracks':
                    return 'unit_icon40x40';
                case 'academy':
                    return 'research_icon research40x40';
                default:
                    return null;
            }
        },

        getNextBuildingLevel: function(building_order) {
            return GameDataInstantBuy.getNextBuildingLevel(this.getCollection('building_orders'), building_order, this.current_town_model.getBuildings());
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutCityConstructionOverlay = LayoutCityConstructionOverlay;
}());