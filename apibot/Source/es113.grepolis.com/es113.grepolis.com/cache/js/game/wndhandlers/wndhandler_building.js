/* global Game, GameData, GameEvents, Layout, CM, ITowns, HumanMessage, UnitOrder, FightSimulator,
BuildingWindowFactory, BuildingMain, BuildingPlace, MM, BuildingFarm, WndHandlerDefault, DM, GPWindowMgr, PopupFactory,
BuyForGoldWindowFactory, PremiumWindowFactory, GameControllers, ReportViewer, Backbone, GameDataPremium,
GeneralModifications */

(function() {
    'use strict';

    var Powers = require('enums/powers'),
        SimulatorConfigurationController = require('features/simulator/controllers/configuration');

    function WndHandlerBuilding(wndhandle) {
        this.wnd = wndhandle;
        this.currentBuilding = '';
        this.onclose_hook = null;
        this.current_tab = null;
        this.switch_town_callback = null;

        /**
         * Sets window to top if there are no quests running.
         */
        this.setToTop = function() {
            this.wnd.toTop();
        };

        /**
         *
         */
        this.registerEventListeners = function() {
            var that = this,
                name = 'WndHandlerBuilding',
                callback,
                data_features = require('data/features');

            switch (this.currentBuilding) {
                case 'barracks':
                    this.initializeBuyForGoldAdvisor('commander');
                    //FALLTHROUGH
                case 'docks':
                    // the case above has no break. both the barracks and the docks do essentially the same. be careful
                    //
                    // Inject the window_id into the DOM to have it accessible for 'subviews' to avoid w()
                    this.wnd.getJQElement().find('#unit_order').data('wnd_id', this.wnd.getIdentifier());
                    var reloadBuildingWithUnitOrders = function() {
                        var current_town = ITowns.getCurrentTown(),
                            buildings = current_town.buildings();

                        if (buildings.getBuildingLevel(that.currentBuilding) !== 0) {
                            UnitOrder.saveState();
                            that.reloadBuildingWithUnitOrders(that.currentBuilding);
                        }
                    };

                    $.Observer(GameEvents.town.town_switch).subscribe([name], UnitOrder.clearState);
                    $.Observer(GameEvents.town.units.change).subscribe([name], UnitOrder.handleEvents.bind(UnitOrder));
                    $.Observer(GameEvents.town.units.change).subscribe([name], reloadBuildingWithUnitOrders);
                    $.Observer(GameEvents.unit.order.change).subscribe([name], reloadBuildingWithUnitOrders);
                    $.Observer(GameEvents.town.power.added).subscribe([name], reloadBuildingWithUnitOrders);
                    $.Observer(GameEvents.town.power.removed).subscribe([name], reloadBuildingWithUnitOrders);
                    $.Observer(GameEvents.town.units.barracks.order.done).subscribe([name], reloadBuildingWithUnitOrders);
                    $.Observer(GameEvents.town.units.docks.order.done).subscribe([name], reloadBuildingWithUnitOrders);
                    $.Observer(GameEvents.town.building.order.done).subscribe([name], reloadBuildingWithUnitOrders);

                    break;

                case 'main':
                    //I think this case is deprecated, but I'm leaving it for
                    //now because this code is shared between too many windows
                    callback = function() {
                        BuildingWindowFactory.refreshIfOpened();
                    };

                    BuildingMain.tear_down_menu = BuildingMain.tear_down_menu || false;

                    window.ITowns.all_buildings.off('change', null, this);
                    window.ITowns.all_buildings.on('change', callback, this);

                    MM.getCollections().Town[0].getCurrentTown().onAnyBuildingLvlChange(this, callback);

                    $.Observer(GameEvents.town.building.order.done).subscribe([name], callback);
                    $.Observer(GameEvents.town.building.order.start).subscribe([name], callback);
                    $.Observer(GameEvents.town.power.added).subscribe([name], callback);

                    $.Observer(GameEvents.town.resources.update).subscribe([name], BuildingMain.handleEvents);

                    if (data_features.areHeroesEnabled()) {
                        MM.getCollections().PlayerHero[0].off('change:assignment_type change:home_town_id change:town_arrival_at change:cured_at change:level', callback, 'wndhandler_building_main');
                        MM.getCollections().PlayerHero[0].on('change:assignment_type change:town_arrival_at change:home_town_id change:cured_at change:level', callback, 'wndhandler_building_main');
                    }

                    break;

                case 'place':
                    $.Observer(GameEvents.town.units.change).subscribe([name], function() {
                        BuildingPlace.handleEvents(that.current_tab);
                    });
                    $.Observer(GameEvents.town.resources.update).subscribe([name], function() {
                        BuildingPlace.handleEvents(that.current_tab);
                    });
                    $.Observer(GameEvents.town.power.added).subscribe([name], function(e, data) {
                        if (data.power.getPowerId() === Powers.CHARITABLE_FESTIVAL) {
                            BuildingWindowFactory.refreshIfOpened();
                        }
                    });
                    $.Observer(GameEvents.town.power.removed).subscribe([name], function(e, data) {
                        if (data.power.getPowerId() === Powers.CHARITABLE_FESTIVAL) {
                            BuildingWindowFactory.refreshIfOpened();
                        }
                    });
                    break;

                case 'temple':
                    $.Observer(GameEvents.god.choose).subscribe([name], function() {
                        that.refresh();
                    });

                    this.initializeBuyForGoldAdvisor('priest');
                    break;
                case 'lumber':
                case 'stoner':
                case 'ironer':
                    this.initializeBuyForGoldAdvisor('trader');
                    break;
                default:
                    break;
            }

            return this;
        };

        /**
         *
         */
        this.unregisterEventListeners = function(closing_window) {
            var data_features = require('data/features');

            var celebration_collection = MM.getCollections().Celebration[0];
            if (celebration_collection) {
                celebration_collection.off(null, null, 'wndhandler_building_main');
            }
            $.Observer().unsubscribe(['WndHandlerBuilding']);

            //clear interval from building_farm if available
            if (BuildingFarm.timer) {
                window.clearInterval(BuildingFarm.timer);
                BuildingFarm.timer = null;
            }

            if (this.currentBuilding === 'barracks' || this.currentBuilding === 'docks') {
                if (closing_window) {
                    UnitOrder.clearState();
                } else {
                    UnitOrder.saveState();
                }
            }

            if (data_features.areHeroesEnabled() && this.currentBuilding === 'main') {
                MM.getCollections().PlayerHero[0].off(null, null, 'wndhandler_building_main');
            }

            this.stopListening();

            return this;
        };

        /**
         * refreshes the window.
         */
        this.refresh = function() {
            var data = {
                town_id: Game.townId
            };

            var action, building;
            this.unregisterEventListeners();

            action = this.current_tab || 'index';
            building = GameData.buildings[this.currentBuilding];

            if (!building) {
                this.wnd.close();
                return;
            }
            this.wnd.clearMenuNow();

            //Its a code for workaround to keep units in Simulator window when town is switched.
            if (action === 'simulator') {
                data.units = FightSimulator.saved_player_units;
                data.attacker_god_id = FightSimulator.saved_player_gods.attacker_god_id;
                data.defender_god_id = FightSimulator.saved_player_gods.defender_god_id;
                //Post method is needed because of the amount of data which is being sent
                this.wnd.requestContentPost(building.controller, action, data);
            } else {
                this.wnd.requestContentGet(building.controller, action, data);
            }

            //this.setToTop();
            this.wnd.setTitle(building.name + ' (' + Game.townName + ')');
            this.registerEventListeners();
        };
    }

    WndHandlerBuilding.inherits(WndHandlerDefault);

    WndHandlerBuilding.prototype.initializeBuyForGoldAdvisor = function(advisor_id) {

        //
        //Be aware that this function is also called from farm window handler  !!!
        //

        //Overwritting context usually is not necessary but in this case it conflicts with 'progressbar' from building_temple.js
        //(CM.unregisterSubGroup() below unregisters it, so it stops ticking)
        //When someone will refactor it, please keep that in mind
        var cm_context = $.extend({}, this.wnd.getContext()),
            $root = this.wnd.getJQElement();

        cm_context.sub = 'buy_for_gold_advisor';

        CM.unregisterSubGroup(cm_context);
        CM.register(cm_context, 'btn_buy_' + advisor_id, $root.find('.btn_buy_' + advisor_id).button({
            caption: _('Activate'),
            icon: true,
            icon_type: 'gold',
            tooltips: [{
                title: PopupFactory.texts[advisor_id + '_hint']
            }]
        }).on('btn:click', function(e, _btn) {
            BuyForGoldWindowFactory.openBuyAdvisorWindow(_btn, advisor_id, function() {
                GameDataPremium.getPremiumFeaturesModel().extend(advisor_id, false);
            });
        }));

        CM.register(cm_context, 'btn_show_' + advisor_id + '_advantages', $root.find('.btn_show_' + advisor_id + '_advantages').button({
            template: 'empty'
        }).on('btn:click', function(e, _btn) {
            PremiumWindowFactory.openAdvantagesTab(advisor_id);
        }));
    };

    WndHandlerBuilding.prototype.getDefaultWindowOptions = function() {
        // JQuery UI Dialog Optiosn Object.
        var ret = {
            maxHeight: 900,
            maxWidth: 1200,
            height: 570,
            width: 820,
            resizable: true,
            minimizable: true,
            yOverflowHidden: true
        };

        return ret;
    };

    WndHandlerBuilding.prototype.onInit = function(title, UIopts, building, action, params) {
        if (!building) {
            throw 'No building type specified.';
        }
        action = action || 'index';
        var controller = GameData.buildings[building].controller;

        this.wnd.requestContentGet(controller, action, params || {});

        if (building === 'docks' || building === 'barracks') {
            UnitOrder.clearState(); // remove localstorage selection
        }

        if (building === 'main') {
            BuildingMain.setDefaults();
        }

        return true;
    };

    WndHandlerBuilding.prototype.onBeforeReloadContent = function() {
        this.unregisterEventListeners();
    };

    WndHandlerBuilding.prototype.onReloadContentError = function() {
        this.registerEventListeners();
    };

    /**
     * Window Close Button Action
     * @return Boolean
     **/
    WndHandlerBuilding.prototype.onClose = function() {
        if (this.onclose_hook) {
            if (!this.onclose_hook()) {
                HumanMessage.error(_("This window can't be closed."));
                return false;
            }
        }

        this.unregisterEventListeners(true);

        //Its a code for workaround to keep units in Simulator window when town is switched.
        if (FightSimulator) {
            FightSimulator.saved_player_units = {};
        }

        return true;
    };

    WndHandlerBuilding.prototype.onFocus = function() {};

    /**
     * @param data
     * @param controller String
     * @param action String
     * @param params Object
     */
    WndHandlerBuilding.prototype.onRcvData = function(data, controller, action, params) {
        var newBuilding = controller.replace(/building_/, ''),
            is_frontend_bridge_call = controller === 'frontend_bridge' && action === 'fetch',
            window_type = params.window_type || false,
            tab_type = params.tab_type || false,
            args = params.arguments || {};

        var root = this.wnd.getJQElement();

        if (is_frontend_bridge_call) {
            newBuilding = window_type;
        }

        if (controller === 'building_main' && Layout.new_construction_queue) {
            Layout.new_construction_queue._destroy();
            Layout.new_construction_queue = null;
        }

        if ((controller === 'building_barracks' || controller === 'building_docks') && Layout.new_units_queue) {
            Layout.new_units_queue._destroy();
            Layout.units_queue = null;
        }

        if (newBuilding !== this.currentBuilding) {
            this.wnd.setTitle(GameData.buildings[newBuilding].name + ' (' + Game.townName + ')');
            this.currentBuilding = newBuilding;
            this.current_tab = null;
            this.switch_town_callback = null;
        }

        if (action && (controller === 'building_main' || controller === 'building_place')) {
            this.current_tab = action;
        }

        if (this.currentBuilding === 'place') {
            BuildingPlace.wnd_handle = this.wnd;
            if (data.building_place_tmpl) {
                GameData.add({
                    BuildingPlaceTemplate: data.building_place_tmpl
                });
                BuildingPlace.index_data = data.data;
                BuildingPlace.renderIndex(this.wnd);

                return;
            }
        }

        if (controller === 'building_place' && action === 'blessing') {
            var models = this.wnd.getModels();
            var collections = this.wnd.getCollections();

            if (this.tab_controller) {
                this.tab_controller._destroy();
            }

            var CasualWorldsBlessedTown = require('features/casual_worlds_blessed_town/controllers/casual_worlds_blessed_town');

            this.tab_controller = new CasualWorldsBlessedTown({
                el: this.wnd.getJQElement().find('.gpwindow_content'),
                cm_context: this.wnd.getContext(),
                models: {
                    casual_worlds_blessed_town: models.casual_worlds_blessed_town
                },
                collections: {
                    towns: collections.towns
                }
            });

            return;
        } else {
            this.wnd.setContent2(data.html);
        }

        if (this.currentBuilding === 'place') {
            this.wnd.setHeight(546);

            if (this.current_tab === 'simulator') {
                this.registerFightSimulatorHeroComponents();
                this.registerFightSimulatorConfiguration(data.categories, data.power_configurations);
            } else {
                this.registerBuildingPlaceComponents();
            }
        } else {
            this.wnd.setHeight(this.getDefaultWindowOptions().height);
        }

        if (this.currentBuilding === 'barracks' || this.currentBuilding === 'docks') {
            UnitOrder.loadState();
            this.registerBuildingUnitsComponents();
        }

        if (this.currentBuilding === 'wall') {
            // Add unit card tooltips with full amount
            $('.wall_report_unit').each(
                function(key, element) {
                    $(element).setPopup(
                        $(element).data('type') + '_details',
                        $(element).data('unit_count')
                    );
                }
            );
        }

        // re-register eventListeners
        this.unregisterEventListeners();
        this.registerEventListeners();

        if (this.switch_town_callback) {
            this.switch_town_callback();
        }
        //this.setToTop();

        //Handle first two tabs written in Backbone
        //Detect which tab was opened
        if (is_frontend_bridge_call) {
            //Convert models and collections to Grepo objects
            data.old_window = true;
            data.models = MM.createBackboneObjects(data.models, window.GameModels, args);
            data.collections = MM.createBackboneObjects(data.collections, window.GameCollections, args);
            data.templates = data.templates[window_type];

            //First tab - Verteidigung
            if (data.collections.hasOwnProperty('support_for_active_town')) {
                var ctrl = new GameControllers.SupportOverviewController({
                    el: root.find('.gpwindow_content'),
                    cm_context: this.wnd.getContext()
                });

                ctrl.setMode(tab_type);
                ctrl.renderPage(data);
            }
        }
    };

    WndHandlerBuilding.prototype.registerBuildingPlaceComponents = function() {
        var root = this.wnd.getJQElement();
        var context = this.wnd.getContext(),
            celebration_cost = GeneralModifications.getTriumphCost();

        //Initialize 'buy olympic games button'
        var $olymp = root.find('.btn_organize_olympic_games'),
            $festival = root.find('.btn_city_festival'),
            $victory = root.find('.btn_victory_procession'),
            $theater = root.find('.btn_theater_plays');

        CM.unregister(context, 'btn_city_festival');
        CM.register(context, 'btn_city_festival', $festival.button({
            caption: _('Organize'),
            disabled: $festival.data('enabled') === ''
        }).on('btn:click', function(e, _btn) {
            BuildingPlace.startCelebration('party', _btn);
        }));

        CM.unregister(context, 'btn_organize_olympic_games');
        CM.register(context, 'btn_organize_olympic_games', $olymp.button({
            caption: _('Organize'),
            disabled: $olymp.data('enabled') === ''
        }).on('btn:click', function(e, _btn) {
            BuildingPlace.startCelebration('games', _btn);
        }));

        // triumph
        var killpoints_model = MM.getModelByNameAndPlayerId('PlayerKillpoints'),
            not_enough_killpoints = killpoints_model.getUnusedPoints() < celebration_cost,
            triumph_running = $victory.data('enabled') === '',
            triumph_enabled = !triumph_running && !not_enough_killpoints;

        CM.unregister(context, 'btn_victory_procession');
        var btn_victory = CM.register(context, 'btn_victory_procession', $victory.button({
            caption: _('Organize'),
            disabled: !triumph_enabled
        }).on('btn:click', function(e, _btn) {
            BuildingPlace.startCelebration('triumph', _btn);
        }));

        if (not_enough_killpoints && !triumph_running) {
            $victory.after('<p class="error_msg">' + _("You haven't defeated enough enemies yet.") + '</p>');
            $('#place_triumph .game_footer span').css('color', '#c00');
        }

        CM.unregister(context, 'btn_theater_plays');
        CM.register(context, 'btn_theater_plays', $theater.button({
            caption: _('Organize'),
            disabled: $theater.data('enabled') === ''
        }).on('btn:click', function(e, _btn) {
            BuildingPlace.startCelebration('theater', _btn);
        }));

        killpoints_model.off('change').on('change', function(model) {
            btn_victory.enable();
            $victory.parent().find('p.error_msg').remove();
            if (triumph_running) {
                btn_victory.disable();
                return;
            }
            if (model.getUnusedPoints() < celebration_cost) {
                btn_victory.disable();
                $('#place_triumph .game_footer span').css('color', '#c00');
                $victory.after('<p class="error_msg">' + _("You haven't defeated enough enemies yet.") + '</p>');
            }
        });

        var celebration_collection = MM.getCollections().Celebration[0];
        if (celebration_collection) {
            celebration_collection.off(null, null, 'wndhandler_building_main').on('add remove change', function(model) {
                this.refresh();
            }.bind(this), 'wndhandler_building_main');
        }
    };

    WndHandlerBuilding.prototype.registerFightSimulatorConfiguration = function(categories, power_configurations) {
        var root = this.wnd.getJQElement(),
            $el = $('#place_simulator_form');

        if (this.configuration_controller) {
            this.configuration_controller = null;
        }

        root.find('.place_sim_showhide').off().on('click', function() {
            if (!this.configuration_controller) {
                this.configuration_controller = new SimulatorConfigurationController({
                    el: $el,
                    cm_context: this.wnd.getContext(),
                    models: [],
                    collections: [],
                    l10n: DM.getl10n('place', 'simulator').configuration,
                    templates: {
                        configuration: DM.getTemplate('simulator', 'configuration'),
                        configuration_category: DM.getTemplate('simulator', 'configuration_category'),
                        row_power: DM.getTemplate('simulator', 'configuration_row_power'),
                        option_popup: DM.getTemplate('simulator', 'configuration_option_popup')
                    },
                    categories: categories,
                    power_configurations: power_configurations,
                    onBeforeCloseCallback: function() {
                        FightSimulator.simulator_configuration = this.configuration_controller.getSimulatorConfiguration();
                        this.updateActivePowersCounter();
                    }.bind(this)
                });
            }

            this.configuration_controller.renderPage();
        }.bind(this));

        this.updateActivePowersCounter();
    };

    WndHandlerBuilding.prototype.updateActivePowersCounter = function() {
        var $mods = this.wnd.getJQElement().find('.place_sim_wrap_mods'),
            mods_att = 0,
            mods_def = 0;

        if (this.configuration_controller) {
            mods_att = this.configuration_controller.getConfigurationOptionCountForAttacker();
            mods_def = this.configuration_controller.getConfigurationOptionCountForDefender();
        }

        $mods.find('.active_mods_att').text(mods_att);
        $mods.find('.active_mods_def').text(mods_def);
    };

    WndHandlerBuilding.prototype.registerFightSimulatorHeroComponents = function() {
        if (!Game.features.heroes_enabled) {
            return;
        }

        var context = this.wnd.getContext();

        var l10n = DM.getl10n('place', 'simulator'),
            all_heroes = [{
                info: l10n.unassign,
                value: ''
            }];

        if (GameData.heroes) {
            $.each(GameData.heroes, function(hero_id, hero) {
                var hero_obj = {
                    value: hero_id,
                    level: hero.name,
                    hero_level: 1
                };

                all_heroes.push(hero_obj);
            });
        }

        /** sliders for heroes **/
        var attack_level_text = $('#hero_attack_text'),
            attack_level_input = $('#hero_attack_level'),
            defense_level_text = $('#hero_defense_text'),
            defense_level_input = $('#hero_defense_level');

        var spinner1 = CM.register(context, 'hero_attack_spinner', $('#hero_attack_spinner').spinner({
            value: 1,
            max: 20,
            min: 1,
            step: 1,
            disabled: true
        }).on('sp:change:value', function(e, new_val, old_val, spinner) {
            attack_level_text.text(new_val);
            attack_level_input.val(new_val);

            CM.get(context, 'dropdown_hero_attack_dd').updateTooltipWithLevel(new_val);
        }));

        var spinner2 = CM.register(context, 'hero_defense_spinner', $('#hero_defense_spinner').spinner({
            value: 1,
            max: 20,
            min: 1,
            step: 1,
            disabled: true
        }).on('sp:change:value', function(e, new_val, old_val, spinner) {
            defense_level_text.text(new_val);
            defense_level_input.val(new_val);

            CM.get(context, 'dropdown_hero_defense_dd').updateTooltipWithLevel(new_val);
        }));

        $('#hero_attack_dd, #hero_defense_dd').each(function() {
            var $el = $(this),
                id = $el.attr('id'),
                $input_value = $('#' + $el.data('input')),
                $icon = $('#' + $el.data('icon'));

            CM.register(context, 'dropdown_' + $el.attr('id'), $el.heroDropdown({
                template: DM.getTemplate('heroes', 'dropdown_select_hero'),
                options: all_heroes,
                confirmation_window: false,
                value: ''
            }).on('dd:change:value', function(e, new_val, old_val, _dd) {
                var filtered = all_heroes.clone();

                $icon.removeClass(old_val !== '' ? old_val : 'no_hero_selected');
                $icon.addClass(new_val !== '' ? new_val : 'no_hero_selected');

                //I know its ugly, but I would have to change to much after my predecessor
                if (new_val !== '') {
                    switch (id) {
                        case 'hero_attack_dd':
                            spinner1.enable();
                            break;
                        case 'hero_defense_dd':
                            filtered = filtered.filter(function(option, index, array) {
                                return option.value !== new_val;
                            });

                            spinner2.enable();
                            break;
                    }
                } else {
                    switch (id) {
                        case 'hero_attack_dd':
                            spinner1.disable();
                            break;
                        case 'hero_defense_dd':
                            spinner2.disable();
                            break;
                    }
                }

                $input_value.val(new_val);
            }));
        });

        // If the FightSimulator knows about heroes (has been initialized with units), pre-select them in the simulator
        var player_units = FightSimulator.player_units || {},
            att_units = player_units.att || {},
            def_units = player_units.def || {},
            hero_ids = us.keys(GameData.heroes),
            att_hero_name, def_hero_name, att_hero_level, def_hero_level;

        us.find(att_units, function(level, unit_id) {
            if (hero_ids.indexOf(unit_id) > -1 && level > 0) {
                att_hero_name = unit_id;
                if (typeof ReportViewer.data.attacker_units !== 'undefined') {
                    att_hero_level = ReportViewer.data.attacker_units[att_hero_name].before;
                } else {
                    att_hero_level = level;
                }
                return true;
            }
        });

        us.find(def_units, function(level, unit_id) {
            if (hero_ids.indexOf(unit_id) > -1 && level > 0) {
                def_hero_name = unit_id;
                if (typeof ReportViewer.data.defender_units !== 'undefined') {
                    def_hero_level = ReportViewer.data.defender_units[def_hero_name].before;
                } else {
                    def_hero_level = level;
                }
                return true;
            }
        });

        if (att_hero_name) {
            CM.get(context, 'dropdown_hero_attack_dd').setValue(att_hero_name);
            CM.get(context, 'hero_attack_spinner').setValue(att_hero_level);
        }

        if (def_hero_name) {
            CM.get(context, 'dropdown_hero_defense_dd').setValue(def_hero_name);
            CM.get(context, 'hero_defense_spinner').setValue(def_hero_level);
        }

    };

    /**
     * @deprecated
     */
    WndHandlerBuilding.prototype.onMessage = function(type, building_type, is_building, action, parameters) {
        type = type || '';
        building_type = building_type || '';
        is_building = is_building || false;
        action = action || 'index';
        parameters = parameters || {};

        switch (type) {
            case 'setOnCloseHook':
                this.onclose_hook = building_type;
                break;

            case 'unsetOnCloseHook':
                this.onclose_hook = null;
                break;

        }
        return null;
    };

    WndHandlerBuilding.prototype.submitForm = function(form_id, action) {
        var params = {};
        $('#' + form_id + ' input').each(function() {
            params[this.name] = this.value;
        });
        var building = GameData.buildings[this.currentBuilding];
        this.wnd.requestContentPost(building.controller, action, params);
    };

    WndHandlerBuilding.prototype.reloadBuildingWithUnitOrders = function(building) {
        var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_BUILDING);
        if (wnd) {
            building = GameData.buildings[building];
            wnd.requestContentGet(building.controller, 'index', {});
        }
    };

    WndHandlerBuilding.prototype.registerBuildingUnitsComponents = function() {
        var context = this.wnd.getContext(),
            $root = this.wnd.getJQElement(),
            Buildings = require('enums/buildings');

        CM.unregister(context, 'btn_required_building');
        CM.unregister(context, 'btn_required_research');

        CM.register(context, 'btn_required_building', $root.find('.btn_required_building').button({
            icon: true,
            icon_type: 'required_building',
            tooltips: [{
                title: _('Go to Senate')
            }]
        }).on('btn:click', function(e, _btn) {
            BuildingWindowFactory.open(Buildings.MAIN);
        }));

        CM.register(context, 'btn_required_research', $root.find('.btn_required_research').button({
            icon: true,
            icon_type: 'required_research',
            tooltips: [{
                title: _('Go to Academy')
            }]
        }).on('btn:click', function(e, _btn) {
            BuildingWindowFactory.open(Buildings.ACADEMY);
        }));
    };

    us.extend(WndHandlerBuilding.prototype, Backbone.Events);

    window.WndHandlerBuilding = WndHandlerBuilding;

    GPWindowMgr.addWndType('BUILDING', 'taskbar_building', WndHandlerBuilding, 1);
}());