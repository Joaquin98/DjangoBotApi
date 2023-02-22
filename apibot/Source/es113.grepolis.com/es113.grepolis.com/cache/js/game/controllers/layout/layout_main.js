/*global ConstructionQueueStrategyFactory, DM, GameEvents, GameDataHeroes, HelperGame, Game, CastSpellStrategyFactory */

(function(controllers) {
    'use strict';

    var LayoutModes = require('enums/layout_modes');

    controllers.LayoutMainController = controllers.BaseController.extend({
        sub_controllers: [],

        initialize: function(options) {
            controllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function(data) {
            this.models = data.models;
            this.collections = data.collections;
            this.templates = data.templates;
            this.l10n = DM.getl10n('layout');
            this.initializeElements();
            this.bindEventListeners();

            return this;
        },

        getConstructionQueueControllerObject: function($el, templates, sub_context) {
            var strategy = ConstructionQueueStrategyFactory.getBuildingQueueStrategyInstance(this.models, this.collections);
            var Controller = strategy.getControllerClass();

            return new Controller({
                el: $el,
                l10n: {
                    construction_queue: DM.getl10n('construction_queue')
                },
                templates: templates,
                models: {
                    premium_features: this.models.premium_features,
                    player_ledger: this.models.player_ledger
                },
                collections: {
                    building_orders: this.collections.building_orders,
                    towns: this.collections.towns,
                    tutorial_quests: this.collections.tutorial_quests
                },
                cm_context: this.getContext(sub_context),
                strategies: {
                    queue: strategy
                },
                tooltip_position: 'bottom-center'
            });
        },

        /**
         * Units Queue
         *
         * @param {Position} tooltip_position
         * @param {jQuery} $el
         * @param {String} building_type   'barracks' or 'docks'
         * @param {Context} cm_context     optional context
         */
        getUnitsQueueControllerObject: function(tooltip_position, $el, building_type, cm_context) {
            cm_context = cm_context || {
                main: 'units_queue_old',
                sub: 'index'
            };

            var strategy = ConstructionQueueStrategyFactory.getUnitQueueStrategyInstance(Game.townId, building_type, this.models, this.collections);

            /*this.collections.feature_blocks.push({
            	blocked_from: Timestamp.now() + 10,
            	blocked_until: Timestamp.now() + 60 * 5 + 10,
            	feature_type: "instant_buy",
            	player_id: Game.player_id,
            	town_id: Game.townId
            });*/

            var Controller = strategy.getControllerClass();

            return new Controller({
                el: $el,
                l10n: {
                    construction_queue: DM.getl10n('construction_queue')
                },
                templates: DM.getTemplate('COMMON', 'units_queue'),
                models: {
                    premium_features: this.models.premium_features,
                    player_ledger: this.models.player_ledger
                },
                collections: {
                    remaining_unit_orders: this.collections.unit_orders,
                    towns: this.collections.towns,
                    feature_blocks: this.collections.feature_blocks
                },
                cm_context: cm_context,
                strategies: {
                    queue: strategy
                },
                building_type: building_type,
                tooltip_position: tooltip_position
            });
        },

        hasCurator: function() {
            return this.getModel('premium_features').hasCurator();
        },

        getController: function(name) {
            var controllers = this.sub_controllers,
                i, l = controllers.length;

            for (i = 0; i < l; i++) {
                if (controllers[i].name === name) {
                    return controllers[i].controller;
                }
            }

            return false;
        },

        removeController: function(name) {
            var controllers = this.sub_controllers,
                l = controllers.length;

            while (l--) {
                if (controllers[l].name === name) {
                    controllers.splice(l, 1);

                    return true;
                }
            }

            return false;
        },

        bindEventListeners: function() {
            var premium_features = this.getModel('premium_features');

            //Listen on Curator activation
            premium_features.onCuratorChange(this, function() {
                if (premium_features.hasCurator()) {
                    this.initializeQuickBar();
                } else {
                    this.deinitializeController('quickbar');
                }
            }.bind(this));

            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.strategic_map.click, this.onRadiobuttonStrategicMapClick.bind(this));
            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.island_view.click, this.onRadiobuttonIslandViewClick.bind(this));
            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.city_overview.click, this.onRadiobuttonCityOverviewClick.bind(this));

            this.observeEvent(GameEvents.building.city_overview.initialized, this.onCityOverviewInitialized.bind(this));
            this.observeEvent(GameEvents.building.city_overview.destroyed, this.onCityOverviewDestroyed.bind(this));
        },

        initializeElements: function() {
            if (GameDataHeroes.areHeroesEnabled()) {
                this.initializeHeroesOverview();
                this.initializeCoins();
            }
            this.initializeInventoryButton();
            this.initializeNotepadButton();
            this.initializePremiumButton();
            this.initializeAdvisors();
            this.initializePremiumFeatures();
            this.initializeBullEyeArea();
            this.initializeGrepoScore();
            this.initializeServerTime();
            this.initializeToolbarActivities();
            this.initializeMainMenu();
            this.initializeConfigButtons();
            this.initializeGods();
            this.initializeTownNameArea();
            this.initializePremium();
            this.initializeBattlepoints();

            if (this.hasCurator()) {
                this.initializeQuickBar();
            }

            this.initializeUnits();
            this.initializeUnitsTime();
            this.initializeGodsSpells();
            this.initializeResourcesBar();
            this.initializeInfoPage();
            this.initializeExternalSurveyIcon();
            this.initializeHightlights();
            this.initializeSkipTutorial();

            if (HelperGame.showCityOverviewOnGameLoad()) {
                this.initializeCityOverview();
                if (HelperGame.constructFromCityOverview()) {
                    this.initializeConstructionQueue();
                }
                this.initializeCityConstructionOverlay();
                this.initializeEnvironmentAnimations();
                this.setLayoutMode(LayoutModes.CITY_OVERVIEW);
                // call the event handler for city_overview
                // because the handler gets registerd after this
                // function finished
                this.onCityOverviewInitialized();
            } else {
                this.setLayoutMode(LayoutModes.ISLAND_VIEW);
            }

            this.initializeGameEventsItems();

        },

        initializeCityOverview: function() {
            var Features = require('data/features');
            var models = {
                player_gods: this.models.player_gods,
                phoenician_salesman: this.models.phoenician_salesman,
                player_settings: this.models.player_settings
            };

            if (Features.isCasualWorld()) {
                models.casual_worlds_blessed_town = this.models.casual_worlds_blessed_town;
            }


            var controller = new controllers.LayoutCityOverviewController({
                el: this.$el.find('.ui_city_overview'),
                l10n: {
                    main: DM.getl10n('city_overview'),
                    common: DM.getl10n('common')
                },
                templates: {
                    main: this.templates.city_overview.main
                },
                models: models,
                collections: {
                    building_orders: this.collections.building_orders,
                    towns: this.collections.towns,
                    unit_orders: this.collections.unit_orders,
                    research_orders: this.collections.research_orders,
                    celebrations: this.collections.celebrations,
                    units: this.collections.units
                },
                cm_context: this.getContext('layout_city_overview')
            });

            this.sub_controllers.push({
                name: 'city_overview',
                controller: controller.renderPage()
            });
        },

        initializeEnvironmentAnimations: function() {
            var controller = new controllers.LayoutEnvironmentAnimationsController({
                el: this.$el.find('.js-city-env-animations-viewport'),
                templates: {
                    main: this.templates.city_overview.environment_animations
                },
                cm_context: this.getContext('layout_environment_animations')
            });

            this.sub_controllers.push({
                name: 'environment_animations',
                controller: controller.renderPage()
            });
        },

        initializeGameEventsItems: function() {
            var $el = this.$el.find('.js-city-game-events-items-viewport'),
                BenefitTypes = require('enums/benefit_types');

            if (this.models.mermaid && this.models.mermaid.getTimeLeft() > 0) {
                var controller = new controllers.LayoutGameEventsItemsController({
                    el: $el,
                    templates: {
                        game_events_items: this.templates.city_overview.game_events_items
                    },
                    cm_context: this.getContext('layout_game_events_items'),
                    l10n: DM.getl10n('valentinesday'),
                    models: {
                        mermaid: this.models.mermaid
                    }
                });

                this.sub_controllers.push({
                    name: 'game_events_items',
                    controller: controller.renderPage()
                });
            }

            if (this.collections.benefits.getFirstRunningBenefitOfType(BenefitTypes.TOWN_OVERLAY)) {
                var windows = require('game/windows/ids'),
                    BenefitHelper = require('helpers/benefit'),
                    TownOverlayGameEventItemController = require('events/town_overlay/controllers/layout_game_event_item'),
                    town_overlay_controller = new TownOverlayGameEventItemController({
                        el: $el,
                        cm_context: this.getContext('layout_game_events_items'),
                        benefit: this.collections.benefits.getFirstRunningBenefitOfType('town_overlay'),
                        l10n: BenefitHelper.getl10nForSkin({}, windows.TOWN_OVERLAY, BenefitTypes.TOWN_OVERLAY)
                    });

                this.sub_controllers.push({
                    name: windows.TOWN_OVERLAY,
                    controller: town_overlay_controller.renderPage()
                });
            }
        },

        initializeSpawnEvent: function(model) {
            var $el = this.$el.find('.js-city-game-events-items-viewport');

            if (model && model.getTimeLeft() > 0 && !model.isDestroyed()) {
                var LayoutGameEventSpawnController = require('events/spawn/controllers/spawn_portal');
                var spawn = new LayoutGameEventSpawnController({
                    el: $el,
                    templates: {},
                    cm_context: this.getContext('spawn_portal'),
                    l10n: DM.getl10n('spawn'),
                    models: {
                        spawn: model
                    }
                });

                this.sub_controllers.push({
                    name: 'spawn_portal',
                    controller: spawn.renderPage()
                });
            }
        },

        initializeConstructionQueue: function() {
            var controller = new controllers.LayoutConstructionQueueContainerController({
                el: this.$el.find('.ui_construction_queue'),
                layout_main_controller: this,
                l10n: DM.getl10n('city_overview', 'construction_overlay'),
                templates: {
                    construction_queue: this.templates.construction_queue
                },
                models: {},
                collections: {

                },
                cm_context: this.getContext('layout_construction_queue_container')
            });

            this.sub_controllers.push({
                name: 'construction_queue_container',
                controller: controller.renderPage()
            });
        },

        initializeCityConstructionOverlay: function() {
            var controller = new controllers.LayoutCityConstructionOverlay({
                el: this.$el.find('.ui_city_overview'),
                l10n: DM.getl10n('city_overview'),
                templates: DM.getTemplate('COMMON', 'city_construction_overlay'),
                models: {
                    player_ledger: this.getModel('player_ledger'),
                    premium_features: this.getModel('premium_features')
                },
                collections: {
                    building_orders: this.collections.building_orders,
                    remaining_unit_orders: this.collections.unit_orders,
                    research_orders: this.collections.research_orders,
                    towns: this.collections.towns,
                    building_build_datas: this.collections.building_build_datas,
                    casted_powers: this.collections.casted_powers,
                    feature_blocks: this.collections.feature_blocks
                },
                cm_context: this.getContext('construction_overlay'),
                strategies: {
                    building_queue: ConstructionQueueStrategyFactory.getBuildingQueueStrategyInstance(this.models, this.collections),
                    building_queue_instant_buy: ConstructionQueueStrategyFactory.getBuildingQueueInstantBuyStrategyInstance(this.models, this.collections),
                    research_queue: ConstructionQueueStrategyFactory.getResearchQueueStrategyInstance(this.models, this.collections)
                }
            });

            this.sub_controllers.push({
                name: 'city_construction_overlay',
                controller: controller.renderPage()
            });
        },
        initializeResourcesBar: function() {
            var controller = new controllers.LayoutResourcesBarController({
                el: this.$el.find('.ui_resources_bar'),
                l10n: DM.getl10n('layout', 'resources_bar'),
                templates: {
                    main: this.templates.resources_bar.main
                },
                collections: {
                    towns: this.collections.towns
                },
                cm_context: this.getContext('layout_resources_bar')
            });

            this.sub_controllers.push({
                name: 'resources_bar',
                controller: controller.renderPage()
            });
        },

        initializeQuickBar: function() {
            var controller = new controllers.LayoutQuickbarController({
                el: this.$el.find('.ui_quickbar'),
                l10n: $.extend({}, DM.getl10n('COMMON'), DM.getl10n('layout', 'quickbar')),
                templates: {
                    main: this.templates.quickbar.main,
                    options: this.templates.quickbar.options
                },
                models: {
                    quickbar: this.models.quickbar
                },
                cm_context: this.getContext('layout_quickbar')
            });

            this.sub_controllers.push({
                name: 'quickbar',
                controller: controller.renderPage()
            });
        },

        deinitializeController: function(name) {
            var controller = this.getController(name);

            if (!controller) {
                return;
            }

            if (typeof controller._destroy === 'function') {
                controller._destroy();
            }

            this.removeController(name);
        },

        initializeTownNameArea: function() {
            var controller = new controllers.LayoutTownNameAreaController({
                el: this.$el.find('.town_name_area'),
                l10n: DM.getl10n('layout', 'town_name_area'),
                templates: {
                    town_groups_list: this.templates.town_name_area.town_groups_list,
                    casted_powers: this.templates.town_name_area.casted_powers,
                    casted_power_tooltip: this.templates.town_name_area.casted_power_tooltip,
                    culture_overview: this.templates.town_name_area.culture_overview
                },
                collections: {
                    casted_powers: this.collections.casted_powers,
                    casted_alliance_powers: this.collections.casted_alliance_powers,
                    capped_powers_progresses: this.collections.capped_powers_progresses,
                    town_groups: this.collections.town_groups,
                    town_group_towns: this.collections.town_group_towns,
                    towns: this.collections.towns,
                    island_quests: this.collections.island_quests,
                    attacks: this.collections.attacks,
                    supports: this.collections.supports,
                    temples: this.collections.temples
                },

                models: {
                    premium_features: this.models.premium_features
                },
                cm_context: this.getContext('layout_town_name_area')
            });

            this.sub_controllers.push({
                name: 'town_name_area',
                controller: controller.renderPage()
            });
        },

        initializeToolbarActivities: function() {
            var controller = new controllers.LayoutToolbarActivitiesController({
                el: this.$el.find('.toolbar_activities'),
                l10n: DM.getl10n('layout', 'toolbar_activities'),
                templates: this.templates.toolbar_activities,
                controllers: {
                    layout_main: this
                },
                models: {
                    premium_features: this.models.premium_features
                },
                collections: {
                    trades: this.collections.trades,
                    unit_orders: this.collections.unit_orders,
                    movements_spys: this.collections.movements_spys,
                    movements_units: this.collections.movements_units,
                    movements_revolts_attacker: this.collections.movements_revolts_attacker,
                    movements_revolts_defender: this.collections.movements_revolts_defender,
                    movements_colonizations: this.collections.movements_colonizations,
                    movements_conquerors: this.collections.movements_conquerors,
                    temple_commands: this.collections.temple_commands
                },
                cm_context: this.getContext('layout_toolbar_activities')
            });

            this.sub_controllers.push({
                name: 'toolbar_activities',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Server Time Area
         */
        initializeServerTime: function() {
            var controller = new controllers.LayoutServerTimeController({
                el: this.$el.find('.server_time_area'),
                l10n: DM.getl10n('COMMON'),
                cm_context: this.getContext('layout_server_time')
            });

            this.sub_controllers.push({
                name: 'server_time',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Bulls Eye Area
         */
        initializeBullEyeArea: function() {
            var controller = new controllers.LayoutBullEyeAreaController({
                el: this.$el.find('.topleft_navigation_area'),
                collections: {
                    player_map_favorites: this.getCollection('player_map_favorites')
                },
                l10n: DM.getl10n('COMMON'),
                cm_context: this.getContext('layout_bulls_eye_area')
            });

            this.sub_controllers.push({
                name: 'bull_eye_area',
                controller: controller.renderPage()
            });
        },


        /**
         * initialize the Grepo Score
         */
        initializeGrepoScore: function() {
            var LayoutGrepoScoreController = require('controllers/layout/layout_grepo_score');

            var controller = new LayoutGrepoScoreController({
                el: this.$el.find('.nui_grepo_score'),
                models: {
                    grepo_score: this.getModel('grepo_score')
                },
                collections: {
                    grepo_score_hashes: this.collections.grepo_score_hashes
                },
                l10n: DM.getl10n('grepolis_score'),
                cm_context: this.getContext('layout_grepo_score')
            });

            this.sub_controllers.push({
                name: 'grepo_score',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Inventory Button
         */
        initializeInventoryButton: function() {
            var controller = new controllers.LayoutButtonInventoryController({
                el: this.$el.find('.inventory'),
                cm_context: this.getContext('inventory_button'),
                collections: {
                    inventory_items: this.collections.inventory_items
                },
                models: {
                    inventory: this.models.inventory
                }
            });

            this.sub_controllers.push({
                name: 'inventory_button',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Notepad Button
         */
        initializeNotepadButton: function() {
            var controller = new controllers.LayoutButtonNotepadController({
                el: this.$el.find('.notepad'),
                cm_context: this.getContext('notepad_button')
            });

            this.sub_controllers.push({
                name: 'notepad_button',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Premium Overview Button
         */
        initializePremiumButton: function() {
            var controller = new controllers.LayoutButtonPremiumController({
                el: this.$el.find('.premium'),
                models: {
                    premium_features: this.getModel('premium_features')
                },
                templates: {
                    premium_menu: this.templates.premium_button.premium_menu
                },
                l10n: this.l10n.premium_button.premium_menu,
                cm_context: this.getContext('premium_button')
            });

            this.sub_controllers.push({
                name: 'premium_button',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Heroes Overview which displays heroes
         */
        initializeHeroesOverview: function() {
            var controller = new controllers.LayoutHeroesOverviewController({
                el: this.$el.find('#ui_heroes_overview'),
                l10n: {
                    main: $.extend({}, DM.getl10n('heroes', 'layout_heroes_overview'), DM.getl10n('heroes', 'overview'))
                },
                templates: {
                    main: DM.getTemplate('heroes', 'player_heroes_overview')
                },
                collections: {
                    player_heroes: this.getCollection('player_heroes')
                },
                models: {
                    heroes: this.getModel('heroes'),
                    player_ledger: this.getModel('player_ledger')
                },
                cm_context: this.getContext('layout_heroes_overview')
            });

            this.sub_controllers.push({
                name: 'heroes_overview',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Advisors
         */
        initializeAdvisors: function() {
            var controller = new controllers.LayoutAdvisorsController({
                el: this.$el.find('.ui_advisors'),
                models: {
                    premium_features: this.getModel('premium_features')
                },
                cm_context: this.getContext('layout_advisors')
            });

            this.sub_controllers.push({
                name: 'advisors',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize additional Premium Features
         */
        initializePremiumFeatures: function() {
            var controller = new controllers.LayoutPremiumFeaturesController({
                models: {
                    premium_features: this.getModel('premium_features')
                },
                cm_context: this.getContext('layout_premium_features')
            });

            this.sub_controllers.push({
                name: 'premium_features_handler',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize main menu
         */
        initializeMainMenu: function() {
            var controller = new controllers.LayoutMainMenuController({
                el: this.$el.find('.nui_main_menu'),
                models: {
                    player_report_status: this.getModel('player_report_status'),
                    current_player: this.getModel('current_player')
                },
                templates: {
                    main_menu_item: this.templates.main_menu.item
                },
                l10n: this.l10n.main_menu,
                cm_context: this.getContext('layout_main_menu')
            });

            this.sub_controllers.push({
                name: 'main_menu',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize buttons over gods area
         */
        initializeConfigButtons: function() {
            var controller = new controllers.LayoutConfigButtonsController({
                el: this.$el.find('.gods_area_buttons'),
                models: {

                },
                l10n: this.l10n.config_buttons,
                cm_context: this.getContext('config_buttons_area')
            });

            this.sub_controllers.push({
                name: 'config_button',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize gods area
         */
        initializeGods: function() {
            var controller = new controllers.LayoutGodsController({
                el: this.$el.find('.gods_area'),
                models: {
                    player_gods: this.getModel('player_gods')
                },
                l10n: this.l10n.config_buttons,
                cm_context: this.getContext('layout_gods')
            });

            this.sub_controllers.push({
                name: 'gods',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize coins of war and wisdom count area
         */
        initializeCoins: function() {
            var controller = new controllers.LayoutCoinsController({
                el: this.$el.find('.nui_coins_container'),
                models: {
                    player_ledger: this.getModel('player_ledger')
                },
                l10n: this.l10n,
                cm_context: this.getContext('layout_coins')
            });

            this.sub_controllers.push({
                name: 'coins',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize Battlepoints area
         */
        initializeBattlepoints: function() {
            var controller = new controllers.LayoutBattlepointsController({
                el: this.$el.find('.nui_battlepoints_container'),
                models: {
                    player_killpoints: this.getModel('player_killpoints')
                },
                l10n: this.l10n,
                cm_context: this.getContext('layout_battlepoints')
            });

            this.sub_controllers.push({
                name: 'battlepoints',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize premium area
         */
        initializePremium: function() {
            var controller = new controllers.LayoutPremiumController({
                el: this.$el.find('.premium_area'),
                models: {
                    player_ledger: this.getModel('player_ledger')
                },
                cm_context: this.getContext('layout_premium')
            });

            this.sub_controllers.push({
                name: 'premium_area',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize units
         */
        initializeUnits: function() {
            var controller = new controllers.LayoutUnitsController({
                el: this.$el.find('.nui_units_box'),
                templates: {
                    unit: this.templates.units.unit
                },
                models: {
                    unit_time_to_arrival: this.getModel('unit_time_to_arrival'),
                    premium_features: this.getModel('premium_features')
                },
                collections: {
                    units: this.collections.units
                },
                l10n: this.l10n.units,
                cm_context: this.getContext('layout_units')
            });

            this.sub_controllers.push({
                name: 'units',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize units time area calculation
         */
        initializeUnitsTime: function() {
            var controller = new controllers.LayoutUnitsTimeController({
                el: this.$el.find('.nui_units_time_box'),
                l10n: this.l10n.units_time_to_arrival,
                models: {
                    unit_time_to_arrival: this.getModel('unit_time_to_arrival')
                },
                cm_context: this.getContext('layout_units_time')
            });

            this.sub_controllers.push({
                name: 'units_time',
                controller: controller.renderPage()
            });
        },

        /**
         * Initialize units time area calculation
         */
        initializeGodsSpells: function() {
            var controller = new controllers.LayoutGodsSpellsController({
                el: this.$el.find('.gods_area'),
                $parent: this.$el,
                collections: {
                    casted_powers: this.collections.casted_powers,
                    towns: this.getCollection('towns')
                },
                models: {
                    player_gods: this.getModel('player_gods')
                },
                templates: {
                    gods_powers: this.templates.powers_menu.gods_powers
                },
                l10n: this.l10n.powers_menu,
                cm_context: this.getContext('gods_spells'),
                strategies: {
                    cast_spell_own_town: CastSpellStrategyFactory.getCastSpellOwnTownStrategyInstance(this.models, this.collections)
                }
            });

            this.sub_controllers.push({
                name: 'gods_spells',
                controller: controller.renderPage()
            });
        },

        initializeInfoPage: function() {
            var controller = new controllers.LayoutInfopageController({
                collections: {
                    benefits: this.collections.benefits,
                    player_hints: this.collections.player_hints
                },
                cm_context: this.getContext('layout_info_page')
            });

            this.sub_controllers.push({
                name: 'infopage',
                controller: controller.renderPage()
            });
        },

        initializeExternalSurveyIcon: function() {
            var SurveyIconController = require('features/external_survey_icon/controllers/icon');

            var controller = new SurveyIconController({
                el: this.$el.find('.happening_large_icon_container'),
                collections: {
                    benefits: this.collections.benefits
                },
                cm_context: this.getContext('external_survey'),
                l10n: DM.getl10n('external_survey_icon')
            });


            this.sub_controllers.push({
                name: 'survey',
                controller: controller
            });
        },

        initializeHightlights: function() {
            var HighlightsController = require('features/ui_highlights/controllers/highlights');

            var controller = new HighlightsController({
                el: this.$el,
                models: {
                    highlight: this.getModel('highlight')
                },
                collections: {
                    highlights: this.getCollection('highlights')
                },
                cm_context: this.getContext('highlights')
            });

            this.sub_controllers.push({
                name: 'highlights',
                controller: controller
            });
        },

        initializeSkipTutorial: function() {
            var SkipTutorialController = require('features/skip_tutorial/controllers/skip_tutorial'),
                tutorial_quests_collection = this.getCollection('tutorial_quests'),
                hide_skip_tutorial = false;

            if (HelperGame.getQuestTutorialShowWelcomeWindow()) {
                hide_skip_tutorial = tutorial_quests_collection.getFinishedQuests() === 0;
            }

            var controller = new SkipTutorialController({
                el: this.$el.find('.skip_tutorial'),
                models: {
                    player: this.getModel('current_player').player_model,
                    player_settings: this.getModel('player_settings'),
                    grepo_score: this.getModel('grepo_score')
                },
                collections: {
                    player_heroes: this.getCollection('player_heroes'),
                    tutorial_quests: this.getCollection('tutorial_quests')
                },
                l10n: DM.getl10n('COMMON', 'skip_tutorial'),
                cm_context: this.getContext('skip_tutorial'),
                hidden: hide_skip_tutorial
            });

            this.sub_controllers.push({
                name: 'skip_tutorial',
                controller: controller
            });
        },

        onRadiobuttonStrategicMapClick: function() {
            this.destroyFullScreenCityOverview();
            this.setLayoutMode(LayoutModes.STRATEGIC_MAP);
        },

        onRadiobuttonIslandViewClick: function() {
            this.destroyFullScreenCityOverview();
            this.setLayoutMode(LayoutModes.ISLAND_VIEW);
        },

        onRadiobuttonCityOverviewClick: function() {
            var city_overview_controller = this.getController('city_overview');

            if (!city_overview_controller) {
                this.initializeCityOverview();

                if (HelperGame.constructFromCityOverview()) {
                    this.initializeConstructionQueue(); //this one also initializes construction_queue_container
                }

                this.initializeCityConstructionOverlay();
                this.initializeEnvironmentAnimations();
            }

            this.setLayoutMode(LayoutModes.CITY_OVERVIEW);
        },

        destroyFullScreenCityOverview: function() {
            this.deinitializeController('city_overview');
            this.deinitializeController('city_construction_overlay');
            this.deinitializeController('construction_queue_container');
        },

        onCityOverviewInitialized: function() {
            $('#ui_box').addClass('city-overview-enabled');
        },

        onCityOverviewDestroyed: function() {
            $('#ui_box').removeClass('city-overview-enabled');
        },

        setLayoutMode: function(mode) {
            Game.layout_mode = mode;
        },

        destroy: function() {
            var controllers = this.sub_controllers,
                i, l = controllers.length;

            //Destroy all controllers
            for (i = 0; i < l; i++) {
                controllers[i]._destroy();
            }
        }
    });
}(window.GameControllers));