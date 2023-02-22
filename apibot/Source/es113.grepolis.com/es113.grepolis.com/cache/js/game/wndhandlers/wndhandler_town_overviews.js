/* globals MM, CM, TM, DM, Game, GameEvents, hOpenWindow, GPWindowMgr, ITowns, isNumber, GameControllers,
CommandsOverview, TradeOverview, CultureOverview, GodsOverview, OuterUnitsOverview, HidesOverview, TooltipFactory */

(function() {
    'use strict';

    function WndHandlerTownOverviews(wndhandle) {
        this.wnd = wndhandle;
        this.controller = null;
        this.action = null;
    }

    WndHandlerTownOverviews.inherits(window.WndHandlerTowns);

    WndHandlerTownOverviews.prototype.getDefaultWindowOptions = function() {
        return {
            maxHeight: 570,
            maxWidth: 780,
            height: 570,
            width: 780,
            resizable: false,
            title: 'TownOverviews - XX',
            minimizable: true
        };
    };

    /**
     * Window Initialization
     *
     *  @param title String	=> window title
     *  @param UIopts Object	=> Jquery UI Options for the window
     *  variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerTownOverviews.prototype.onInit = function(title, UIopts, town_id) {
        UIopts.controller = UIopts.controller || 'town_overviews';
        this.controller = UIopts.controller;
        this.action = UIopts.overview_type;
        this.massRecruitController = null;
        this.wnd.requestContentGet(UIopts.controller, UIopts.overview_type, {
            'town_id': town_id
        });

        //Listen on the town group changes
        this.town_groups_collection = MM.getCollections().TownGroup[0];
        this.town_groups_collection.onTownGroupActivation(function(model) {
            hOpenWindow.refreshWindowIfOpened(GPWindowMgr.TYPE_TOWN_OVERVIEWS);
        }, this);

        return true;
    };

    WndHandlerTownOverviews.prototype.loadTab = function(controller, action) {
        this.controller = controller;
        this.action = action;

        this.onReload();

        return true;
    };

    WndHandlerTownOverviews.prototype.onReload = function() {
        if (this.action && this.controller) {
            this.unregisterEventListeners();
            this.wnd.requestContentGet(this.controller, this.action, {});
        }

        return true;
    };

    WndHandlerTownOverviews.prototype.onClose = function() {
        CM.unregisterSubGroup(this.wnd.getContext());

        TM.unregister('WndHandlerTownOverviews::initializeResourcesProductionCounter::timer');
        this.unregisterEventListeners();

        if (this.massRecruitController) {
            this.massRecruitController._destroy();
        }

        this.town_groups_collection.off(null, null, this);

        return true;
    };

    WndHandlerTownOverviews.prototype.onRcvData = function(data, controller, action) {
        var root = this.wnd.getJQElement();

        CM.unregisterSubGroup(this.wnd.getContext());

        this.controller = controller || this.controller;
        this.action = action || this.action;

        switch (action) {
            case 'trade_overview':
                // write data to itowns
                this.wnd.setContent2(data.tmpl2);
                this.tradeOverview = new TradeOverview(data.towns, data.town_tmpl, data.movements, data.mov_tmpl, this.wnd);
                this.wnd.getJQElement().children('div.gpwindow_content').addClass('fullwindow');
                break;
            case 'recruit_overview':
                //Makes window fullscreen
                root.children('div.gpwindow_content').addClass('fullwindow');

                if (this.massRecruitController) {
                    this.massRecruitController._destroy();
                }

                this.massRecruitController = new GameControllers.MassRecruitController({
                    el: root,
                    cm_context: this.wnd.getContext(),
                    models: this.wnd.getModels(),
                    collections: this.wnd.getCollections(),
                    templates: data.templates,
                    l10n: DM.getl10n('mass_recruit'),
                    preloaded_data: data.data
                });

                this.massRecruitController.renderPage();

                break;
            default:
                if (this.tradeOverview) {
                    this.tradeOverview.destroy();
                    delete this.tradeOverview;
                }
                this.wnd.getJQElement().children('div.gpwindow_content').removeClass('fullwindow');
                TM.unregister('WndHandlerTownOverviews::initializeResourcesProductionCounter::timer');

                if (data.l10n_culture) {
                    CultureOverview.setWndHandler(this.wnd);
                    CultureOverview.setl10n(data.l10n_culture);
                }

                this.wnd.setContent2(data.html);
                this.wnd.clearMenu();

                this.unregisterEventListeners();
                this.registerEventListeners();
                break;
        }

        //This should be refactored when all improvements are done
        if (controller === "town_overviews" && action === "gods_overview") {
            GodsOverview.init(data.templates, data.data);
        } else if (controller === "town_overviews" && action === "command_overview") {
            CommandsOverview.init(this.wnd, data);
        } else if (action === "outer_units") {
            OuterUnitsOverview.init(this.wnd, data);
        }
    };

    WndHandlerTownOverviews.prototype.getPage = function() {
        //	this.wnd.requestContent('town_info', arguments[0], {id: arguments[1]});
        return null;
    };

    /**
     * Resets the resources counter offset of all towns
     *
     * @param object towns
     */
    WndHandlerTownOverviews.prototype.initializeResourcesCounter = function(towns, hides) {
        var that = this;
        var step = 500;
        var town, town_id;
        var root = this.wnd.getJQElement(),
            html_spinner, limit, hide_limit;

        HidesOverview.hidesInfo = hides;

        // use received data to update the single town objects
        for (town_id in towns) {
            if (!towns.hasOwnProperty(town_id)) {
                continue;
            }

            town = towns[town_id];

            if (hides) {
                //Initialize spinner for each town
                hide_limit = hides[town.id].max_storage >= 0 ? hides[town.id].max_storage - hides[town.id].iron_stored : Infinity;
                limit = Math.min(hide_limit, town.resources.iron);
                html_spinner = root.find('#town_hide_' + town.id);

                if (html_spinner) {
                    HidesOverview.spinners[town.id] = html_spinner.spinner({
                        value: 0,
                        step: 500,
                        max: limit
                    });
                }
            }
        }

        if (!TM.exists('WndHandlerTownOverviews::initializeResourcesProductionCounter::timer')) {
            TM.register('WndHandlerTownOverviews::initializeResourcesProductionCounter::timer', step, function() {
                that.updateResources();
            });
        }
    };

    WndHandlerTownOverviews.prototype.towns = [];

    /**
     * Updates the resources for all available towns. and updates html elements in the overviews
     * e.g. in the trade overview
     *
     */
    WndHandlerTownOverviews.prototype.updateResources = function() {
        var resources = ['wood', 'stone', 'iron'],
            town, town_id,
            res,
            storage,
            i,
            elem, spinner, hide_limit, hides = HidesOverview.hidesInfo;

        if (this.towns.length === 0) {
            // load fresh town_ids
            this.towns = us.values(ITowns.getTowns());
        }

        town = this.towns.pop();
        town_id = town.getId();
        res = town.resources();
        i = resources.length;

        storage = res.storage;

        while (i--) {
            var resource_id = resources[i];

            if (this.controller === 'town_overviews' && this.action === 'towns_overview') {
                elem = $('#town_' + town_id + '_res .' + resource_id);
            } else {
                elem = $('#town_' + town_id + '_res .' + resource_id + ' .count');
            }

            if (!elem.length) {
                continue;
            }

            elem.toggleClass('town_storage_full', res[resource_id] >= storage);
            elem.html(res[resource_id]);

            //Update spinner limit in Hides Overview
            spinner = HidesOverview.spinners[town_id];

            if (spinner && resource_id === 'iron' && hides) {
                hide_limit = hides[town_id].max_storage >= 0 ? hides[town_id].max_storage - hides[town_id].iron_stored : Infinity;

                spinner.setMax(Math.min(hide_limit, parseInt(elem.html(), 10)));
            }
        }

        //update population and storage size for current town
        if (!isNumber(res.population)) {
            elem = $('#town_' + town_id + '_res .town_population .count');
            elem = (elem.length) ? elem : $('#town_' + town_id + '_res .town_population');
            elem = (elem.length) ? elem : $('#town_' + town_id + '_res .town_population_count');
            if (elem.length) {
                elem.html(res.population);
            }
        }

        elem = $('#town_' + town_id + '_tinfo .storage');
        elem = (elem.length) ? elem : $('#town_' + town_id + '_res .storage');

        if (elem.length) {
            elem.html(storage);
        }
    };

    WndHandlerTownOverviews.prototype.handleUnitUpdate = function(event) {
        if (event.type === GameEvents.town.units.change) {
            var units = ITowns.getTown(Game.townId).units(),
                unit_id,
                UnitNumbersHelper = require('helpers/unit_numbers');

            for (unit_id in units) {

                if (!units.hasOwnProperty(unit_id)) {
                    continue;
                }

                if (this.controller === 'town_overviews' && this.action === 'towns_overview') {
                    $('#units_div_' + Game.townId + ' .' + unit_id).html(UnitNumbersHelper.shortenNumber(units[unit_id]));
                } else {
                    $('#units_' + Game.townId + ' .unit_' + unit_id + ' .place_unit_black').html(units[unit_id]);
                    $('#units_' + Game.townId + ' .unit_' + unit_id + ' .place_unit_white').html(units[unit_id]);
                }
            }
        }
    };

    WndHandlerTownOverviews.prototype.registerEventListeners = function() {
        var that = this;

        switch (this.controller + '.' + this.action) {
            case 'town_overviews.command_overview':
                $.Observer(GameEvents.town.commands.update).subscribe(['WndHandlerTownOverviews'], function(e, data) {
                    that.onReload();
                });
                break;
            case 'town_overviews.unit_overview':
                $.Observer(GameEvents.town.units.change).subscribe(['WndHandlerTownOverviews'], function(e, data) {
                    that.handleUnitUpdate(e);
                });
                break;
            case 'town_overviews.gods_overview':
                $.Observer(GameEvents.favor.change).subscribe(['WndHandlerTownOverviews'], GodsOverview.updateFavorBar);
                break;
            case 'town_overviews.towns_overview':
                $.Observer(GameEvents.town.units.change).subscribe(['WndHandlerTownOverviews'], function(e, data) {
                    that.handleUnitUpdate(e);
                });

                // Create & show a unit card when hovering over the unit amount
                $('.units_div .towninfo').each(
                    function(key, element) {
                        $(element).hover(
                            function() {
                                $(this).tooltip(
                                    TooltipFactory.getUnitCard(
                                        $(this).data('type'), {
                                            amount: $(this).data('amount')
                                        }
                                    ), {},
                                    false
                                ).show();
                            }
                        );
                    }
                );

                break;
        }
    };

    WndHandlerTownOverviews.prototype.unregisterEventListeners = function() {
        $.Observer().unsubscribe(['WndHandlerTownOverviews']);
        $.Observer().unsubscribe(['building_place_js']);

        if (this.tradeOverview) {
            this.tradeOverview.destroy();
            delete this.tradeOverview;
        }
    };

    GPWindowMgr.addWndType('TOWN_OVERVIEWS', 'city_overview', WndHandlerTownOverviews, 1);
}());