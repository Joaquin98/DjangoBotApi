/* global GameDataInstantBuy, HelperBrowserEvents, HelperGame, BuyForGoldWindowFactory */
(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var cm_sub_context_normal = 'normal_mode_components'; // Hammer not pressed
    var cm_sub_context_pressed = 'pressed_mode_components'; // Hammer pressed

    var GameFeatures = require('data/features');
    var BrowserHelper = require('helpers/browser');

    var LayoutCityConstructionOverlay = BaseView.extend({
        $parent: null,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);
            this.$parent = options.$parent;

            this.registerUIListeners(); // Call it only once because these events will not change
            this.render();
        },

        render: function() {
            this.controller.unregisterComponent(GameDataInstantBuy.TOOLTIP_COMPONENT_NAME);
            this.controller.unregisterComponents(cm_sub_context_normal);
            this.controller.unregisterComponents(cm_sub_context_pressed);

            this.$el.html('<div class="viewport">' + this.getOverlayItems() + '</div>');

            this.registerOverlayComponents();
        },

        /**
         * Registers components used in the overlay
         */
        registerOverlayComponents: function() {
            if (GameDataInstantBuy.isEnabled() && !this.controller.isConstructionModeEnabled()) {
                this.registerNormalModeComponents();
            } else {
                this.registerConstructionModeOverlayComponents();
            }
        },

        /**
         * Returns string which represents items on the overlay
         *
         * @return {String}
         */
        getOverlayItems: function() {
            if (GameDataInstantBuy.isEnabled() && !this.controller.isConstructionModeEnabled()) {
                return this.getNormalModeItems();
            } else {
                return this.getConstructionModeOverlayItems();
            }
        },

        /**
         * Returns items which are displayed when hammer is not pressed
         *
         * @return {String}
         */
        getNormalModeItems: function() {
            var orders_to_render = this.controller.getNormalModeOrders();

            var template = '';

            for (var building_id in orders_to_render) {
                if (orders_to_render.hasOwnProperty(building_id)) {
                    template += this.getTemplate('frame_instant_buy', {
                        building_id: building_id,
                        primary_order: orders_to_render[building_id].primary_order,
                        secondary_order: orders_to_render[building_id].secondary_order,
                        secondary_order_icon_name: this.controller.getSecondaryOrderIconName(building_id),
                        controller: this.controller
                    });
                }
            }

            return template;
        },

        /**
         * Returns items which are displayed when the hammer is pressed
         *
         * @return {String}
         */
        getConstructionModeOverlayItems: function() {
            var building,
                buildings_to_render = this.controller.getConstructedBuildings();

            var template = '';

            for (var i = 0, l = buildings_to_render.length; i < l; i++) {
                building = buildings_to_render[i];

                template += this.getTemplate('frame', {
                    building: building,
                    controller: this.controller,
                    buildTimeReductionEnabled: GameFeatures.isBuildCostReductionEnabled()
                });
            }

            return template;
        },

        onClickOpenContainerButton: function(building_id) {
            var building = this.controller.getConstructionOverlayItemContainer(building_id);

            var $overlay = this.$el.find('.city_overview_overlay.' + building_id),
                $container = $overlay.find('.js-content-area');

            //Store information whether the building container should be opened or not
            this.controller.setSpecialBuildingPressed(building_id);

            $overlay.addClass(building_id + '_container');

            $container.html(this.getTemplate('container', {
                building_ids: building.getSubBuildings(),
                controller: this.controller,
                show_title: false,
                buildTimeReductionEnabled: GameFeatures.isBuildCostReductionEnabled(),
                isIE: BrowserHelper.isIE()
            }));

            if (GameFeatures.isBuildCostReductionEnabled()) {
                this.registerReduceButtonsForSpecialBuildings(building_id);
            }

            this.dimOtherBuildings(building_id);
        },

        onClickCloseContainerButton: function(building_id) {
            var building = this.controller.getConstructionOverlayItemContainer(building_id);

            var $overlay = this.$el.find('.city_overview_overlay.' + building_id),
                $container = $overlay.find('.js-content-area');

            //Store information whether the building container should be opened or not
            this.controller.setSpecialBuildingUnPressed(building_id);

            $overlay.removeClass(building_id + '_container');

            $container.html(this.getTemplate('container', {
                building: building,
                building_ids: building.getSubBuildings(),
                controller: this.controller,
                show_title: true
            }));

            this.controller.unregisterComponents('special_' + building_id);

            this.undimOtherBuildings(building_id);
        },

        registerUIListeners: function() {
            var sub_context = this.controller.getSubContext(),
                on_click_event_name = HelperBrowserEvents.getOnClickEventName(sub_context),
                on_mouseover_event_name = HelperBrowserEvents.getOnMouseOverEventName(sub_context);

            this.$el.off(on_click_event_name);
            this.$el.off(on_mouseover_event_name);

            //Button build building
            this.$el.on(on_click_event_name, '.btn_build', function(e) {
                var $target = $(e.currentTarget),
                    building_id = $target.data('building_id');

                //Don't close the menu when button is disabled
                if ($target.hasClass('disabled')) {
                    return;
                }

                this.controller.upgradeBuilding(building_id);
                // make sure all containers are closed and the other buildings are not dimmed
                this.controller.resetSpecialBuildiungPressedStates();
                this.closeSpecialBuildingOverlay();
            }.bind(this));

            //Button build building tooltip
            this.$el.on(HelperBrowserEvents.getOnMouseOverEventName(sub_context), '.btn_build', function(e) {
                var $target = $(e.currentTarget),
                    building_id = $target.data('building_id'),
                    building = this.controller.getConstructionOverlayItemBuilding(building_id);

                $target.tooltip(building.getBuildButtonToolTip()).showTooltip(e);
            }.bind(this));

            //Button to open special buildings list
            this.$el.on(on_click_event_name, '.btn_open_container', function(e) {
                var $target = $(e.currentTarget),
                    building_id = $target.data('building_id');

                this.onClickOpenContainerButton(building_id);
            }.bind(this));

            //Button to open special buildings list
            this.$el.on(on_click_event_name, '.btn_close_container', function(e) {
                var $target = $(e.currentTarget),
                    building_id = $target.data('building_id');

                this.onClickCloseContainerButton(building_id);
            }.bind(this));
        },

        closeSpecialBuildingOverlay: function() {
            this.onClickCloseContainerButton('special1');
            this.onClickCloseContainerButton('special2');
        },

        registerNormalModeComponents: function() {
            var orders_to_render = this.controller.getNormalModeOrders();
            var sub_context = cm_sub_context_normal;

            for (var building_id in orders_to_render) {
                if (orders_to_render.hasOwnProperty(building_id)) {
                    var primary_order = orders_to_render[building_id].primary_order;
                    var secondary_order = orders_to_render[building_id].secondary_order;

                    var $frame = this.$el.find('.construction_overlay_frame_instant_buy.' + building_id);

                    //Register progressbar for primary order
                    if (primary_order) {
                        this.registerBuildingProgressbar(primary_order, $frame.find('.item.primary .small_progressbar'), sub_context);
                    }

                    //Register progressbar for secondary order
                    if (secondary_order) {
                        this.registerBuildingProgressbar(secondary_order, $frame.find('.item.secondary .small_progressbar'), sub_context);
                    }
                }
            }

            //Instant buy tooltip
            var instant_buy_tooltip = this.controller.registerComponent(GameDataInstantBuy.TOOLTIP_COMPONENT_NAME, this.$el.instantBuyTooltip({
                selector: '.construction_overlay_frame_instant_buy .item',
                arrow_position: 'bottom-center'
            }));

            instant_buy_tooltip.on('ibt:load:data', function(e, _ibt, $content, $item) {
                this._loadDataToTooltip($content, $item);
            }.bind(this)).on('ibt:destroy', function( /*e, _ibt*/ ) {
                this.controller.unregisterComponents(GameDataInstantBuy.SUB_CONTEXT_NAME);
            }.bind(this));
        },

        _loadDataToTooltip: function($content, $item) {
            var order_id = $item.data('order_id'),
                queue_type = $item.data('queue_type'),
                unit_kind = $item.data('unit_kind') || null,
                progressbar_order_index = 0, //We want to see progressbar
                premium_button_order_index = 1; //We want to always have button in the tooltips

            var strategy = this.controller.getOrderStrategy(queue_type, unit_kind);
            var order = strategy.getOrderById(order_id);

            GameDataInstantBuy.loadInstantBuyTooltipContent(strategy, this.controller, $content, order, progressbar_order_index, premium_button_order_index);
        },

        registerConstructionModeOverlayComponents: function() {
            var sub_context = cm_sub_context_pressed;

            if (GameFeatures.isBuildCostReductionEnabled()) {
                this.registerReduceButtons(this.controller.getConstructedBuildings(), sub_context);
            }

            //Progressbar and countdown
            var first_building_order = this.controller.getFirstBuildingOrderInQueue();

            if (first_building_order) {
                var first_building_id = first_building_order.getBuildingId(),
                    $first_building_order = this.$el.find('.city_overview_overlay.' + first_building_id),
                    $progressbar = $first_building_order.find('.js-progressbar'),
                    $button = $first_building_order.find('.btn_premium_action');

                //Initialize countdown
                this.controller.registerComponent('order_countdown_' + first_building_id, $first_building_order.find('.countdown').countdown2({
                    value: first_building_order.getTimeLeft()
                }).on('cd:finish', function() {
                    if (!HelperGame.constructFromCityOverview()) {
                        //NotificationLoader.resetNotificationRequestTimeout(1000);
                    }
                }), sub_context);
                if (first_building_order.getTimeLeft() > 0) {
                    //Initialize progressbar
                    this.registerBuildingProgressbar(first_building_order, $progressbar, sub_context);

                    //Initialize premium button
                    this.registerPremiumButton(first_building_order, $button, sub_context);
                }
            }
        },

        registerPremiumButton: function(order, $button, sub_context) {
            GameDataInstantBuy.initializePremiumButton(this.controller.getStrategy('building_queue'), this.controller, $button, order, sub_context);

            $button.show();
        },

        registerBuildingProgressbar: function(order, $progressbar, sub_context) {
            //The strategy here is different than in the different places, because GD wants to have the same progressbar (from instant buy) in 'instant buy' and 'time reduction'
            GameDataInstantBuy.initializeProgressbar(this.controller.getStrategy('building_queue_instant_buy'), this.controller, $progressbar, order, sub_context);

            $progressbar.show();
        },

        registerReduceButtonsForSpecialBuildings: function(special_building_id) {
            var special_sub_context = 'special_' + special_building_id,
                special_building = this.controller.getConstructionOverlayItemContainer(special_building_id, special_sub_context),
                sub_buildings = special_building.getSubBuildings(),
                buildings_to_render = [];

            for (var i = 0, l = sub_buildings.length; i < l; i++) {
                buildings_to_render.push(this.controller.getConstructionOverlayItemBuilding(sub_buildings[i]));
            }

            this.controller.unregisterComponents(special_sub_context);
            this.registerReduceButtons(buildings_to_render, special_sub_context);
        },

        registerReduceButtons: function(buildings_to_render, sub_context) {
            var $box, building, building_id,
                on_click_event_name = HelperBrowserEvents.getOnClickEventName(sub_context);

            //On click
            var onBtnReduceClick = function(building, e, _btn) {

                if (building.isUpgradeableWithGold()) {
                    var costs = building.getReducedBuildingBuildCosts();

                    BuyForGoldWindowFactory.openReductBuildingBuildCostForGoldWindow(_btn, costs, function() {
                        building.upgradeWithCostReduction();
                    }.bind(this, building));
                }
            };

            //On mouse over
            var onBtnReduceMouseOver = function(building, e) {
                var $button = $(e.currentTarget),
                    tooltip = building.getReduceButtonToolTip();

                $button.tooltip(tooltip).showTooltip(e);
            };

            for (var i = 0, l = buildings_to_render.length; i < l; i++) {
                building = buildings_to_render[i];
                building_id = building.getId();

                $box = this.$el.find('.' + building_id);

                //Buttons which are inside containers are handled in the moment when container is being shown
                if (!building.isContainer()) {
                    this.controller.registerComponent('btn_reduce_' + building_id, $box.find('.btn_reduce').button({
                            template: 'none',
                            caption: '',
                            disabled: !building.isUpgradeableWithGold()
                        })
                        .on(on_click_event_name, onBtnReduceClick.bind(this, building))
                        .on(HelperBrowserEvents.getOnMouseOverEventName(sub_context), onBtnReduceMouseOver.bind(this, building)), sub_context);
                }
            }
        },

        undimOtherBuildings: function(building_id) {
            var exclude = ':not(.' + building_id + ',.' + building_id + '_container' + ')';
            var $all_other_containers = this.$el.find('.city_overview_overlay' + (building_id ? exclude : ''));

            $all_other_containers.removeClass('dimmed');
            $all_other_containers.each(function(idx, val) {
                $(val).find('.button_area').show();
            });
        },

        dimOtherBuildings: function(building_id) {
            var exclude = ':not(.' + building_id + ',.' + building_id + '_container' + ')';
            var $all_other_containers = this.$el.find('.city_overview_overlay' + (building_id ? exclude : ''));

            $all_other_containers.addClass('dimmed');
            $all_other_containers.each(function(idx, val) {
                $(val).find('.button_area').hide();
            });
        },

        destroy: function() {
            //Remove all elements from inside
            this.$el.off().empty();
        }
    });

    window.GameViews.LayoutCityConstructionOverlay = LayoutCityConstructionOverlay;
}());