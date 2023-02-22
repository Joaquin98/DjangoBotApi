/* global Game, GameDataHeroes */

define('prototype/tutorial/guide_step_helper', function(require) {
    'use strict';

    /** @var {GameDataFeatureFlags} */
    var GameDataFeatureFlags = require('data/features');

    /** @var {BuildingsEnum} */
    var BuildingsEnum = require('enums/buildings');

    /** @var {DirectionsEnum} */
    var DirectionsEnum = require('enums/directions');

    /** @var {QuestMarkersEnum} */
    var QuestMarkersEnum = require('enums/quest_markers');

    /** @var {UserGuideStepMarker} */
    var UserGuideStepMarker = require('prototype/tutorial/guide_steps_marker');

    /** @var {GameDataInstantBuy} */
    var GameDataInstantBuy = window.GameDataInstantBuy;

    var CITY_OVERVIEW = require('enums/layout_modes').CITY_OVERVIEW;
    var spend_resources = '.island_quest_details_window .spend_resources';

    var match_functions = {
        isCityOverviewActive: function() {
            return $('#index_map_image').length && (Game.layout_mode === undefined || Game.layout_mode === CITY_OVERVIEW);
        },
        isAnyMapActive: function() {
            return !($('#index_map_image').length) && (Game.layout_mode === undefined || Game.layout_mode !== CITY_OVERVIEW);
        },
        isIslandViewActive: function(el) {
            return $(el).length && $('.rb_map .island_view.checked').length;
        },
        areMapMovementsHidden: function(el) {
            return $(el).length && $('#map_movements').find('.movement_main').length === 0 ? 1 : 0;
        },
        isIslandViewActiveAndMapMovementsHidden: function(el) {
            return match_functions.isIslandViewActive(el) && match_functions.areMapMovementsHidden(el);
        },
        areMapMovementsHiddenAndAttackBtnDisabled: function(el) {
            return match_functions.isIslandViewActiveAndMapMovementsHidden(el) && $('.attack_spot .btn_attack:not(.clicked)').length;
        },
        isIslandViewActiveAndAttackWindowClosed: function(el) {
            if ($('.js-window-main-container:not(.minimized).attack_spot').length !== 0) {
                return match_functions.areMapMovementsHiddenAndAttackBtnDisabled(el);
            } else {
                return match_functions.isIslandViewActiveAndMapMovementsHidden(el);
            }
        },
        isAnyTrainableHero: function(el) {
            return $(el).length && GameDataHeroes.isAnyTrainableHero();
        },
        isQuestInspectorShown: function() {
            return $('#quest_inspector').length;
        },
        isElementVisible: function(el) {
            return $(el).length;
        },
        isCountdownRunning: function(el) {
            var cd_elm = $(el).find('.caption .curr');
            return match_functions.isElementVisible(el) && cd_elm.length && cd_elm.html() !== '' && cd_elm.html() !== '0:00:00';
        },
        isCountdownBannerHidden: function() {
            return $('#farm_town_wrapper .fto_farm_list .ribbon_wrapper.hidden').length;
        },
        isAcceptBtnVisible: function(el) {
            var unit_order_confirm = $('#unit_order_confirm');
            var accept_btn = $('.unit_details .btn_accept_order');
            return match_functions.isElementVisible(el) &&
                (unit_order_confirm.length && unit_order_confirm.css('visibility') !== 'hidden' ||
                    accept_btn.length && accept_btn.css('visibility') !== 'hidden');
        },
        isTooltipWithArrowWithoutCountdownVisible: function(el) {
            return $(el).length && $(el).find('.tooltip_with_arrow .type_building_queue:not(.tearing_down)').length === 0;
        },
        isAcademyWindowClosed: function(el) {
            return $(el).length && $('.js-window-main-container.classic_window.academy').length === 0;
        },
        isBarracksWindowClosed: function() {
            var old_barracks = $('.js-window-main-container:not(.minimized) #unit_order.js-barracks-docks'),
                new_barracks = $('.js-window-main-container:not(.minimized) .units_tabs .unit');
            return old_barracks.length === 0 && new_barracks.length === 0;
        },
        // only match if the amount of wood matches the maximum demanded wood
        doesAmountMatchDemandWood: function() {
            return $(spend_resources).length && $(spend_resources + ' .sp_wood input[type=text]').val() === $(spend_resources + ' .pb_send_wood .max').html();
        },
        doesAmountMatchDemandStone: function() {
            return $(spend_resources).length && $(spend_resources + ' .sp_stone input[type=text]').val() === $(spend_resources + ' .pb_send_stone .max').html();
        },
        doesAmountMatchDemandAllRes: function() {
            return $(spend_resources).length &&
                $(spend_resources + ' .sp_wood input[type=text]').val() === $(spend_resources + ' .pb_send_wood .max').html() &&
                $(spend_resources + ' .sp_stone input[type=text]').val() === $(spend_resources + ' .pb_send_stone .max').html() &&
                $(spend_resources + ' .sp_iron input[type=text]').val() === $(spend_resources + ' .pb_send_iron .max').html();
        }
    };

    /**
     *
     * @param {Window.GameModels.Progressable} quest_progressable
     * @constructor
     */
    function TutorialGuideStepHelper(quest_progressable) {
        this.quest = quest_progressable;
        this.user_guide_steps = [];
    }

    /**
     * @var {Window.GameModels.Progressable}
     */
    TutorialGuideStepHelper.prototype.quest = null;

    /**
     * @var {UserGuideStepMarker[]}
     */
    TutorialGuideStepHelper.prototype.user_guide_steps = [];

    TutorialGuideStepHelper.prototype.CSS_BASE = '.js-tutorial-';

    TutorialGuideStepHelper.prototype.MATCH_POSITION_IN_BUILDING_QUEUE_DONTCARE = 0;
    TutorialGuideStepHelper.prototype.MATCH_POSITION_IN_BUILDING_QUEUE_FIRST = 1;
    TutorialGuideStepHelper.prototype.MATCH_POSITION_IN_BUILDING_QUEUE_LAST = 2;

    /**
     * @param {boolean} active_arg
     * @returns {string}
     */
    TutorialGuideStepHelper.prototype.getConstructionModeMatch = function(active_arg) {
        var active = active_arg || false;
        var base = this.CSS_BASE + 'btn-construction-mode';

        if (active) {
            base += '.active';
        } else {
            base += ':not(.active)';
        }

        base += ':visible';

        return base;
    };

    /**
     * @param {string} building_id BuildingsEnum::* (BARRACKS, DOCKS, MAIN, ACADEMY)
     * @param {string} item_id research-, unit- oder building-id
     * @return {string}
     */
    TutorialGuideStepHelper.prototype.getConstructionQueueItemPremiumButtonMatch = function(building_id, item_id) {
        var base = this.getConstructionQueueItemMatch(building_id, item_id, this.MATCH_POSITION_IN_BUILDING_QUEUE_DONTCARE);
        base += ' ' + this.CSS_BASE + 'queue-item-btn-premium-action';

        if (GameDataFeatureFlags.isInstantBuyEnabled()) {
            base += '.type_instant_buy.type_free:not(.disabled)';
        } else if (GameDataFeatureFlags.isBuildCostReductionEnabled()) {
            base += '.type_time_reduction';
        }

        return base;
    };

    /**
     * @param {string} building_id BuildingsEnum::* (BARRACKS, DOCKS, MAIN, ACADEMY)
     * @param {string} item_id research-, unit- oder building-id
     * @return {string}
     */
    TutorialGuideStepHelper.prototype.getConstructionQueueItemProgressbarMatch = function(building_id, item_id) {
        var base = this.getConstructionQueueItemMatch(building_id, item_id, this.MATCH_POSITION_IN_BUILDING_QUEUE_DONTCARE);
        base += ' .js-item-progressbar';

        return base;
    };

    /**
     * @param {string} building_id BuildingsEnum::* (BARRACKS, DOCKS, MAIN, ACADEMY)
     * @param {string} item_id research-, unit- oder building-id
     * @param {number} [position_arg] TutorialGuideStepHelper::MATCH_POSITION_IN_BUILDING_QUEUE_*
     * @return {string}
     */
    TutorialGuideStepHelper.prototype.getConstructionQueueItemMatch = function(building_id, item_id, position_arg) {
        var position = position_arg || this.MATCH_POSITION_IN_BUILDING_QUEUE_DONTCARE;

        var base = this.getConstructionQueueMatch(building_id, false);
        base += ' ' + this.CSS_BASE + 'queue-item';

        if (item_id) {
            base += '.' + item_id;
        }

        switch (position) {
            case this.MATCH_POSITION_IN_BUILDING_QUEUE_FIRST:
                base += '.first_order';
                break;
            case this.MATCH_POSITION_IN_BUILDING_QUEUE_LAST:
                base += '.last_order';
                break;
        }

        return base;
    };

    /**
     * @param {string} building_id BuildingsEnum::* (BARRACKS, DOCKS, MAIN, ACADEMY)
     * @param {boolean} empty_arg
     * @return {string}
     */
    TutorialGuideStepHelper.prototype.getConstructionQueueMatch = function(building_id, empty_arg) {
        var empty = empty_arg || false;
        var base = this.CSS_BASE + 'construction-queue';

        var type = '';
        var subtype = '';

        switch (building_id) {
            case 'main':
                type = '.type_building_queue';
                break;
            case 'academy':
                type = '.type_research_queue';
                break;
            case 'barracks':
                type = '.type_unit_queue';
                subtype = '.barracks';
                break;
            case 'docks':
                type = '.type_unit_queue';
                subtype = '.docks';
                break;
        }

        if (empty) {
            base += '.empty_queue';
        } else {
            base += ':not(.empty_queue)';
        }

        return base + type + subtype;
    };

    /**
     * gets new and fresh step config object
     *
     * @param {string} selector
     * @return {UserGuideStepMarker}
     */
    TutorialGuideStepHelper.prototype.newUserGuideStepMarker = function(selector) {
        return new UserGuideStepMarker(selector);
    };

    /**
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addIslandViewUserGuide = function() {
        this.addUserGuideStep('.rb_map .island_view:not(.checked)', [
            this.newUserGuideStepMarker('.rb_map .island_view:not(.checked)')
            .direction(DirectionsEnum.NORTH_WEST)
            .offset(-10, -20)
        ], match_functions.isCityOverviewActive);

        return this;
    };

    /**
     * Points to the city view
     *
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addCityViewUserGuide = function() {
        this.addUserGuideStep('.rb_map .city_overview:not(.checked)', [
            this.newUserGuideStepMarker('.rb_map .city_overview:not(.checked)')
            .direction(DirectionsEnum.NORTH_WEST)
            .offset(-12, -25)
        ], match_functions.isAnyMapActive);

        return this;
    };

    /**
     * @param {boolean} order_max_arg if true point to order max, otherwise point to input
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addStoreIronUserGuideStep = function(order_max_arg) {
        var order_max = order_max_arg || false;

        this.addBuildingUserGuide('hide', DirectionsEnum.NORTH);

        if (order_max) {
            this.addUserGuideStep('.js-window-main-container:not(.minimized) #hide_espionage .order_max', [
                this.newUserGuideStepMarker('#hide_espionage .order_max')
                .direction(DirectionsEnum.SOUTH)
                .offset(0, 10)
            ]);
        } else {
            this.addUserGuideStep('.js-window-main-container:not(.minimized) #hide_espionage .order_input', [
                this.newUserGuideStepMarker('#hide_espionage .order_input')
                .direction(DirectionsEnum.NORTH)
                .offset(0, 5)
            ]);
        }

        this.addUserGuideStep('.js-window-main-container:not(.minimized) #hide_espionage .order_confirm', [
            this.newUserGuideStepMarker('#hide_espionage .order_confirm')
            .direction(DirectionsEnum.WEST)
        ]);

        return this;
    };

    /**
     * @param {String} type e.g. games
     */
    TutorialGuideStepHelper.prototype.addCelebrateGuideStep = function(type) {
        this.addBuildingUserGuide(BuildingsEnum.PLACE, DirectionsEnum.NORTH);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) #place_' + type, [
            this.newUserGuideStepMarker('#place_' + type + ' .button_new')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @param {String} menu_icon_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addTownMenuUserGuideStep = function(menu_icon_id) {
        this.addIslandViewUserGuide();

        this.addUserGuideStep('#map_towns #activetown', [
            this.newUserGuideStepMarker('.foreign_town_on_same_island')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 20)
        ], match_functions.isIslandViewActive);

        this.addUserGuideStep('#' + menu_icon_id, [
            this.newUserGuideStepMarker('#' + menu_icon_id)
            .direction(DirectionsEnum.NORTH)
            .offset(0, -10)
        ]);

        return this;
    };

    /**
     * @param {String} menu_icon_id
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addFarmTownMenuUserGuideStep = function(menu_icon_id) {
        this.addIslandViewUserGuide();

        this.addUserGuideStep('.tile.farmtown_owned.farmtown_owned_on_same_island:visible', [
            this.newUserGuideStepMarker('.tile.farmtown_owned.farmtown_owned_on_same_island')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ], match_functions.isIslandViewActive);

        this.addUserGuideStep('#' + menu_icon_id, [
            this.newUserGuideStepMarker('#' + menu_icon_id)
            .direction(DirectionsEnum.NORTH)
            .offset(0, 10)
        ]);

        return this;
    };

    /**
     * @param {String} tab_id
     * @param {String} menu_icon_id
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addFarmTownWindowUserGuideStep = function(tab_id, menu_icon_id) {
        menu_icon_id = menu_icon_id || 'claim_info';

        // technically this could be any menu icon, we just chose this one
        this.addFarmTownMenuUserGuideStep(menu_icon_id);

        // this will point to the real needed window tab
        this.addUserGuideStep('#' + tab_id + '.submenu_link:not(.active)', [
            this.newUserGuideStepMarker('.submenu_link#' + tab_id)
            .direction(DirectionsEnum.NORTH)
            .offset(0, 15)
        ]);

        return this;
    };

    /**
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addClaimLoadUserGuideStep = function() {
        this.addFarmTownWindowUserGuideStep('farm_town_info-claim_info', 'claim_info');

        this.addUserGuideStep('.bold.farm_claim', [
            this.newUserGuideStepMarker('.bold.farm_claim:first')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 15)
        ]);

        return this;
    };

    /**
     * @return {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addTradePlayerGuideStep = function() {
        var base = this.CSS_BASE + 'market-offers-table';
        var accept_base = this.CSS_BASE + 'offer-details';

        this.addBuildingUserGuide(BuildingsEnum.MARKET, DirectionsEnum.NORTH);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) ' + base, [
            this.newUserGuideStepMarker(base + ' .btn_details')
            .direction(DirectionsEnum.SOUTH_EAST)
            .parentDom(base)
            .offset(10, 10)
        ]);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) ' + accept_base, [
            this.newUserGuideStepMarker(accept_base + ' .btn_trade')
            .direction(DirectionsEnum.WEST)
            .parentDom(accept_base)
            .offset(0, -10)
        ]);

        return this;
    };

    /**
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addTradeFarmUserGuideStep = function() {
        if (GameDataFeatureFlags.battlepointVillagesEnabled()) {
            return this.addTradeBPVFarmUserGuideStep();
        }

        this.addFarmTownWindowUserGuideStep('farm_town_info-trading', 'trading');

        this.addUserGuideStep('.trade_slider_box .btn_trade', [
            this.newUserGuideStepMarker('.trade_slider_box .btn_trade')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        return this;
    };

    TutorialGuideStepHelper.prototype.addTradeBPVFarmUserGuideStep = function() {
        this.addIslandViewUserGuide();

        // map: first owned farm town
        this.addUserGuideStep('#wmap .farm_town.owned:first:visible', [
            this.newUserGuideStepMarker('#wmap .farm_town.owned:first:visible')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActive);

        // activate the first tab in the farm town
        this.addUserGuideStep('.js-window-main-container:not(.minimized).farm_town .action_tabs .trade.button_tab:not(.selected)', [
            this.newUserGuideStepMarker('.farm_town .action_tabs .trade.button_tab:not(.selected)')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        // first farm town resource claim button
        this.addUserGuideStep('.js-window-main-container:not(.minimized).farm_town .action_wrapper .btn_trade', [
            this.newUserGuideStepMarker('.farm_town .action_wrapper .btn_trade')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 80)
        ]);

        return this;
    };

    TutorialGuideStepHelper.prototype.addAttackSpotGuide = function(unit_id) {
        this.addIslandViewUserGuide();

        // map: attack spot
        this.addUserGuideStep('#map_attack_spots .attack_spot.attack_possible:visible', [
            this.newUserGuideStepMarker('#map_attack_spots .attack_spot.attack_possible')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActiveAndAttackWindowClosed);

        // attack_spot window: unit image
        this.addUserGuideStep('.js-window-main-container:not(.minimized).attack_spot .unit_picker_container [data-unit_id="' + unit_id + '"]', [
            this.newUserGuideStepMarker('.unit_picker_container [data-unit_id="' + unit_id + '"]')
            .parentDom('.window_content')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, -40)
        ], match_functions.areMapMovementsHiddenAndAttackBtnDisabled);

        // attack button in attack_spot window
        this.addUserGuideStep('.js-window-main-container:not(.minimized).attack_spot .btn_attack:not(.disabled)', [
            this.newUserGuideStepMarker('.attack_spot .btn_attack')
            .direction(DirectionsEnum.WEST)
            .offset(0, -10)
        ], match_functions.areMapMovementsHidden);

        // map: collect reward attack spot
        this.addUserGuideStep('#map_attack_spots .attack_spot.collect_reward:visible', [
            this.newUserGuideStepMarker('#map_attack_spots .attack_spot.collect_reward')
            .parentDom('#wmap')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActiveAndMapMovementsHidden);

        // Collect reward button
        this.addUserGuideStep('.js-window-main-container:not(.minimized).attack_spot_victory .btn_collect', [
            this.newUserGuideStepMarker('.attack_spot_victory .btn_collect')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        return this;
    };

    TutorialGuideStepHelper.prototype.buildBPVFarm = function() {
        this.addIslandViewUserGuide();

        // map: random farm town
        this.addUserGuideStep('#wmap .farm_town.locked[data-same_island="true"]:first:visible', [
            this.newUserGuideStepMarker('#wmap .farm_town.locked[data-same_island="true"]:first:visible')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActive);

        // unlock button in farm_town window
        this.addUserGuideStep('.js-window-main-container:not(.minimized).farm_town .btn_unlock:not(.disabled)', [
            this.newUserGuideStepMarker('.farm_town .btn_unlock')
            .parentDom('.window_content')
            .direction(DirectionsEnum.WEST)
            .offset(0, -35)
        ]);
        return this;
    };

    TutorialGuideStepHelper.prototype.collectBPVFarmResources = function() {
        this.addIslandViewUserGuide();

        // map: first owned farm town
        this.addUserGuideStep('#wmap .farm_town.owned:first:visible', [
            this.newUserGuideStepMarker('#wmap .farm_town.owned:first:visible')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActive);

        // activate the first tab in the farm town
        this.addUserGuideStep('.js-window-main-container:not(.minimized).farm_town .action_tabs .resources.button_tab:not(.selected)', [
            this.newUserGuideStepMarker('.farm_town .action_tabs .resources.button_tab:not(.selected)')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        // first farm town resource claim button
        this.addUserGuideStep('.js-window-main-container:not(.minimized).farm_town .action_wrapper .action_card:first .btn_claim_resources', [
            this.newUserGuideStepMarker('.farm_town .action_wrapper .action_card:first .btn_claim_resources')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        return this;
    };


    TutorialGuideStepHelper.prototype.upgradeBPVFarmVillage = function() {
        this.addIslandViewUserGuide();

        // map: first owned farm town
        this.addUserGuideStep('#wmap .farm_town.owned:first:visible', [
            this.newUserGuideStepMarker('#wmap .farm_town.owned:first:visible')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActive);

        // first farm town resource claim button
        this.addUserGuideStep('.js-window-main-container:not(.minimized).farm_town .btn_upgrade', [
            this.newUserGuideStepMarker('.farm_town .btn_upgrade')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 10)
        ]);

        return this;
    };

    /**
     * @param {String} island_quest_name
     *
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addIslandQuestGuideStep = function(island_quest_name) {
        var questlog_index = '.window_content .questlog_index';
        var questlog_detail = '.window_content .questlog_detail';
        var island_quest = questlog_index + ' .quest_list .quest[data-quest_name=' + island_quest_name + ']:not(.selected)';
        var island_quest_title = island_quest + ' .headline';
        var accept_button = questlog_detail + ' .island_quest_details .decision.good .btn_take_accept';
        var challenge_button = questlog_detail + ' .island_quest_details .decision .btn_challenge';
        var reward_button = questlog_detail + ' .island_quest_details .decision .gp_item_reward_all';

        this.addIslandViewUserGuide();
        this.addUserGuideStep('.tile.' + island_quest_name + '.island_quest:visible', [
            this.newUserGuideStepMarker('.tile.' + island_quest_name + '.island_quest')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActive);

        this.addUserGuideStep(island_quest_title, [
            this.newUserGuideStepMarker(island_quest_title)
            .direction(DirectionsEnum.WEST)
            .offset(-100, 0)
        ]);

        this.addUserGuideStep(accept_button, [
            this.newUserGuideStepMarker(accept_button)
            .direction(DirectionsEnum.EAST)
            .offset(-5, 0)
        ]);


        this.addUserGuideStep(challenge_button, [
            this.newUserGuideStepMarker(challenge_button)
            .direction(DirectionsEnum.EAST)
            .offset(-5, 0)
        ]);

        this.addQuestSpendResourcesGuideStep();

        this.addUserGuideStep(reward_button, [
            this.newUserGuideStepMarker(reward_button)
            .direction(DirectionsEnum.EAST)
            .offset(-5, 0)
        ]);

        this.addUserGuideStep('#item_reward_use', [
            this.newUserGuideStepMarker('#item_reward_use')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, -10)
        ]);

        return this;
    };

    /**
     * add steps to spend resources in island quests
     *
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addQuestSpendResourcesGuideStep = function() {
        var spend_resources = '.island_quest_details_window .spend_resources';

        this.addUserGuideStep(spend_resources + ' .wood', [
            this.newUserGuideStepMarker(spend_resources + ' .wood')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 10)
        ]);

        this.addUserGuideStep(spend_resources + ' .stone', [
            this.newUserGuideStepMarker(spend_resources + ' .stone')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 10)
            // only match if the amount of wood matches the maximum demanded wood
        ], match_functions.doesAmountMatchDemandWood);

        this.addUserGuideStep(spend_resources + ' .iron', [
            this.newUserGuideStepMarker(spend_resources + ' .iron')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 10)
            // only match if the amount of stone matches the maximum demanded stone
        ], match_functions.doesAmountMatchDemandStone);

        this.addUserGuideStep(spend_resources + ' .btn_send', [
            this.newUserGuideStepMarker(spend_resources + ' .btn_send')
            .direction(DirectionsEnum.NORTH)
            .offset(0, -30)
            .parentDom('.content.js-details-window-content')
            // only match if the amounts of resources matches the demanded amount
        ], match_functions.doesAmountMatchDemandAllRes);

        return this;
    };

    /**
     * @param {String} premium_window_menu_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addPremiumWindowUserGuideStep = function(premium_window_menu_id) {
        this.addUserGuideStep('.toolbar_buttons .premium', [
            this.newUserGuideStepMarker('.toolbar_buttons .premium')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 5)
        ]);

        this.addUserGuideStep('#overviews_link_hover_menu.show', [
            this.newUserGuideStepMarker('#overviews_link_hover_menu .' + premium_window_menu_id)
            .direction(DirectionsEnum.EAST)
            .offset(-160, -30) //exactly the negative offset of the hover menu
            .parentDom('#overviews_link_hover_menu')
        ]);

        return this;
    };

    /**
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addClaimLoadPremiumUserGuideStep = function() {
        this.addPremiumWindowUserGuideStep('farm_town_overview');

        this.addUserGuideStep('#farm_town_wrapper .fto_farm_list .ribbon_wrapper:not(.hidden)', [
            this.newUserGuideStepMarker('#farm_town_wrapper .fto_farm_list .ribbon_wrapper:not(.hidden) .ribbon_locked')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ], match_functions.isElementVisible);

        this.addUserGuideStep('#farm_town_wrapper .fto_farm_list .next_demand_time', [
            this.newUserGuideStepMarker('#farm_town_wrapper .fto_farm_list .next_demand_time')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ], match_functions.isCountdownBannerHidden);

        this.addUserGuideStep('#farm_town_wrapper .fto_farm_list a.checkbox.checked', [
            this.newUserGuideStepMarker('#fto_claim_button')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @param {String} god_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addChooseGodUserGuideSetp = function(god_id) {
        this.addBuildingUserGuide(BuildingsEnum.TEMPLE, DirectionsEnum.WEST);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) #temple_' + god_id, [
            this.newUserGuideStepMarker('#temple_' + god_id)
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
            .focusWindow('TYPE_BUILDING')
        ]);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) #temple_gods #temple_' + god_id, [
            this.newUserGuideStepMarker('#temple_gods #temple_' + god_id)
            .direction(DirectionsEnum.SOUTH)
            .offset(-9, -20)
            .parentDom('#temple_gods')
        ]);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) #temple_button .button:not(:hidden)', [
            this.newUserGuideStepMarker('#temple_button .button:not(:hidden)')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @param {String} power_id optional
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addCastPowerUserGuideStep = function(power_id) {
        power_id = power_id || null;

        this.addUserGuideStep('.btn_gods_spells', [
            this.newUserGuideStepMarker('.btn_gods_spells')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ]);

        this.addUserGuideStep('.god_containers:not(:hidden)', [
            this.newUserGuideStepMarker('.powers_container')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ]);

        if (power_id) {
            this.addUserGuideStep('.power_icon30x30.new_ui_power_icon.js-power-icon.' + power_id + ':visible', [
                this.newUserGuideStepMarker('.power_icon30x30.new_ui_power_icon.js-power-icon.' + power_id + ':visible')
                .direction(DirectionsEnum.EAST)
                .offset(0, 0)
            ]);
        }

        return this;
    };

    /**
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addTownNameGuideStep = function() {
        this.addUserGuideStep('.town_name_area', [
            this.newUserGuideStepMarker('.town_name_area')
            .direction(DirectionsEnum.NORTH)
            .offset(-114, -45)
        ]);

        return this;
    };

    /**
     * @param {String} menu_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addSettingsMenuUserGuideStep = function(menu_id) {
        this.addUserGuideStep('.gods_area_buttons .settings', [
            this.newUserGuideStepMarker('.gods_area_buttons .settings')
            .direction(DirectionsEnum.NORTH_EAST)
            .offset(0, -10)
        ]);

        this.addUserGuideStep('#' + menu_id, [
            this.newUserGuideStepMarker('#' + menu_id)
            .direction(DirectionsEnum.EAST)
            .offset(5, 0)
            .parentDom('.gpwindow_frame')
        ]);

        return this;
    };

    /**
     * points to main menu
     *
     * @param {String} menu_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addMainMenuGuideStep = function(menu_id) {
        this.addUserGuideStep('.nui_main_menu .' + menu_id, [
            this.newUserGuideStepMarker('.nui_main_menu .' + menu_id)
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 10)
        ]);

        return this;
    };

    /**
     * @param {String} research_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addResearchUserGuideStep = function(research_id) {
        this.addBuildingUserGuide(BuildingsEnum.ACADEMY, DirectionsEnum.EAST, match_functions.isAcademyWindowClosed);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) .tech_tree_box .button_upgrade[data-research_id=' + research_id + ']', [
            this.newUserGuideStepMarker('.js-window-main-container:not(.minimized) .tech_tree_box .button_upgrade[data-research_id=' + research_id + ']')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 5)
        ], match_functions.isElementVisible);

        if (GameDataInstantBuy.isEnabled()) {
            // match buy for free button
            this.addUserGuideStep(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.ACADEMY, research_id), [
                this.newUserGuideStepMarker(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.ACADEMY, research_id))
                .direction(DirectionsEnum.SOUTH)
                .offset(0, 0)
            ], match_functions.isElementVisible);
        }

        return this;
    };

    /**
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addAttackTownUserGuide = function() {
        this.addUserGuideStep('.rb_map .island_view:not(.checked)', [
            this.newUserGuideStepMarker('.rb_map .island_view:not(.checked)')
            .direction(DirectionsEnum.WEST)
            .offset(-10, 0)
        ], match_functions.isCityOverviewActive);

        this.addUserGuideStep('#map_towns #activetown', [
            this.newUserGuideStepMarker('.foreign_town_on_same_island')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ], match_functions.isIslandViewActive);

        this.addUserGuideStep('#attack', [
            this.newUserGuideStepMarker('#attack')
            .direction(DirectionsEnum.NORTH)
            .offset(60, -10)
        ]);

        return this;
    };

    /**
     * points to unconquered farm town and attack window
     *
     * @param {Array} unit_ids
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addAttackFarmUserGuide = function(unit_ids) {
        unit_ids = unit_ids || [];

        this.addIslandViewUserGuide();
        this.addUserGuideStep('.tile.farmtown_not_owned_on_same_island', [
            this.newUserGuideStepMarker('.tile.farmtown_not_owned_on_same_island')
            .direction(DirectionsEnum.EAST)
            .offset(-10, 0)
        ], match_functions.isIslandViewActive);

        for (var i = 0, l = unit_ids.length; i < l; i++) {
            var unit_id = unit_ids[i];

            this.addUserGuideStep('.js-window-main-container:not(.minimized) .unit.index_unit.bold#' + unit_id, [
                this.newUserGuideStepMarker('.unit.index_unit.bold#' + unit_id)
                .direction(DirectionsEnum.SOUTH)
                .offset(0, 10)
            ]);
        }

        this.addUserGuideStep('.js-window-main-container:not(.minimized) .farm_attack_troops .unit_input.with_value', [
            this.newUserGuideStepMarker('.send_units_form a[name="send_units"]')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ]);

        this.addUserGuideStep('#icon_movement .commands_count', [
            this.newUserGuideStepMarker('#icon_movement')
            .offset(0, 0)
            .type(QuestMarkersEnum.HIGHLIGHT)
            .expand(-10, -10)
            .fixPosition(true)
        ]);

        return this;
    };

    /**
     * add user guide step that points to buy/extend advisor
     *
     * @param {String} advisor_id DataPremiumFeatures::TYPE_*
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addAdvisorUserGuide = function(advisor_id) {
        this.addUserGuideStep('.ui_advisors .' + advisor_id, [
            this.newUserGuideStepMarker('.ui_advisors .' + advisor_id)
            .parentDom('.nui_left_box')
            .direction(DirectionsEnum.NORTH)
            .offset(5, -70)
        ]);

        this.addUserGuideStep('.js-turorial-arrows-advisors', [
            this.newUserGuideStepMarker('.js-turorial-arrows-advisors .js-extend-button.' + advisor_id)
            .direction(DirectionsEnum.SOUTH_EAST)
            .offset(0, 5)
        ]);

        return this;
    };

    /**
     * pointer to units building and unit
     *
     * @param {String} building_id
     * @param {String} unit_id
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addRecruitUnitUserGuide = function(building_id, unit_id) {
        this.addBuildingUserGuide(building_id, null, match_functions.isBarracksWindowClosed);

        // old barracks
        this.addUserGuideStep('.js-window-main-container:not(.minimized) #unit_order_tab_' + unit_id, [
            this.newUserGuideStepMarker('#unit_order_tab_' + unit_id)
            .parentDom('.gpwindow_content')
            .direction(DirectionsEnum.NORTH)
            .offset(0, -40)
        ], match_functions.isAcceptBtnVisible);

        // new barracks
        this.addUserGuideStep('.js-window-main-container:not(.minimized) .units_tabs .unit.' + unit_id, [
            this.newUserGuideStepMarker('.units_tabs .unit.' + unit_id)
            .parentDom('.window_content')
            .direction(DirectionsEnum.NORTH)
            .offset(0, -40)
        ], match_functions.isAcceptBtnVisible);

        // old barracks, new barracks
        this.addUserGuideStep('.js-window-main-container:not(.minimized) #unit_order_unit_name.' + unit_id + ', .js-window-main-container:not(.minimized) .units_tabs .unit.' + unit_id + '.selected', [
            this.newUserGuideStepMarker('#unit_order_confirm, .unit_details .btn_accept_order')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ], match_functions.isAcceptBtnVisible);

        // old barracks, new barracks
        this.addUserGuideStep('.js-window-main-container:not(.minimized) .unit_order_task.' + unit_id + ', .js-window-main-container:not(.minimized) .unit_orders .order.unit_' + unit_id, [
            this.newUserGuideStepMarker('.unit_order_task, .unit_orders .order.unit_' + unit_id)
            .type(QuestMarkersEnum.HIGHLIGHT)
            .offset(2, 0)
            .expand(-20, -20)
            .fixPosition()
        ]);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addTrainHeroGuideStep = function() {
        this.addUserGuideStep('#ui_heroes_overview', [
            this.newUserGuideStepMarker('#ui_heroes_overview')
            .direction(DirectionsEnum.EAST)
            .offset(20, 0)
        ], match_functions.isAnyTrainableHero);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) .heroes', [
            this.newUserGuideStepMarker('.tab.overview')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 5)
        ], match_functions.isAnyTrainableHero);

        this.addUserGuideStep('.js-window-main-container:not(.minimized).heroes .heroes_overview', [
            this.newUserGuideStepMarker('.the_lowest_level_hero .btn_send_resources.level_up')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ], match_functions.isAnyTrainableHero);

        this.addUserGuideStep('.heroes_train .use_coins', [
            this.newUserGuideStepMarker('.heroes_train .use_coins')
            .direction(DirectionsEnum.SOUTH)
            .offset(73, 0)
        ], match_functions.isAnyTrainableHero);

        this.addUserGuideStep('.btn_gods_spells.active', [
            this.newUserGuideStepMarker('.btn_gods_spells.active')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addAssignHeroGuideStep = function() {
        this.addUserGuideStep('#ui_heroes_overview', [
            this.newUserGuideStepMarker('#ui_heroes_overview')
            .direction(DirectionsEnum.EAST)
            .offset(10, 0)
        ]);

        this.addUserGuideStep('.js-window-main-container:not(.minimized).heroes', [
            this.newUserGuideStepMarker('.tab.overview:not(.selected)')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 0)
        ]);

        this.addUserGuideStep('.btn_hero_not_assigned', [
            this.newUserGuideStepMarker('.btn_hero_not_assigned')
            .direction(DirectionsEnum.WEST)
            .offset(0, 5)
        ]);

        this.addUserGuideStep('.btn_gods_spells.active', [
            this.newUserGuideStepMarker('.btn_gods_spells.active')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addReduceBuildTimeGuideStep = function() {
        this.addBuildBuildingUserGuide(BuildingsEnum.MAIN, DirectionsEnum.NORTH);

        this.addUserGuideStep(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.MAIN, null), [
            this.newUserGuideStepMarker(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.MAIN, null))
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ], match_functions.isElementVisible);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addPhoenicianSalesmanGuideStep = function() {
        this.addBuildingUserGuide(BuildingsEnum.DOCKS, DirectionsEnum.NORTH);

        this.addUserGuideStep('.js-window-main-container:not(.minimized) #unit_order_ph_background', [
            this.newUserGuideStepMarker('#unit_order_ph_background')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addInviteFriendsGuideStep = function() {
        this.addMainMenuGuideStep('invite_friends');

        this.addUserGuideStep('#invite_buttons', [
            this.newUserGuideStepMarker('#invite_buttons')
            .direction(DirectionsEnum.WEST)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addEditProfileGuideStep = function() {
        this.addMainMenuGuideStep('profile');

        this.addUserGuideStep('.submenu_link#player_profile-index', [
            this.newUserGuideStepMarker('.submenu_link#player_profile-index')
            .direction(DirectionsEnum.NORTH)
            .offset(0, 15)
        ]);

        this.addUserGuideStep('#edit_profile_form', [
            this.newUserGuideStepMarker('#edit_profile_form')
            .direction(DirectionsEnum.WEST)
            .offset(10, 0),
            this.newUserGuideStepMarker('.game_footer .change_profile')
            .direction(DirectionsEnum.SOUTH)
            .offset(10, 0)
        ]);

        return this;
    };

    /**
     * @returns {TutorialGuideStepHelper}
     */
    TutorialGuideStepHelper.prototype.addRegisterFieldUserGuide = function() {
        this.addSettingsMenuUserGuideStep('player-email_validation');

        this.addUserGuideStep('.player_settings .request_code .button', [
            this.newUserGuideStepMarker('.player_settings .request_code .button')
            .direction(DirectionsEnum.WEST)
            .offset(0, 0)
        ]);

        return this;
    };

    /**
     * get predefined user guide for a building on the fullscreen
     *
     * @param {String} building_id
     * @param {String} [building_pointer_direction]
     * @param {Function} match
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addBuildingUserGuide = function(building_id, building_pointer_direction, match) {
        building_pointer_direction = building_pointer_direction || DirectionsEnum.SOUTH;
        match = match || match_functions.isElementVisible;

        this.addCityViewUserGuide();

        this.addUserGuideStep('.viewport.js-city-overview-buildings-container .city_overview_building[data-id=' + building_id + ']', [
            this.newUserGuideStepMarker('.viewport.js-city-overview-buildings-container .city_overview_building[data-id=' + building_id + ']')
            .direction(building_pointer_direction)
            .offset(0, 0)
        ], match);

        this.addUserGuideStep(this.getConstructionModeMatch(true), [
            this.newUserGuideStepMarker(this.getConstructionModeMatch(true))
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        return this;
    };

    TutorialGuideStepHelper.prototype.addStartTutorialUserGuide = function() {
        this.addCityViewUserGuide();

        this.addUserGuideStep('#icons_container_left .questlog_icon.finished', [
            this.newUserGuideStepMarker('#icons_container_left .questlog_icon.finished')
            .direction(DirectionsEnum.WEST)
            .offset(0, 0)
        ]);

        this.addUserGuideStep('#quest_inspector .btn_action', [
            this.newUserGuideStepMarker('#quest_inspector .btn_action')
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        this.addUserGuideStep(this.getConstructionModeMatch(false), [
            this.newUserGuideStepMarker(this.getConstructionModeMatch(false))
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        var building_id = BuildingsEnum.LUMBER;

        this.addUserGuideStep('.city_overview_overlay.' + building_id, [
            this.newUserGuideStepMarker('.city_overview_overlay.' + building_id + ' .btn_build')
            .direction(DirectionsEnum.EAST)
            .offset(0, 0)
        ], match_functions.isTooltipWithArrowWithoutCountdownVisible);

        if (GameDataInstantBuy.isEnabled()) {
            // match buy for free button
            this.addUserGuideStep(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.MAIN, building_id), [
                this.newUserGuideStepMarker(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.MAIN, building_id))
                .direction(DirectionsEnum.SOUTH)
                .offset(0, 0)
            ], match_functions.isElementVisible);
        } else {
            // match building order
            this.addUserGuideStep(this.getConstructionQueueItemMatch(BuildingsEnum.MAIN, building_id), [
                this.newUserGuideStepMarker(this.getConstructionQueueItemMatch(BuildingsEnum.MAIN, building_id))
                .type(QuestMarkersEnum.HIGHLIGHT)
                .offset(10, -10)
                .expand(5, 5)
            ]);
        }

        return this;
    };

    /**
     * get predefined user guide for building buildings
     *
     * @param {String} building_id
     * @param {String} build_building_pointer_direction building pointer direction
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addBuildBuildingUserGuide = function(building_id, build_building_pointer_direction) {
        build_building_pointer_direction = build_building_pointer_direction || DirectionsEnum.NORTH;

        this.addCityViewUserGuide();

        this.addUserGuideStep(this.getConstructionModeMatch(false), [
            this.newUserGuideStepMarker(this.getConstructionModeMatch(false))
            .direction(DirectionsEnum.SOUTH)
            .offset(0, 0)
        ]);

        this.addUserGuideStep('.city_overview_overlay.' + building_id, [
            this.newUserGuideStepMarker('.city_overview_overlay.' + building_id + ' .btn_build')
            .direction(build_building_pointer_direction)
            .offset(0, 0)
        ], match_functions.isTooltipWithArrowWithoutCountdownVisible);

        if (GameDataInstantBuy.isEnabled()) {

            this.addUserGuideStep(this.getConstructionQueueItemProgressbarMatch(BuildingsEnum.MAIN, building_id), [
                this.newUserGuideStepMarker(this.getConstructionQueueItemProgressbarMatch(BuildingsEnum.MAIN, building_id))
                .direction(DirectionsEnum.SOUTH)
                .offset(0, 0)
            ], match_functions.isCountdownRunning);

            // match buy for free button
            this.addUserGuideStep(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.MAIN, building_id), [
                this.newUserGuideStepMarker(this.getConstructionQueueItemPremiumButtonMatch(BuildingsEnum.MAIN, building_id))
                .direction(DirectionsEnum.SOUTH)
                .offset(0, 0)
            ], match_functions.isElementVisible);
        } else {
            // match building order
            this.addUserGuideStep(this.getConstructionQueueItemMatch(BuildingsEnum.MAIN, building_id), [
                this.newUserGuideStepMarker(this.getConstructionQueueItemMatch(BuildingsEnum.MAIN, building_id))
                .type(QuestMarkersEnum.HIGHLIGHT)
                .offset(10, -10)
                .expand(5, 5)
            ]);
        }

        return this;
    };

    /**
     * @return {UserGuideStepMarker[]}
     */
    TutorialGuideStepHelper.prototype.getUserGuideSteps = function() {
        return this.user_guide_steps;
    };

    /**
     * add one step to the user guiding - the new way
     *
     * @param {String} match_selector - determines when this step gets executed
     * @param {UserGuideStepMarker[]} steps - actual steps to show
     * @param {String} [match_function]
     * @return TutorialGuideStepHelper
     */
    TutorialGuideStepHelper.prototype.addUserGuideStep = function(match_selector, steps, match_function) {
        steps = steps || [];
        match_function = match_function || false;

        var progressable_id = this.quest.getProgressableId();

        var modified_steps = steps.map(function(step) {
            var step_array = step.toArray();
            step_array.progressable_id = progressable_id;
            return step_array;
        });

        this.user_guide_steps.push({
            search: match_selector,
            search_function: match_function,
            show: modified_steps
        });

        return this;
    };

    return TutorialGuideStepHelper;
});