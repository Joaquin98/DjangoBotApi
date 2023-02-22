/* global Game, GameEvents, ConfirmationWindowFactory, HumanMessage, _, __, TM, CM,
ITowns, Timestamp, GPWindowMgr, GameDataResearches, Backbone, ngettext, WMap */

(function() {
    'use strict';

    var Features = require('data/features'),
        DateHelper = require('helpers/date'); //jshint ignore:line

    function WndHandlerFarmTownOverviews(wndhandle) {
        this.wnd = wndhandle;
        this.island_x = 0;
        this.island_y = 0;
        this.current_town_id = 0;
        this.booty_researched = 0;
        this.diplomacy_researched = 0;
        this.trade_office = 0;
        this.loads_data = null;
        this.farm_towns = null;
        this.selected_farm_towns = [];
        this.selected_time_option = null;
        this.max_resources = null;
        this.max_satisfaction_reduce = null;
        this.pillage_menu = false;
        this.towns_data = null;
        this.selected_towns_count = 0;
    }
    WndHandlerFarmTownOverviews.inherits(window.WndHandlerDefault);

    us.extend(WndHandlerFarmTownOverviews.prototype, Backbone.Events);

    WndHandlerFarmTownOverviews.prototype.getDefaultWindowOptions = function() {
        return {
            height: 570,
            width: 800,
            resizable: false,
            minimizable: true,
            title: ''
        };
    };

    WndHandlerFarmTownOverviews.prototype.onInit = function(title, UIopts) {
        this.wnd.requestContentGet('farm_town_overviews', 'index', {});
        this.stopListening();
        this.getCollection('farm_town_player_relations').onRatioUpdate(this, function(model) {
            var wrapper = $('#farm_town_list'),
                $farm_town_el = wrapper.find('.farm_town_el_' + model.getFarmTownId()),
                $ratio_el = $farm_town_el.find('.popup_ratio');
            $ratio_el.text('1:' + model.getCurrentTradeRatio());
        });

        return true;
    };

    WndHandlerFarmTownOverviews.prototype.onRcvData = function(data) {
        //bind tab click events and invalidate data (without layout related stuff)
        TM.unregister('WndHandlerFarmTownOverviews::AutoRefreshFarmTownOverviewByNextLoot::timer');
        TM.unregister('WndHandlerFarmTownOverviews::initializeResourcesProductionCounter::timer');
        this.initializeResourcesCounter(data.towns);
        this.bindMenuEvents();
        this.invalideData(false);

        //set content and bind events on clicks on the town list
        this.wnd.setContent2(data.html);
        this.bindTownClick();
        this.bindSelectAll();

        this.$town_list = $('#fto_town_list');
        this.$town_list.find('.fto_town.town' + Game.townId).trigger('click');
        this.bindScrollHandler();
        this.setItemsHidden();
    };

    WndHandlerFarmTownOverviews.prototype.onClose = function() {
        TM.unregister('WndHandlerFarmTownOverviews::AutoRefreshFarmTownOverviewByNextLoot::timer');
        TM.unregister('WndHandlerFarmTownOverviews::initializeResourcesProductionCounter::timer');

        this.stopListening();

        return true;
    };

    /**
     * returns the smallest key from server loads_data hash
     */
    WndHandlerFarmTownOverviews.prototype._getSmallestAvailableTimeOption = function(loads_data) {
        if (loads_data) {
            return parseInt(us.keys(loads_data)[0], 10);
        }

        return null;
    };
    /**
     * get farm towns for the current town_id
     * @params params - contains coords(int), selected town_id(int) and booty_researched (int)
     */
    WndHandlerFarmTownOverviews.prototype.getFarmTowns = function(params) {
        //clean old things up - without layout related stuff because it's set new anyway
        this.invalideData(false);

        this.wnd.ajaxRequestGet('farm_town_overviews', 'get_farm_towns_for_town', params, function(_wnd, data) {
            var farm_town_wrapper = $('#farm_town_wrapper');
            if (Features.battlepointVillagesEnabled()) {
                farm_town_wrapper.addClass('bpv');
            }
            this.loads_data = data.loads_data;
            this.farm_towns = data.farm_town_list;

            // if the selected_time_option is not available, reset it
            if (typeof(data.loads_data[this.selected_time_option]) === 'undefined') {
                this.selected_time_option = null;
            }

            // the selected time option is either the saved one or the smallest one from the server
            this.selected_time_option = this.selected_time_option || this._getSmallestAvailableTimeOption(data.loads_data);

            //select all farms on start - player can deselect them if he wants to
            this.selectAllFarms(false);

            //set content and bind events
            farm_town_wrapper.html(data.html);
            this.bindFarmTownClick(farm_town_wrapper);
            this.bindOptionsClick();

            //calculate resources for correct values after fetching
            this.changeMaxResources();

            // select the correct checkbox in options tab
            this.restoreTimeSelectionCheckbox();

            this.addTooltipsToDisabledFarmTowns();

            //bind popups and text
            $('#fto_farm_claim_new_res').tooltip('<h4>' + _('Resources in the current city') + '</h4><p>' + _('Amount of resources that are available after making a demand or looting.') + '</p>');
            $('#max_satisfaction_reduce').parent().tooltip('<h4>' + _('Mood decrease') + '</h4><p>' + _('Low village mood can lead to a loss of control over the farming village.') + '</p><p>' + _('Mood will be restored with time. Should you lose control, you will need to reconquer the village with force.') + '</p>');
            $('#max_claim_resources').parent().tooltip('<h4>' + _('Maximum possible resources') + '</h4><p>' + _('Farming villages whose loads are not ready will not be considered.') + '</p>');

            this.toggleRibbon();
        }.bind(this));
    };

    /**
     * changes the maximum resources display in layout
     * if player is in pillage menu also satisfaction is calculated
     */
    WndHandlerFarmTownOverviews.prototype.changeMaxResources = function() {
        this.max_resources = 0;
        this.max_satisfaction_reduce = 0;
        var modification = this.pillage_menu ? 2 : 1;
        var diplomacy_bonus_factor = this.diplomacy_researched ? 1 + GameDataResearches.getBonusDiplomacyResources() : 1;

        //iterate over selected farms
        for (var i = 0; i < this.selected_farm_towns.length; i++) {
            for (var k = 0; k < this.farm_towns.length; k++) {
                if (this.farm_towns[k].id === this.selected_farm_towns[i]) {
                    this.max_resources += parseInt(this.loads_data[this.selected_time_option].resources[this.farm_towns[k].stage - 1] * modification * diplomacy_bonus_factor, 10);
                    if (this.pillage_menu) {
                        this.max_satisfaction_reduce = this.loads_data[this.selected_time_option].mood;
                    }
                }
            }
        }
        // if there is no selected farms and all demanded, we show the full outcome
        if (this.selected_farm_towns.length === 0) {
            for (var j = 0; j < this.farm_towns.length; j++) {
                if (this.farm_towns[j].rel === 1 && this.farm_towns[j].loot && Timestamp.now() < this.farm_towns[j].loot) {
                    this.max_resources += parseInt(this.loads_data[this.selected_time_option].resources[this.farm_towns[j].stage - 1] * modification * diplomacy_bonus_factor, 10);
                    if (this.pillage_menu) {
                        this.max_satisfaction_reduce = this.loads_data[this.selected_time_option].mood;
                    }
                }
            }
        }

        var resources = ['wood', 'stone', 'iron'];
        var town = ITowns.getTown(this.current_town_id);
        var storage = town.getStorage();
        var res = town.resources();

        for (var l = 0; l < resources.length; l++) {
            var id = resources[l];
            var elm = $('#fto_' + id + '_exceeded span.count');
            if (elm.length) {
                if ((res[id] + this.max_resources) >= storage) {
                    elm.html(storage)[0].className = 'count small town_storage_full';
                } else {
                    elm.html(res[id] + this.max_resources)[0].className = 'count small';
                }
            }
        }

        $('#max_claim_resources').html('+' + this.max_resources);
        $('#max_satisfaction_reduce').html(this.max_satisfaction_reduce > 0 ? ('-' + this.max_satisfaction_reduce) : this.max_satisfaction_reduce);
    };

    WndHandlerFarmTownOverviews.prototype.claimLoadsMultiple = function() {
        var selected_towns = this.getSelectedTowns();

        this.wnd.ajaxRequestPost('farm_town_overviews', 'claim_loads_multiple', {
            towns: selected_towns,
            time_option_base: this.selected_time_option,
            time_option_booty: this.selected_time_option_loyalty,
            claim_factor: (this.pillage_menu ? 'double' : 'normal')
        }, function(_wnd, data) {
            WMap.pollForMapChunksUpdate();
            this.onRcvData(data);
        }.bind(this));
    };

    /**
     * claim the loads
     * farms which are not ready yet, but marked - will be ignored
     */
    WndHandlerFarmTownOverviews.prototype.claimLoads = function() {
        var i = this.selected_farm_towns.length;
        var farm_town_ids = [];

        //error handling
        if (this.selected_farm_towns.length <= 0) {
            HumanMessage.error(_("You haven't selected any farming villages."));
            return;
        }
        if (this.selected_time_option === null) {
            HumanMessage.error(_("You haven't selected any time options."));
            return;
        }

        //put each selected farm_town_id in an array
        while (i--) {
            farm_town_ids.push(parseInt(this.selected_farm_towns[i], 10));
        }

        ConfirmationWindowFactory.openConfirmationWastedResources(this._doClaimLoads.bind(this, farm_town_ids), null, {
            'wood': this.max_resources,
            'stone': this.max_resources,
            'iron': this.max_resources
        }, this.current_town_id);
    };

    WndHandlerFarmTownOverviews.prototype._doClaimLoads = function(farm_town_ids) {
        this.wnd.ajaxRequestPost('farm_town_overviews', 'claim_loads', {
            farm_town_ids: farm_town_ids,
            time_option: this.selected_time_option,
            claim_factor: (this.pillage_menu ? 'double' : 'normal'),
            current_town_id: this.current_town_id
        }, function(_wnd, data) {
            //update the resources for the selected town
            for (var j in data.resources) {
                if (data.resources.hasOwnProperty(j)) {
                    var elm = this.$town_list.find('li.town' + this.current_town_id + ' span.fto_resource_count.' + j + ' span.count');
                    elm.html(data.resources[j]);
                    if (elm.length) {
                        elm[0].className = (data.storage > data.resources[j]) ? 'small count' : 'small count town_storage_full';
                    }
                }
            }

            if (this.current_town_id === Game.townId) {
                $.Observer(GameEvents.window.farm.claim_load).publish({
                    targets: farm_town_ids,
                    claim_type: (this.pillage_menu ? 'double' : 'normal'),
                    time: this.selected_time_option,
                    claimed_resources_per_resource_type: data.claimed_resources_per_resource_type
                });
            }

            //change mouse popup on islands if farm town was handled
            //jshint ignore:start
            var updated_farm_town_id,
                farm_town;
            for (updated_farm_town_id in data.handled_farms) {
                farm_town = data.handled_farms[updated_farm_town_id];
                var lootable_human = DateHelper.readableSeconds(farm_town.lootable_at - Timestamp.now('s'));
                WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(updated_farm_town_id);
                WMap.updateStatusInChunkTowns(updated_farm_town_id, farm_town.satisfaction, Timestamp.now() + this.selected_time_option, Timestamp.now(),
                    lootable_human, farm_town.relation_status);
                WMap.pollForMapChunksUpdate();
            }
            //jshint ignore:end

            //finally fetch farm towns to have clean data with new timestamps for the loads etc.
            this.getFarmTowns({
                island_x: this.island_x,
                island_y: this.island_y,
                booty_researched: this.booty_researched,
                trade_office: this.trade_office,
                diplomacy_researched: this.diplomacy_researched
            });
        }.bind(this));
    };
    /**
     * invalidate data
     * basically used for clean calculations
     *
     * @params change_button - selects all farm towns in layout (not in the "backend")
     */
    WndHandlerFarmTownOverviews.prototype.invalideData = function(change_button) {
        this.selected_farm_towns = [];
        this.selected_towns_count = 0;
        this.towns_data = null;
        this.max_resources = null;
        this.max_satisfaction_reduce = null;
        var pillage = this.pillage_menu;

        if (change_button) {
            $('#fto_claim_button').find('span.middle').html((pillage ? _('Loot') : __('verb|Demand')));
        }
    };

    /**
     * Filters all farm towns which have a loot timestamp greater than timestamp now and sorts them so the
     * ones with the smallest value come first
     * @returns array
     */
    WndHandlerFarmTownOverviews.prototype.getSortedFarmTownsByLootTimestamp = function() {
        var filtered_farm_towns = this.farm_towns.filter(function(farm_town) {
            return farm_town.loot > Timestamp.now();
        });
        return us.sortBy(filtered_farm_towns, function(farm_town) {
            return farm_town.loot;
        });
    };

    /**
     * Returns an array with farm towns which have a different timestamp, because farm towns which are ready
     * now to be looted have all the same timestamp and it can also be the case that the player loots one or more
     * farm towns at the same time, then they will also have the same timestamp (we don't need all of the same timestamps,
     * just one of it)
     * @returns array
     */
    WndHandlerFarmTownOverviews.prototype.getLootingFarmTowns = function() {
        var farm_towns_sorted = this.getSortedFarmTownsByLootTimestamp();
        return us.uniq(farm_towns_sorted, true, function(farm_town) {
            return farm_town.loot;
        });
    };

    /**
     * Check which farm towns have the special timestamp and update them (refresh them)
     */
    WndHandlerFarmTownOverviews.prototype.refreshFarmTowns = function(loot) {
        var farm_towns_to_refresh = this.farm_towns.filter(function(farm_town) {
            return farm_town.loot === loot;
        });
        farm_towns_to_refresh.forEach(function(farm_town) {
            var wrapper = $('#farm_town_list'),
                farm_check = wrapper.find('a.checkbox.farm_town_' + farm_town.id);
            farm_check.parent().removeClass('disabled');
            farm_check.parent().addClass('active');
            farm_check.addClass('checked');
            this.selected_farm_towns.push(farm_town.id);
            farm_check.parent().find('.next_demand_time').text(_('ready'));
            if (farm_check.parent().tooltip()) {
                farm_check.parent().tooltip().destroy();
            }
        }.bind(this));
    };

    /**
     * Unregister the running timer and remove it from the loot array
     */
    WndHandlerFarmTownOverviews.prototype.unRegisterTimer = function() {
        TM.unregister('WndHandlerFarmTownOverviews::AutoRefreshFarmTownOverviewByNextLoot::timer');
    };

    /**
     * Take the first timer from the loot array and register a new timeout
     */
    WndHandlerFarmTownOverviews.prototype.registerNextLootTimer = function() {
        var looting_farm_towns = this.getLootingFarmTowns();
        if (looting_farm_towns.length === 0) {
            return;
        }
        var farm_town_loot = looting_farm_towns[0].loot;
        var timeout_time = (farm_town_loot - Timestamp.now()) * 1000;
        TM.once('WndHandlerFarmTownOverviews::AutoRefreshFarmTownOverviewByNextLoot::timer', timeout_time, function() {
            this.refreshFarmTowns(farm_town_loot);
            this.registerButtonComponent();
            this.unRegisterTimer();
            this.registerNextLootTimer();
            this.toggleRibbon();
        }.bind(this));
    };

    /**
     * select all farms on the island which are owned by the player
     *
     * @params add_highlighting - selects all farm towns in layout (not in the "backend")
     */
    WndHandlerFarmTownOverviews.prototype.selectAllFarms = function(add_highlighting) {
        this.registerNextLootTimer();
        var wrapper = $('#farm_town_list');
        if (add_highlighting) {
            wrapper.find('a.checkbox').parent().removeClass('active');
            wrapper.find('a.checkbox').removeClass('checked');
        }
        var k = this.farm_towns.length;
        while (k--) {
            //only add to selected_farm_towns if player owns the farm town, loot is possbile and
            //the town is not upgrading (in BPV)
            var farm_town = this.farm_towns[k],
                now = Timestamp.now();

            if (farm_town.rel === 1 && farm_town.loot <= now) {
                if (this.selected_farm_towns.indexOf(this.farm_towns[k].id) <= -1) {
                    this.selected_farm_towns.push(this.farm_towns[k].id);
                }
                if (add_highlighting) {
                    var farm_check = wrapper.find('a.checkbox.farm_town_' + this.farm_towns[k].id);
                    farm_check.parent().addClass('active');
                    farm_check.addClass('checked');
                }
            }
        }
    };

    /**
     * binds click event on farm town elements
     */
    WndHandlerFarmTownOverviews.prototype.bindFarmTownClick = function(farm_town_wrapper) {
        farm_town_wrapper.find('li.owned').off().on("click", function(e) {
            if (e.target.className && e.target.className.match('gp_town_link')) {
                return;
            }

            var elm = $(e.currentTarget);
            var checkbox = elm.find('a.checkbox');
            var farm_town_id = parseInt(checkbox[0].className.match(/\d+/), 10);

            if (elm.hasClass('disabled')) {
                return;
            }

            //toggleClass cannot be used because of the array functions
            if (checkbox.hasClass('checked')) {
                elm.removeClass('active');
                checkbox.removeClass('checked');

                var i = this.selected_farm_towns.indexOf(farm_town_id);
                this.selected_farm_towns.splice(i, 1);
            } else {
                elm.addClass('active');
                checkbox.addClass('checked');
                this.selected_farm_towns.push(farm_town_id);
            }

            //change the maximum amount of resources after selection has changed
            this.changeMaxResources();
        }.bind(this));
    };

    /**
     * binds click event on time option elements
     */
    WndHandlerFarmTownOverviews.prototype.bindOptionsClick = function() {
        $('#farm_town_options').show().find('div.fto_time_checkbox').off().on("click", function(e) {
            var elm = $(e.currentTarget || e.target);

            if (elm.parent().hasClass('time_options_loyalty')) {
                this.selected_time_option_loyalty = elm.data('option');
            } else {
                this.selected_time_option = elm.data('option');
            }

            // remove all checkboxes
            var container = elm.parent();
            container.find('a').removeClass('checked');
            container.find('div.fto_time_checkbox').removeClass('active');

            // set new option
            elm.addClass('active');
            elm.find('a').addClass('checked');

            if (this.selected_towns_count) {
                this.calculateResourcesForMultipleTowns();
            } else {
                this.changeMaxResources();
            }
        }.bind(this));

        this.registerButtonComponent();
    };

    /**
     * Register Demand/Loot button
     */
    WndHandlerFarmTownOverviews.prototype.registerButtonComponent = function() {
        var context = this.wnd.getContext(),
            has_active_farm = this.isAtLeastOneFarmActive();

        CM.unregister(context, 'claim_button');
        CM.register(context, 'claim_button', $('#fto_claim_button').button({
            caption: this.getButtonCaption(),
            disabled: !has_active_farm,
            state: !has_active_farm,
            tooltips: [{},
                {
                    title: this.getDisabledButtonTextTooltip()
                }
            ]
        }).on('btn:click', function() {
            if (this.selected_towns_count <= 0) {
                this.claimLoads();
            } else {
                this.handleClaimLoadsMultiple();
            }
        }.bind(this)));
    };

    /**
     * Check if there is at least one farm town which can be claimend or looted
     * @returns {boolean}
     */
    WndHandlerFarmTownOverviews.prototype.isAtLeastOneFarmActive = function() {
        var owned_farmtowns = $('.fto_list_entry.owned');
        return this.selected_towns_count > 0 || owned_farmtowns.hasClass('active');
    };

    /**
     * Get Tooltip text for disabled demand / loot button
     * @returns {*}
     */
    WndHandlerFarmTownOverviews.prototype.getDisabledButtonTextTooltip = function() {
        if (this.pillage_menu) {
            return _('The time for looting is not ripe again, you have to wait before you can loot a village under your control again.');
        } else if (Features.battlepointVillagesEnabled()) {
            return _('Collecting resources is currently not possible. Wait until a village you control is ready to provide resources again.');
        }

        return _('Demanding resources is currently not possible. Wait until a village you control is ready to provide resources again.');
    };

    /**
     * Add tooltip to every farm town which can not be claimed or looted
     * There can be two reasons:
     * 1. The farm town is in a cooldown status - was looted / claimed before
     * 2. The farm town does not belong to the player
     */
    WndHandlerFarmTownOverviews.prototype.addTooltipsToDisabledFarmTowns = function() {
        var disabled_owned_farm_towns = $('.fto_list_entry.owned.disabled'),
            not_owned_farm_towns = $('.fto_list_entry.not_owned'),
            farm_towns_which_should_get_tooltip = $.merge(disabled_owned_farm_towns, not_owned_farm_towns);

        farm_towns_which_should_get_tooltip.each(function(index, farm_town) {
            $(farm_town).tooltip(_('Currently not possible'));
        });
    };

    /**
     * bind events on tab menu
     */
    WndHandlerFarmTownOverviews.prototype.bindMenuEvents = function() {
        //bind tab click events
        $('#fto_claim').on("click", function() {
            this.pillage_menu = false;
            this.invalideData(true);
            this.selectAllFarms(true);
            this.changeMaxResources();
            this.registerButtonComponent();
        }.bind(this));

        // this tab / element is not there with new battle point villages
        var elem = $('#fto_pillage');
        if (elem.length) {
            elem.on("click", function() {
                this.pillageClick();
            }.bind(this));
        }
    };

    /**
     * bind events on town list
     */
    WndHandlerFarmTownOverviews.prototype.bindTownClick = function() {
        //fetch farm towns on click event and highlight the selected town
        $('#fto_town_list').off().on("click", function(e) {
            var target = $(e.target);
            var params = {};

            if (target.hasClass('town_checkbox')) {
                this.handleTownCheckboxClick(target);
            }

            if (this.selected_towns_count > 0) {
                return;
            }

            if (!target.hasClass('fto_town')) {
                target = $(target).parents('li');
            }

            // for some reason I cannot prevent bubbling ...
            if (!target.length || e.target.tagName === 'A') {
                return;
            }

            target.addClass('active').siblings('li').removeClass('active');

            this.island_x = params.island_x = target.data('island_x');
            this.island_y = params.island_y = target.data('island_y');
            this.current_town_id = params.current_town_id = target.data('town_id');
            this.booty_researched = params.booty_researched = target.data('booty_researched');
            this.diplomacy_researched = params.diplomacy_researched = target.data('diplomacy_researched');
            this.trade_office = params.trade_office = target.data('trade_office');

            //get the farm towns for the selected city
            this.getFarmTowns(params);
        }.bind(this));
    };

    /**
     * setup pillage menu
     */
    WndHandlerFarmTownOverviews.prototype.pillageClick = function() {
        this.pillage_menu = true;
        this.invalideData(true);

        if (this.farm_towns !== null) {
            this.selectAllFarms(true);
            this.changeMaxResources();
            this.registerButtonComponent();
        }
    };

    /**
     * Resets the resources counter offset of all towns
     *
     * @param object towns
     */
    WndHandlerFarmTownOverviews.prototype.initializeResourcesCounter = function(towns) {
        var step = 5000, // update every 5 seconds
            town,
            town_id;

        // use received data to update the single town objects
        for (town_id in towns) {
            if (towns.hasOwnProperty(town_id)) {
                if (!towns.hasOwnProperty(town_id)) {
                    continue;
                }

                town = towns[town_id];
            }
        }

        TM.unregister('WndHandlerFarmTownOverviews::initializeResourcesProductionCounter::timer');
        TM.register('WndHandlerFarmTownOverviews::initializeResourcesProductionCounter::timer', step, this.updateResources.bind(this));
    };

    /**
     * Updates the resources for all available towns. and updates html elements in the overviews
     * e.g. in the trade overview
     *
     */
    WndHandlerFarmTownOverviews.prototype.updateResources = function() {
        var resources = ['wood', 'stone', 'iron'],
            towns = ITowns.getTowns(),
            town,
            res,
            i,
            $town, $elem;

        var town_id;

        for (town_id in towns) {
            if (!towns.hasOwnProperty(town_id)) {
                continue;
            }

            town = towns[town_id];
            $town = this.$town_list.find('li.town' + town_id + ':not(.hidden)');

            if (!$town.length) {
                continue;
            }

            res = town.resources();
            i = resources.length;

            while (i--) {
                var id = resources[i];
                $elem = $town.find('span.fto_resource_count.' + id + ' span.count');

                if (parseInt(res[id], 10) >= parseInt(res.storage, 10)) {
                    $elem.addClass('town_storage_full');
                    $elem.html(res.storage);
                } else {
                    if ($elem.hasClass('town_storage_full')) {
                        $elem.removeClass('town_storage_full');
                    }
                    $elem.html(res[id]);
                }
            }
        }
    };

    // set the selected time option based on this.selected_time_option
    WndHandlerFarmTownOverviews.prototype.restoreTimeSelectionCheckbox = function() {
        if (!this.selected_time_option) {
            return;
        }
        var $el = this.wnd.getJQElement();
        var $opt = $el.find('.fto_' + this.selected_time_option).addClass('active');
        $opt.find('.checkbox').addClass('checked');
    };

    WndHandlerFarmTownOverviews.prototype.showRibbon = function(time) {
        var $ribbon = $($.find('.ribbon_wrapper'));

        $ribbon.removeClass('hidden');
        $ribbon.find('.unlock_time').text(time);
    };

    WndHandlerFarmTownOverviews.prototype.hideRibbon = function() {
        var $ribbon = $($.find('.ribbon_wrapper'));
        $ribbon.addClass('hidden');
    };

    WndHandlerFarmTownOverviews.prototype.toggleRibbon = function() {
        var $owned_farm_towns = $('.fto_list_entry.owned');
        if (this.isAtLeastOneFarmActive() || $owned_farm_towns.length === 0) {
            this.hideRibbon();
        } else {
            var filtered_farm_towns = this.getLootingFarmTowns(),
                next_lootable_farm_town = filtered_farm_towns.reduce(function(prev_farm_town, current_farm_town) {
                    return prev_farm_town.loot < current_farm_town.loot ? prev_farm_town : current_farm_town;
                });

            this.showRibbon(next_lootable_farm_town.lootable_human);
        }
    };

    WndHandlerFarmTownOverviews.prototype.getButtonCaption = function() {
        var checked_count = this.selected_towns_count || 1;

        if (this.pillage_menu) {
            return ngettext(_('Loot'), _('Loot all'), checked_count);
        } else if (Features.battlepointVillagesEnabled()) {
            return ngettext(__('verb|Collect'), _('Collect all'), checked_count);
        }

        return ngettext(__('verb|Demand'), _('Demand all'), checked_count);
    };

    WndHandlerFarmTownOverviews.prototype.bindSelectAll = function() {
        var $wrapper = $('.checkbox_wrapper');
        $wrapper.tooltip($wrapper.text().trim());

        $('.checkbox.select_all').off().on('click', function(e) {
            var $target = $(e.target),
                $checkboxes = this.$town_list.find('.town_checkbox'),
                is_checked;

            $target.toggleClass('checked');
            is_checked = $target.hasClass('checked');

            $checkboxes.each(function(index, el) {
                var $el = $(el);

                if (is_checked && $el.data('index') === 0) {
                    $el.addClass('checked');
                } else {
                    $el.removeClass('checked');
                }
            });

            this.handleSelectedTownsChange();
        }.bind(this));
    };

    WndHandlerFarmTownOverviews.prototype.handleTownCheckboxClick = function($checkbox) {
        var island_id = $checkbox.data('island_id'),
            $select_all = $('.checkbox.select_all');

        $select_all.toggleClass('checked', false);

        if (!$checkbox.hasClass('checked')) {
            var $town_checkboxes = this.$town_list.find('.town_checkbox[data-island_id="' + island_id + '"]');

            $town_checkboxes.each(function(index, el) {
                $(el).removeClass('checked');
            });
        }

        $checkbox.toggleClass('checked');
        this.handleSelectedTownsChange();
    };

    WndHandlerFarmTownOverviews.prototype.handleSelectedTownsChange = function() {
        var $overlay = $('.farm_list_overlay'),
            $claim_res = $('#fto_farm_claim_new_res');

        this.selected_towns_count = this.$town_list.find('.town_checkbox.checked').length;

        if (this.selected_towns_count > 0) {
            $overlay.show();
            $claim_res.hide();
            this.getFarmTownsFromMultipleTowns();
        } else {
            $overlay.hide();
            $claim_res.show();
            this.getFarmTowns({
                island_x: this.island_x,
                island_y: this.island_y,
                booty_researched: this.booty_researched,
                trade_office: this.trade_office,
                diplomacy_researched: this.diplomacy_researched
            });
        }

        CM.get(this.wnd.getContext(), 'claim_button').setCaption(this.getButtonCaption());
    };

    WndHandlerFarmTownOverviews.prototype.getFarmTownsFromMultipleTowns = function() {
        var selected_cities = this.getSelectedTowns(),
            params = {};

        params = {
            town_ids: selected_cities
        };

        this.wnd.ajaxRequestGet('farm_town_overviews', 'get_farm_towns_from_multiple_towns', params, function(_wnd, data) {
            this.towns_data = data.towns_data;

            $('#farm_town_wrapper').html(data.html);

            this.selected_time_option = $('.time_options_default .fto_time_checkbox.active').data('option');
            this.selected_time_option_loyalty = $('.time_options_loyalty .fto_time_checkbox.active').data('option');

            this.bindOptionsClick();
            this.calculateResourcesForMultipleTowns();
        }.bind(this));
    };

    WndHandlerFarmTownOverviews.prototype.calculateResourcesForMultipleTowns = function() {
        this.max_resources = 0;

        this.$town_list.find('.town_checkbox.checked').each(function(index, el) {
            var town_id = $(el).data('town_id'),
                loads_data = this.towns_data[town_id].loads_data;

            if (this.selected_time_option_loyalty && loads_data[this.selected_time_option_loyalty]) {
                this.max_resources += loads_data[this.selected_time_option_loyalty];
            } else if (this.selected_time_option && loads_data[this.selected_time_option]) {
                this.max_resources += loads_data[this.selected_time_option];
            }
        }.bind(this));

        $('#max_claim_resources').html('+' + this.max_resources);
    };

    WndHandlerFarmTownOverviews.prototype.getSelectedTowns = function() {
        var result = [];

        this.$town_list.find('.town_checkbox.checked').each(function(index, el) {
            result.push($(el).data('town_id'));
        });

        return result;
    };

    WndHandlerFarmTownOverviews.prototype.handleClaimLoadsMultiple = function() {
        if (this.selected_towns_count <= 0) {
            return;
        }

        ConfirmationWindowFactory.openConfirmationWasteResourcesFarmTowns(
            this.claimLoadsMultiple.bind(this), null
        );
    };

    WndHandlerFarmTownOverviews.prototype.bindScrollHandler = function() {
        this.$town_list.off('scroll').on('scroll', this.setItemsHidden.bind(this));
    };

    WndHandlerFarmTownOverviews.prototype.setItemsHidden = function() {
        var $items = this.$town_list.find('li.fto_town'),
            visible_area_bottom = this.$town_list.outerHeight();

        $items.toArray().forEach(function(item) {
            var $item = $(item),
                position = $item.position(),
                visible;

            position.bottom = position.top + $item.outerHeight(true);

            visible = (position.top >= 0 && position.top <= visible_area_bottom) ||
                (position.bottom >= 0 && position.bottom <= visible_area_bottom);

            $item.toggleClass('hidden', !visible);
        });
    };

    GPWindowMgr.addWndType('FARM_TOWN_OVERVIEWS', null, WndHandlerFarmTownOverviews, 1);
}());