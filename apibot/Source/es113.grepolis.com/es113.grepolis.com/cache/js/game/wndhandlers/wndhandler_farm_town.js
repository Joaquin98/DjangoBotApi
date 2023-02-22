/* global DeprecatedHelper, MM, HumanMessage, ConfirmationWindowFactory, BuildingPlace, TooltipFactory,  WMap,
TownRelationProvider, Slider, ITowns, us, GameData, WndHandlerBuilding, Game, GameEvents, Timestamp, GPWindowMgr, CM,
DM, Backbone */
/* jshint quotmark: false */
(function() {
    'use strict';

    var DateHelper = require('helpers/date');

    var WndHandlerFarmTown = function(wndhandle) {
        this.wnd = wndhandle;
        this.farm_town = true;

        //Spinners which are used for Upgrading Farm level
        this.spinners = {};
    };

    WndHandlerFarmTown.inherits(window.WndHandlerAttack);

    us.extend(WndHandlerFarmTown.prototype, Backbone.Events);

    WndHandlerFarmTown.prototype.getDefaultWindowOptions = function() {
        return {
            height: 200,
            width: 618,
            resizable: false,
            title: '',
            autoresize: true
        };
    };

    WndHandlerFarmTown.prototype.onInit = function(title, UIopts, id) {
        var _self = this;

        this.wnd.requestContentGet('farm_town_info', UIopts.action, {
            id: id
        }, function() {
            var i;
            var sim_units = {
                att: {},
                def: {}
            };
            for (i in GameData.units) {
                if (GameData.units.hasOwnProperty(i)) {
                    sim_units.att[i] = 0;
                }
            }

            /* the link to the simulator is also found in the game tips for 3rd farm town, defined in DataFarmTown */
            $('#farm_town_simulate, #farm_town_simulate_tooltip').off().on('click', function() {
                $(this).parents('.farm_attack_bg').find('.farm_attack_troops_troops input[type="text"]').each(function() {
                    var amount = $(this).val();
                    sim_units.att[$(this).attr('name')] = amount.length ? parseInt(amount, 10) : 0;
                });

                $(this).parents('.farm_attack_bg').find('.farm_attack_farm .unit').each(function() {
                    var data = $(this).data();
                    if (data.unitId === 'wall') {
                        sim_units.def_mods = {
                            building_wall: data.level
                        };
                    } else {
                        sim_units.def[data.unitId] = data.amount;
                    }
                });

                BuildingPlace.insertUnitsToSimulator(sim_units);
            });
        });
        return true;
    };

    WndHandlerFarmTown.prototype.onClose = function() {
        this.unregisterEventListeners();
        return true;
    };

    WndHandlerFarmTown.prototype.afterSetContent = function() {
        $('.farm_attack_troops_troops').find('input[type="text"]').each(function() {
            $(this).blur(function() {
                DeprecatedHelper.parseToValidNumericValue(this);
            });
        });
    };

    WndHandlerFarmTown.prototype.render = function() {
        //clear this.unitInputs
        delete this.unitInputs;

        // generate HTML from template + data
        var html = us.template(GameData.FarmAttackTemplate, this.data);
        this.wnd.setContent(html);
        this.afterSetContent();
        this.root.find('a.index_unit')
            .on('click', function(e) {
                var el = e.currentTarget;
                this.selectUnit(el);
                this.bindDurationCounter();
            }.bind(this)).each(function() {
                // unit tooltip
                $(this).tooltip(TooltipFactory.getUnitCard($(this).attr('id')), {}, false);
            });
        // defender unit tooltip
        var $defender = this.root.find('.farm_attack_farm_troops .unit');
        $defender.each(function() {
            var $this = $(this);
            $this.setPopup($this.data('unit-id') + '_details');
        });

        //find send_units-button:
        this.root.find('a.button[name=send_units]').on("click", function() {
            this.sendUnits('', this.data.type, this.data.target);
        }.bind(this));

        this.getUnitInputs().on('keyup change', function() {
            this.bindDurationCounter();
        }.bind(this));

        // bind event handler for changes
        this.bindDurationCounter();

        this.root.find('div.farm_attack_bar_bg').tooltip(_('Required unit strength to conquer another farming village'));
        this.root.find('a.button.simulate_units').tooltip(_('Add units to the simulator'));

        this.wnd.setTitle(_('Attack on %s').replace('%s', this.data.farm_town_name));
    };

    // convert 1:1.25 format to 1.25 and 1.25:1 to 0.8
    WndHandlerFarmTown.prototype.convertRatioToFraction = function(ratio_string) {
        if (!ratio_string) {
            return ratio_string;
        }

        return ratio_string.split(':')[1];
    };

    WndHandlerFarmTown.prototype.setTradeRatioAndMinMaxValues = function() {
        var trade_ratio_raw = this.root.find('span.trade_ratio').html(),
            trade_ratio = this.convertRatioToFraction(trade_ratio_raw),
            min_trading_sum = parseInt(this.root.find('a.trade_slider_min').html(), 10),
            max_trading_sum = parseInt(this.root.find('a.trade_slider_max').html(), 10);

        this.bindTradeSlider(trade_ratio, min_trading_sum, max_trading_sum);
    };

    WndHandlerFarmTown.prototype.onRcvData = function(data, controller, action) {
        var _self = this;

        var units, i, root;

        this.unregisterEventListeners();
        this.root = this.wnd.getJQElement();

        root = this.root;

        // action
        switch (action) {
            case 'attack':
                this.data = data.json;
                //store unit count in current town
                units = {};

                for (i in data.json.units) {
                    if (data.json.units.hasOwnProperty(i)) {
                        units[i] = data.json.units[i].count;
                    }
                }

                // if template was sent, add to cache
                if (data.tmpl) {
                    GameData.add({
                        'FarmAttackTemplate': data.tmpl
                    });
                }

                this.render();
                break;

            case 'trading':
                this.wnd.setContent(data.html);
                $('.farm_container #demand').tooltip(_('You are exchanging this resource.'));
                $('.farm_container #offer').tooltip(_('You are receiving this resource.'));
                $('.farm_container #arrival_time').tooltip(_('Arrival'));
                $('.farm_container #way_duration').tooltip(_('Travel time'));

                this.setTradeRatioAndMinMaxValues();

                this.wnd.setTitle(_('Trade with %s').replace('%s', data.farm_town_name));

                var context = {
                        main: 'farm_village',
                        sub: 'trade'
                    },
                    trade_button = _self.root.find('.btn_trade'),
                    btn_disabled = trade_button.data('disabled') === true;

                CM.unregister(context, 'btn_trade');

                CM.register(context, 'btn_trade', trade_button.button({
                    caption: DM.getl10n("context_menu", "titles").trading,
                    tooltips: [{
                            title: _("Trading with the villagers is possible as long as the they are in a good mood.")
                        },
                        {
                            title: _("You can't trade with the farming village as its mood is too low.")
                        }
                    ],
                    disabled: btn_disabled,
                    state: btn_disabled
                }).on('btn:click', function(_btn) {
                    _self.tradeWithFarmTown(data.farm_town_id, _btn);
                }));

                break;

            case 'claim_info':
                //FALLTHROUGH
            case 'pillage_info':
                //FALLTHROUGH
            case 'units_info':
                this.wnd.setContent(data.html);

                var timer = this.root.find('span.farm_next_claim_time');
                timer.countdown(data.json.lootable_at, {});

                // Reload orders on finish
                timer.on('finish', function() {
                    _self.root.find('span.farm_next_claim_time').html(_('ready'));
                    _self.root.find('a.farm_claim_button').each(function() {
                        $(this).removeClass('farm_claim_button_inactive');
                    });
                });

                // set correct window title
                var w_title = '';
                switch (action) {
                    case 'claim_info':
                        w_title = _('Demand from %s').replace('%s', data.json.farm_town_name);
                        WndHandlerBuilding.prototype.initializeBuyForGoldAdvisor.call(this, 'captain');
                        break;
                    case 'pillage_info':
                        w_title = _('Loot %s').replace('%s', data.json.farm_town_name);
                        WndHandlerBuilding.prototype.initializeBuyForGoldAdvisor.call(this, 'captain');
                        break;
                    case 'units_info':
                        w_title = _('Demand units from %s').replace('%s', data.json.farm_town_name);
                        break;
                }
                this.wnd.setTitle(w_title);
                break;
            case 'info':
                var town_model = new TownRelationProvider(Game.townId).getModel(),
                    resources = town_model.getResources();

                var farm_town_name;

                farm_town_name = (data.farm_town_name) ? data.farm_town_name : farm_town_name;
                farm_town_name = (data.json) ? data.json.farm_town_name : farm_town_name;

                this.wnd.setTitle(_('Upgrade of %s').replace('%s', farm_town_name));
                this.wnd.setContent(data.html);

                root.find('.farm_build_res .unit_container.trade_resource span.clickable').on("click", function() {
                    var resource_id = $(this).attr('data-resource-id'),
                        spinner = _self.spinners['sp_' + resource_id],
                        max = town_model.getResource(resource_id);

                    if (spinner.getValue() !== max) {
                        spinner.setMax(max);
                        spinner.setValue(max);
                    } else {
                        spinner.setValue(0);
                    }
                });

                //Initialize spinners
                this.spinners.sp_wood = root.find('#trade_type_wood').spinner({
                    value: 0,
                    step: 500,
                    max: resources.wood,
                    tabindex: 61
                });
                this.spinners.sp_stone = root.find('#trade_type_stone').spinner({
                    value: 0,
                    step: 500,
                    max: resources.stone,
                    tabindex: 62
                });
                this.spinners.sp_iron = root.find('#trade_type_iron').spinner({
                    value: 0,
                    step: 500,
                    max: resources.iron,
                    tabindex: 63
                });
                break;
            default:
                break;
        }

        this.registerEventListeners(action, data);
        this.afterSetContent();
    };

    WndHandlerFarmTown.prototype.bindTradeSlider = function(ratio, min, max) {
        var root = this.root.find('div.trade_slider_box');
        var element_slider = root.find('div.trade_slider_slider'),
            trade_slider = new Slider({
                elementMin: root.find('a.trade_slider_min'),
                elementMax: root.find('a.trade_slider_max'),
                elementDown: root.find('a.trade_slider_down'),
                elementUp: root.find('a.trade_slider_up'),
                elementInput: root.find('input.trade_slider_input'),
                elementSlider: element_slider,

                elementDownFast: root.find('a.trade_slider_ffwd_down'),
                elementUpFast: root.find('a.trade_slider_ffwd_up')
            });

        element_slider.on('change', function() {
            var input = trade_slider.getValue(),
                output = Math.round(input * ratio);

            root.find('input.trade_slider_output').val(output);
            root.find('#trade_out').text(output);
            root.find('.trade_in').text(input); //?
        });
        trade_slider.setMin(min);
        trade_slider.setMax(max);
        trade_slider.setValue(min);
    };

    WndHandlerFarmTown.prototype.tradeWithFarmTown = function(target_id, event) {
        var btn = $(event.target);
        var trade_input = this.wnd.getJQElement().find('input.trade_slider_input').val();
        this.wnd.ajaxRequestPost('farm_town_info', 'trade', {
            'id': target_id,
            'trade_input': trade_input
        }, {
            success: function(wnd, data) {
                $.Observer(GameEvents.window.farm.trade).publish(data);
                wnd.close();
            },
            error: function() {
                btn.enable();
            }
        }, {}, 'town_info_trade_with_farm_town');
    };

    /**
     */
    WndHandlerFarmTown.prototype.sendResources = function(target_id) {
        var that = this,
            ajax_data = {
                target_id: target_id,
                wood: this.spinners.sp_wood.getValue(),
                stone: this.spinners.sp_stone.getValue(),
                iron: this.spinners.sp_iron.getValue()
            };

        this.wnd.ajaxRequestPost('farm_town_info', 'send_resources', ajax_data, function(_wnd, data) {
            that.wnd.reloadContent();
            WMap.updateStatusInChunkTowns(target_id, -1, -1, -1, '', 1, data.expansion_stage);
            WMap.refresh('towns');
            $.Observer(GameEvents.window.farm.send_resources).publish(data);
        });
    };

    WndHandlerFarmTown.prototype._claimLoadSuccesCallback = function(target_id, claim_type, time) {
        this.wnd.ajaxRequestPost('farm_town_info', 'claim_load', {
            target_id: target_id,
            claim_type: claim_type,
            time: time
        }, function(window, data) {
            window.close();
            var lootable_human = DateHelper.readableSeconds(data.lootable_at - Timestamp.now('s'));

            if (data.relation_status === 2) {
                WMap.updateStatusInChunkTowns(target_id, data.satisfaction, Timestamp.now() + time, Timestamp.now(), lootable_human, 2);
            } else {
                WMap.updateStatusInChunkTowns(target_id, data.satisfaction, Timestamp.now() + time, Timestamp.now(), lootable_human);
            }
            WMap.pollForMapChunksUpdate();

            WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(target_id);
            $.Observer(GameEvents.window.farm.claim_load).publish({
                targets: [target_id],
                claim_type: claim_type,
                data: data,
                time: time,
                claimed_resources_per_resource_type: data.claimed_resources_per_resource_type
            });
        });
    };

    WndHandlerFarmTown.prototype.claimLoad = function(target_id, claim_type, time, resource_amount, cap_reached, claim_at) {
        var ResourceRewardDataFactory = require('factories/resource_reward_data_factory'),
            simple_reward_data = ResourceRewardDataFactory.fromFarmTownClaim(resource_amount);

        if (cap_reached) {
            HumanMessage.error(_("The maximum daily amount of resources for this village has been reached."));
        } else if (claim_at > Timestamp.now()) {
            HumanMessage.error(_("Your demand isn't ready yet."));
        } else {
            ConfirmationWindowFactory.openConfirmationWastedResources(this._claimLoadSuccesCallback.bind(this, target_id, claim_type, time), null, simple_reward_data);
        }
    };

    WndHandlerFarmTown.prototype.claimUnits = function(target_id, _unit_type) {
        this.wnd.ajaxRequestPost('farm_town_info', 'claim_units', {
            target_id: target_id,
            unit_type: _unit_type
        }, function(window, data) {
            window.close();
            var lootable_human = DateHelper.readableSeconds(data.lootable_at - Timestamp.now('s'));

            if (data.relation_status === 2) {
                WMap.updateStatusInChunkTowns(target_id, data.satisfaction, Timestamp.now() + data.time, Timestamp.now(), lootable_human, 2);
                WMap.pollForMapChunksUpdate();
            } else {
                WMap.updateStatusInChunkTowns(target_id, data.satisfaction, Timestamp.now() + data.time, Timestamp.now(), lootable_human);
            }

            WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(target_id);
            $.Observer(GameEvents.window.farm.claim_unit).publish({
                target_id: target_id,
                unit_type: _unit_type,
                data: data
            });
        });
    };

    WndHandlerFarmTown.prototype.registerEventListeners = function(open_tab, farm_town_data) {
        var that = this;

        if (open_tab === 'attack') {
            $.Observer(GameEvents.town.units.change).subscribe(['WndHandlerFarmTown' + this.wnd.getID()], function(e) {
                that.handleEvents(e, that);
            });
        }

        $.Observer(GameEvents.town.town_switch).subscribe(['WndHandlerFarmTown' + this.wnd.getID()], function(e) {
            that.handleEvents(e, that);
        });

        var farm_town_player_relations = MM.getOnlyCollectionByName('FarmTownPlayerRelation');

        farm_town_player_relations.onFarmTownRelationStatusChange(this, function(farm_town_model) {
            this.wnd.close();
        }.bind(this));

        farm_town_player_relations.onRatioUpdate(this, function(farm_town_model) {
            if (open_tab === 'trading' && farm_town_data.farm_town_id === farm_town_model.getFarmTownId()) {
                this.root.find('span.trade_ratio').text('1:' + farm_town_model.getCurrentTradeRatio());
                this.setTradeRatioAndMinMaxValues();
            }
        }.bind(this));

        farm_town_player_relations.onSatisfactionUpdate(this, function() {
            WMap.pollForMapChunksUpdate();
        }.bind(this));
    };

    WndHandlerFarmTown.prototype.unregisterEventListeners = function() {
        $.Observer().unsubscribe(['WndHandlerFarmTown' + this.wnd.getID()]);
        this.stopListening();
    };

    /**
     * handle events for town
     *
     * @param {object} event
     * @param {object} that -> actual wndhandler
     */
    WndHandlerFarmTown.prototype.handleEvents = function(event, that) {
        var root, units, unit_name, population_diff, diff;

        if (event.type === GameEvents.town.units.change) {
            if (!that.data) {
                return;
            }

            // update unit count from Layout.town
            root = that.wnd.getJQElement();

            units = ITowns.getTown(Game.townId).units();

            population_diff = 0;

            for (unit_name in that.data.units) {
                if (that.data.units.hasOwnProperty(unit_name)) {

                    var units_in_town = units[unit_name] || 0;

                    //in the "units" object we have only units which are in the town, not all possible
                    diff = units_in_town - that.data.units[unit_name].count;

                    that.data.units[unit_name].count = units_in_town;
                    root.find('a#' + unit_name).children('span').html(that.data.units[unit_name].count);

                    population_diff += diff * that.data.units[unit_name].population;
                }
            }

            that.data.sum_strength = that.data.sum_strength + population_diff;

            root.find('div.farm_attack_bar_number').html(Math.min(that.data.sum_strength, that.data.strength_next) + '/' + that.data.strength_next);

            if (that.data.strength_next > 0) {
                root.find('div.farm_attack_bar').width(Math.min((that.data.sum_strength / that.data.strength_next), 1) * 200);
            }
        } else if (event.type === GameEvents.town.town_switch) {
            that.wnd.close();
        }
    };

    GPWindowMgr.addWndType('FARM_TOWN', null, WndHandlerFarmTown);
}());