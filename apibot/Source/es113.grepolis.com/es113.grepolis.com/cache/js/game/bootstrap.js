/*global Logger, Happening, Tracking, jQuery, setupLinkHandleriOs, TimersManager, DataManager, ComponentsManager, WindowsManager, GPGameLoader, GPLayout, debug,
SoundController, NotificationLoader, GameDataQuests, GPAjax, HistoryTownSwitcher, onGameLoaderFinished,
DM, MM, TownsData, SpecialOfferWindowFactory, Backbone, WQM, ConquestWindowFactory, GameModels, HelperHalloween, HelperHercules2014, us,
GameEvents, GPWindowMgr, GPLocalStore, GameData, GlobalListenersManager, gpAjax, HelperEaster, Raven */
/*jshint unused:false */

var TempBarData = null, //Temporary storage for layout bar data between layout and loader
    LocalStore = null,
    Award,
    Game = Game || {}, // Game definition object
    Layout = Layout || {},
    GameLoader = GameLoader || null;

(function($, window, Game) {
    'use strict';

    var priorities = require('game/windows/priorities');
    var Features = require('data/features');
    var CommandsHelper = require('helpers/commands');
    var ErrorHandlerHelper = require('helpers/error_handler');
    var IosLinkHandler = require('mobile/ios');
    var MobileMessages = require('mobile/messages');
    var UIScale = require('mobile/uiscale');

    var options, module;

    Game.isSmallScreen = window.isSmallScreen;
    Game.isiOs = window.isiOs;
    Game.isIeTouch = window.isIeTouch;
    Game.isMsApp = window.isMsApp;
    // MsApp is always touch, even if it doesn't show up as touch. -> if not touch -> check if msapp -> set touch to msapp
    Game.isIeTouch = Game.isIeTouch() ? Game.isIeTouch : Game.isMsApp;
    Game.isHybridApp = function() {
        return Game.is_hybrid_app;
    };
    Game.isMobileBrowser = function() {
        return Game.isHybridApp() || Game.isiOs();
    };

    function addGameDefinitions() {
        Game.img = function(want_static) {
            return want_static === false ? Game.urlImg_null_false : Game.urlImg;
        };

        Game.invitation_path = {}; // here will be stored the path, player used to invite another player (map->email->choose->name)
    }

    function setupMobileApp() {
        if (Game.isiOs()) {
            IosLinkHandler.setupLinkHandleriOs();
        }

        if (Game.isHybridApp()) {
            MobileMessages.addEventListeners();
        }
    }

    function setupManagers(models, collections) {
        /**
         * TIMERS MANAGER
         */
        window.TM = new TimersManager();

        /**
         * Concrete object for access of towns
         */


        if (options.hasOwnProperty('on_data_manager_load_data') && typeof options.on_data_manager_load_data === 'function') {
            try {
                options.on_data_manager_load_data();
            } catch (e) {
                Raven.captureException(e);
            }
        }

        /**
         * COMPONENTS MANAGER
         */
        window.CM = new ComponentsManager();

        /**
         * WINDOW MANAGER
         */
        window.WM = new WindowsManager();

        GPWindowMgr.setModelsAndCollections(models, collections);
    }

    function setupLocalStore() {
        // Global 'Local Store'
        window.LocalStore = new GPLocalStore(Game.player_id, Game.player_settings.use_localstore);
    }

    function setupLayout(models, collections) {
        var Layout = new GPLayout({
                wndMaxConcurrent: Game.player_settings.windowmgr_max_concurrent,
                onInit: null
            }),
            onFinishedLoadedCallback;

        Layout.favor = Game.favors;
        Layout.player_hint_settings = Game.player_hint_settings;
        Layout.show_confirmation_popup = Game.player_settings.show_confirmation_popups;

        // load the Audio after we have populated all existing BB collections
        onFinishedLoadedCallback = function() {
            Game.Audio = new window.GameControllers.SoundController(Game.audio_settings);

            $.Observer(GameEvents.sound.init).publish({});

            delete Game.audio_settings;

            // play Attack sound, if we are under attack
            var incoming_attack_count = CommandsHelper.getTotalCountOfIncomingAttacks();
            if (incoming_attack_count > 0) {
                $.Observer(GameEvents.attack.incoming).publish({
                    count: incoming_attack_count
                });
            }

            //show conquest window if the initial town is being conquered
            var initial_town = collections.towns.getCurrentTown();
            initializeTownEvents(initial_town);

            /*
             * initialize Event Icon
             */
            var LargeIcon = require('features/benefits/large_icon');
            (new LargeIcon()).initLargeIcon();
        };

        window.GameLoader.addFinishLoadedHook(onFinishedLoadedCallback);

        // initialize tutorial quest related views
        Layout.initProgressableViews(collections.tutorial_quests, collections.island_quests, DM.getl10n('questlog_icon'));
        Layout.initDailyLoginIcon(models.daily_login, DM.getl10n('daily_login'));

        Layout.initActivitiesIcon(DM.getl10n('activities'));

        window.Layout = Layout;
    }

    function setupUIScale() {
        UIScale.scaleUI();
        UIScale.addEventListeners();
    }

    function initializeTownEvents(initial_town) {
        var event_handler = us.extend({}, Backbone.Events);

        if (initial_town && initial_town.hasConqueror()) {
            WQM.addNotQueuedWindow({
                type: GPWindowMgr.TYPE_CONQUEST,
                priority: priorities.getPriority(GPWindowMgr.TYPE_CONQUEST),
                open_function: function() {
                    return ConquestWindowFactory.openConquestWindow();
                }
            });
        }

        initial_town.onHasConquerorChange(event_handler, function() {
            if (initial_town.hasConqueror()) {
                WQM.addNotQueuedWindow({
                    type: GPWindowMgr.TYPE_CONQUEST,
                    priority: priorities.getPriority(GPWindowMgr.TYPE_CONQUEST),
                    open_function: function() {
                        return ConquestWindowFactory.openConquestWindow();
                    }
                });
            } else {
                ConquestWindowFactory.closeConquestWindow();
            }
        });

        initial_town.onAllResourcesFull(event_handler, function() {
            $.Observer(GameEvents.town.resources.limit_reached_all).publish({});
        });
    }

    function createModels() {
        // must be defined and created before game loader finished
        var models = {
            heroes: MM.checkAndPublishRawModel('Heroes', {
                id: Game.player_id,
                persistent: true
            }),
            premium_features: MM.checkAndPublishRawModel('PremiumFeatures', {
                id: Game.player_id,
                persistent: true
            }),
            player_settings: MM.checkAndPublishRawModel('PlayerSettings', {
                id: Game.player_id,
                persistent: true
            }),
            player_ledger: MM.checkAndPublishRawModel('PlayerLedger', {
                id: Game.player_id,
                persistent: true
            }),
            player_report_status: MM.checkAndPublishRawModel('PlayerReportStatus', {
                id: Game.player_id,
                persistent: true
            }),
            player_gods: MM.checkAndPublishRawModel('PlayerGods', {
                id: Game.player_id,
                persistent: true
            }),
            quickbar: MM.checkAndPublishRawModel('Quickbar', {
                id: Game.player_id,
                persistent: true
            }),
            phoenician_salesman: MM.checkAndPublishRawModel('PhoenicianSalesman', {
                id: Game.player_id,
                persistent: true
            }),
            current_player: new window.GameModels.CurrentPlayer({
                player_model: MM.checkAndPublishRawModel('Player', {
                    id: Game.player_id,
                    persistent: true
                }),
                player_ranking_model: MM.checkAndPublishRawModel('PlayerRanking', {
                    id: Game.player_id,
                    persistent: true
                })
            }),
            unit_time_to_arrival: new GameModels.UnitTimeToArrival(),
            payment_config: MM.checkAndPublishRawModel('PaymentConfig', {
                id: Game.player_id,
                persistent: true
            }),
            instant_buy_data: MM.checkAndPublishRawModel('InstantBuyData', {
                id: Game.player_id,
                persistent: true
            }),
            inventory: MM.checkAndPublishRawModel('Inventory', {
                id: Game.player_id,
                persistent: true
            }),
            map_chunks: MM.checkAndPublishRawModel('MapChunks', {
                id: Game.player_id,
                persistent: true
            }),
            mermaid: MM.checkAndPublishRawModel('Mermaid', {
                id: Game.player_id,
                persistent: true
            }),
            maintenance: MM.checkAndPublishRawModel('Maintenance', {
                id: 1,
                persistent: true
            }),
            player_killpoints: MM.checkAndPublishRawModel('PlayerKillpoints', {
                id: Game.player_id,
                persistent: true
            }),
            daily_login: MM.checkAndPublishRawModel('DailyLoginBonus', {
                id: Game.player_id,
                persistent: true
            }),
            grepo_score: MM.checkAndPublishRawModel('GrepoScore', {
                id: Game.player_id,
                persistent: true
            }),
            player_attack_spot: MM.checkAndPublishRawModel('PlayerAttackSpot', {
                id: Game.player_id,
                persistent: true
            }),
            mission_status: MM.checkAndPublishRawModel('MissionStatus', {
                id: Game.player_id,
                persistent: true
            }),
            mission_report: MM.checkAndPublishRawModel('MissionReport', {
                id: Game.player_id,
                persistent: true
            }),
            town_id_list: MM.checkAndPublishRawModel('TownIdList', {
                id: Game.player_id,
                persistent: true
            })
        };

        if (Features.isCasualWorld()) {
            models.casual_worlds_blessed_town = MM.checkAndPublishRawModel('CasualWorldsBlessedTown', {
                id: Game.player_id,
                persistent: true
            });
        }

        if (Features.isOlympusEndgameActive()) {
            models.olympus = MM.checkAndPublishRawModel('Olympus', {
                id: 1,
                persistent: true
            });
        }

        return models;
    }

    /**
     * create TownAgnosticCollections - after they are created and registered there will
     * be additionally a "fragment" collection - representing the values for the current
     * town be created
     *
     * @returns {Object} collections
     */
    function createTownAgnosticCollections() {
        return {
            trades: new window.TownAgnosticCollection(
                [], {
                    segmentation_keys: ['destination_town_id', 'origin_town_id'],
                    model_class: 'Trade',
                    fragment_constructor: window.GameCollections.Trades
                }
            ),
            unit_orders: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'UnitOrder',
                    fragment_constructor: window.GameCollections.RemainingUnitOrders
                }
            ),
            casted_powers: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'CastedPowers',
                    fragment_constructor: window.GameCollections.CastedPowers
                }
            ),
            units: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'current_town_id',
                    model_class: 'Units',
                    fragment_constructor: window.GameCollections.Units
                }
            ),
            supporting_units: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'home_town_id',
                    model_class: 'Units',
                    fragment_constructor: window.GameCollections.ActivePlayerSupportsTowns
                }
            ),
            building_orders: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'BuildingOrder',
                    fragment_constructor: window.GameCollections.BuildingOrders
                }
            ),
            research_orders: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'ResearchOrder',
                    fragment_constructor: window.GameCollections.ResearchOrders
                }
            ),
            town_buildings: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'Buildings',
                    fragment_constructor: window.GameCollections.TownBuildings
                }
            ),
            town_researches: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'Researches',
                    fragment_constructor: window.GameCollections.TownResearches
                }
            ),
            celebrations: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'town_id',
                    model_class: 'Celebration',
                    fragment_constructor: window.GameCollections.Celebrations
                }
            ),
            movements_spys: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'home_town_id',
                    model_class: 'MovementsSpy',
                    fragment_constructor: window.GameCollections.MovementsSpys
                }
            ),
            movements_units: new window.TownAgnosticCollection(
                [], {
                    segmentation_keys: ['home_town_id', 'target_town_id'],
                    model_class: 'MovementsUnits',
                    fragment_constructor: window.GameCollections.MovementsUnits
                }
            ),
            movements_revolts_defender: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'home_town_id',
                    model_class: 'MovementsRevoltDefender',
                    fragment_constructor: window.GameCollections.MovementsRevoltsDefender
                }
            ),
            movements_conquerors: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'home_town_id',
                    model_class: 'MovementsConqueror',
                    fragment_constructor: window.GameCollections.MovementsConquerors
                }
            ),
            movements_colonizations: new window.TownAgnosticCollection(
                [], {
                    segmentation_key: 'home_town_id',
                    model_class: 'MovementsColonization',
                    fragment_constructor: window.GameCollections.MovementsColonizations
                }
            )
        };
    }
    /**
     * create and return collections
     * 'some' are automatically added to ModelManager, if needed for compatibility -> see setupGameLoader function
     *
     * @returns {Object} collections
     */
    function createCollections() {
        var collections = {
            farm_town_player_relations: new window.GameCollections.FarmTownPlayerRelations(),
            farm_towns: new window.GameCollections.FarmTowns(),
            player_heroes: new window.GameCollections.PlayerHeroes(),
            player_map_favorites: new window.GameCollections.PlayerMapFavorites(),
            town_groups: new window.GameCollections.TownGroups(),
            town_group_towns: new window.GameCollections.TownGroupTowns(),
            towns: new window.GameCollections.Towns(),
            building_build_datas: new window.GameCollections.BuildingBuildDatas(),
            militias: new window.GameCollections.Militias(),
            island_quests: new window.GameCollections.IslandQuests(),
            benefits: new window.GameCollections.Benefits(),
            player_hints: new window.GameCollections.PlayerHints(),
            crm_campaigns: new window.GameCollections.CrmCampaigns(),
            crm_icons: new window.GameCollections.CrmIcons(),
            tutorial_quests: new window.GameCollections.Quests(),
            feature_blocks: new window.GameCollections.FeatureBlocks(),
            inventory_items: new window.GameCollections.InventoryItems(),
            finished_wonders: new window.GameCollections.FinishedWonders([], {
                alliance_id: Game.alliance_id
            }),
            alliance_pacts: new window.GameCollections.AlliancePacts(),
            runtimes: new window.GameCollections.Runtimes(),
            map_extra_infos: new window.GameCollections.MapExtraInfos(),
            custom_colors: new window.GameCollections.CustomColors(),
            player_awards: new window.GameCollections.PlayerAwards(),
            takeovers: new window.GameCollections.Takeovers(),
            attacks: new window.GameCollections.Attacks(),
            supports: new window.GameCollections.Supports(),
            bundles_and_packages_player_levels: new window.GameCollections.BundlesAndPackagesPlayerLevels(),
            grepo_score_hashes: new window.GameCollections.GrepoScoreCategoryHashs(),
            island_quest_player_relations: new window.GameCollections.IslandQuestPlayerRelations(),
            highlights: new window.GameCollections.Highlights(),
            collected_items: new window.GameCollections.CollectedItems(),
            movements_revolts_attacker: new window.GameCollections.MovementsRevoltsAttacker(),
            capped_powers_progresses: new window.GameCollections.CappedPowersProgresses(),
            casted_alliance_powers: new window.GameCollections.CastedAlliancePowers(),
            player_artifacts: new window.GameCollections.PlayerArtifacts(),
            player_city_skins: new window.GameCollections.PlayerCitySkins(),
            player_tasks: new window.GameCollections.PlayerTasks(),
            world_boosts: new window.GameCollections.WorldBoosts()
        };

        if (Features.isOlympusEndgameActive()) {
            collections.temples = new window.GameCollections.Temples();
            collections.temple_commands = new window.GameCollections.TempleCommands();
        }

        return collections;
    }

    function setupGameLoader(models, collections) {
        // Global Layout Object
        var gameloader_params = {
                data_dates: window.data_dates
            },
            game_loader,
            Quickbar = window.Quickbar;

        gameloader_params.models = {
            unit_time_to_arrival: models.unit_time_to_arrival
        };

        game_loader = new GPGameLoader(gameloader_params);

        if (options.hasOwnProperty('game_loader_finishd_hook') && typeof options.game_loader_finishd_hook === 'function') {
            game_loader.addFinishLoadedHook(onGameLoaderFinished.bind(null, models, collections));
            game_loader.addFinishLoadedHook(NotificationLoader.setGameInitialized.bind(NotificationLoader));
            game_loader.addFinishLoadedHook(options.game_loader_finishd_hook);
            game_loader.addFinishLoadedHook(function(models, collections) {
                //I've put this manager here because it needs access to properly created models and collections, later we should try to move rest of the managers as well

                /**
                 * GLOBAL EVENT LISTENERS MANAGER
                 */
                window.GIM = new GlobalListenersManager(models, collections);
            }.bind(null, models, collections));


            game_loader.addFinishLoadedHook(function() {
                //Initialize new UI
                var layout_main_controller = new window.GameControllers.LayoutMainController({
                    el: $('#ui_box'),
                    cm_context: {
                        main: 'new_ui',
                        sub: 'layout_main_controller'
                    }
                });

                layout_main_controller.renderPage({
                    models: models,
                    collections: collections,

                    templates: {
                        premium_button: {
                            premium_menu: DM.getTemplate('premium', 'top_menu')
                        },
                        main_menu: {
                            item: DM.getTemplate('main_menu', 'item')
                        },
                        units: {
                            unit: DM.getTemplate('units', 'unit')
                        },

                        toolbar_activities: DM.getTemplate('COMMON', 'toolbar_activities'),

                        town_name_area: {
                            town_groups_list: DM.getTemplate('COMMON', 'town_groups_list'),
                            casted_powers: DM.getTemplate('COMMON', 'casted_powers'),
                            casted_power_tooltip: DM.getTemplate('COMMON', 'casted_power_tooltip'),
                            culture_overview: DM.getTemplate('COMMON', 'culture_overview')
                        },

                        quickbar: {
                            main: DM.getTemplate('COMMON', 'quickbar_main'),
                            options: DM.getTemplate('COMMON', 'quickbar_options')
                        },

                        resources_bar: {
                            main: DM.getTemplate('COMMON', 'resources_bar_main')
                        },

                        powers_menu: {
                            gods_powers: DM.getTemplate('powers_menu', 'gods_powers')
                        },

                        city_overview: DM.getTemplate('COMMON', 'city_overview', 'main'),

                        construction_queue: DM.getTemplate('COMMON', 'construction_queue'),

                        city_construction_overlay: DM.getTemplate('COMMON', 'city_construction_overlay')
                    }
                });

                window.layout_main_controller = layout_main_controller;
            });
            game_loader.addFinishLoadedHook(function() {
                Quickbar.initialize({
                    quickbar: models.quickbar
                });
            });
            game_loader.addFinishLoadedHook(function() {
                Layout.questProgress.init(collections.tutorial_quests, true);
            });
            game_loader.addFinishLoadedHook(function() {
                Layout.initEffectsIcon(collections.benefits, DM.getl10n('effects_icon'));
            });
        } else {
            debug('empty block'); //TODO throw error
        }

        window.GameLoader = game_loader;
    }

    function initializeEvents(models, collections) {
        if (typeof HelperEaster !== 'undefined') {
            HelperEaster.registerEvent(models, collections);
        }

        if (typeof HelperHercules2014 !== 'undefined') {
            HelperHercules2014.registerEvent(models, collections);
        }
    }

    function estimateStartupTime() {
        var log_startup_time = !!$.cookie('login_startup_time');

        gpAjax.ajaxPost('debug', 'log_startup_time', {
            log_startup_time: log_startup_time
        }, false, function(data) {
            if (data.t && data.t > 0) {
                debug('Startup time: ' + data.t);
            }
        });
    }

    function sendDataToHybridApp(data) {
        window.top.postMessage({
            message: 'gameloader_finished',
            data: {
                products: data,
                market_id: Game.market_id,
                world_id: Game.world_id,
                player_id: Game.player_id,
                appstore: Game.appstore_url,
                playstore: Game.playstore_url,
                is_muted: Game.Audio.isMuted()
            }
        }, '*');
    }

    function onGameLoaderFinished(models, collections) {
        initializeEvents(models, collections);
        estimateStartupTime();
        if (Game.isHybridApp()) {
            gpAjax.ajaxPost(
                'mobile_shop_products',
                'getProductList', {
                    'platform': Game.isiOs() ? 'apple' : 'google'
                },
                false,
                sendDataToHybridApp
            );
        }
    }

    function onDocumentReady() {
        var models = createModels(),
            town_agnostic_collections = createTownAgnosticCollections(),
            fragments = convertTownAgnosticCollectionsToFragmentCollections(town_agnostic_collections),
            collections = createCollections();

        setupJQueryTransitForOlderBrowsers();
        setupCssPointerEventsPolyfill();
        setupLocalStore();
        setupUIScale();

        //give town_agnostic_collections (and the normal collections) to itowns to make town switching happen
        var itowns_collections = {};
        us.extend(itowns_collections, collections);
        us.extend(itowns_collections, town_agnostic_collections);
        window.ITowns = new TownsData(models, itowns_collections);

        // register stuff with the ModelManager MM
        us.each(town_agnostic_collections, MM.addTownAgnosticCollection, MM);
        us.each(collections, MM.addCollection, MM);
        us.each(fragments, MM.addCollection, MM);

        // everything beyond this point expects a complete set of collections which
        // consists of "normal" collections + fragments

        // mix fragments with normal collections
        us.extend(collections, fragments);

        setupManagers(models, collections);
        setupGameLoader(models, collections);
        setupLayout(models, collections);

        // error prevention (probably an update running)
        if (options && options.hasOwnProperty('on_document_ready') && typeof options.on_document_ready === 'function') {
            try {
                options.on_document_ready();
            } catch (e) {
                Raven.captureException(e);
            }
        }
    }

    function handleGlobalJsErrors(e) {
        if (e.target && e.target.tagName === 'IMG' && e.target.crossOrigin === "anonymous") {
            ErrorHandlerHelper.handleImageCorsError(e);
        }
    }

    /**
     * Loop over given collections and replace all TownAgnosticCollection with its current Fragement
     */
    function convertTownAgnosticCollectionsToFragmentCollections(collections) {
        var result = {};
        us.each(collections, function(collection, collection_name) {
            if (collection instanceof window.TownAgnosticCollection) {
                result[collection_name] = collection.getCurrentFragment();
            }
        });

        return result;
    }

    function setupJQueryTransitForOlderBrowsers() {
        if (!$.support.transition) {
            $.fn.transition = $.fn.animate;
        }
    }

    function setupCssPointerEventsPolyfill() {
        window.pointerEventsPolyfill({
            listenOn: ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove']
        });
    }

    module = {
        run: function(opt) {
            options = opt || {};
            addGameDefinitions();
            setupMobileApp();

            Logger.init();

            $(document).ready(onDocumentReady);
            document.body.addEventListener('error', handleGlobalJsErrors, true);
        }
    };

    window.Bootstrap = module;
}(jQuery, window, Game));