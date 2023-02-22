/*globals us, Game, MM, DM, ConstructionQueueHelper, GameData, HelperBrowserEvents */


// TODO rename this file...it's about premium functions, not instant buy
(function(window) {
    'use strict';

    var GameDataInstantBuy = {
        SUB_CONTEXT_NAME: 'item_instant_buy_tooltip',
        TOOLTIP_COMPONENT_NAME: 'instant_buy_tooltip',

        /**
         * Checks if feature is enabled
         *
         * @return {Boolean}
         */
        isEnabled: function() {
            return Game.features.instant_buy !== 'disabled';
        },

        /**
         * Gets price table
         *
         * @param {String} instant_buy_type
         * @return {Object}
         */
        getPriceTableForType: function(instant_buy_type) {
            var model = MM.getModels().InstantBuyData[Game.player_id];
            return model.getPriceTableForType(instant_buy_type);
        },

        /**
         * Gets highest price for type
         *
         * @param {String} instant_buy_type
         * @return {Number}
         */
        getHighestPriceForType: function(instant_buy_type) {
            var prices = us.values(this.getPriceTableForType(instant_buy_type));

            return Array.prototype.max(prices);
        },

        /**
         * Keep in mind that the special conditions were moved to controllers
         *
         * @param {String} instant_buy_type
         * @param {Number} seconds_left
         * @return {Number}
         */
        getPriceForType: function(instant_buy_type, seconds_left) {
            var price_table = this.getPriceTableForType(instant_buy_type),
                price;
            var lowest_price = this.getHighestPriceForType(instant_buy_type); //Will be changed in the loop

            for (var time_boundary in price_table) {
                if (price_table.hasOwnProperty(time_boundary)) {
                    price = price_table[time_boundary];

                    if (seconds_left <= time_boundary && price < lowest_price) {
                        lowest_price = price;
                    }
                }
            }

            return lowest_price;
        },

        getCurrentInstantBuyCost: function(hero) {
            var time_left = hero.getHealingTimeLeft(),
                price = GameDataInstantBuy.getPriceForType('hero', time_left);

            return price;
        },

        isFreeBuyPossible: function(strategy, order) {
            var price = this.getPremiumFeaturePrice(strategy, order);

            return price === 0;
        },

        getPremiumFeaturePrice: function(strategy, order) {
            return strategy.getPremiumFeaturePrice(order);
        },

        getTooltipHints: function(strategy, order) {
            var l10n = DM.getl10n('construction_queue');

            if (ConstructionQueueHelper.isUnitQueue(strategy)) {
                return [{
                    msg: l10n.units_instant_buy_blocked
                }];
            } else {
                return [];
            }
        },

        getTooltipWarrnings: function(strategy, building_order) {
            var l10n = DM.getl10n('construction_queue');

            //Buildings
            if (ConstructionQueueHelper.isBuildingQueue(strategy)) {
                var warrnings = [];
                var gd_buildings = GameData.buildings,
                    missing_requirement, missing_requirements = this.getBuildingMissingRequirements(strategy.getOrdersCollection(), strategy.getCurrentTownModel(), building_order),
                    l = missing_requirements.length;

                if (l > 0) {
                    for (var i = 0; i < l; i++) {
                        missing_requirement = missing_requirements[i];

                        warrnings.push({
                            msg: gd_buildings[missing_requirement.building_id].name + ' ' + l10n.level + ' ' + missing_requirement.level
                        });
                    }
                }

                return warrnings;
            }
            //Rest
            else {
                return [];
            }
        },

        getBuildingMissingRequirements: function(building_orders, current_town_model, building_order) {
            var building_id = building_order.getBuildingId();

            var gd_building = GameData.buildings[building_id],
                dependencies = gd_building.dependencies,
                buildings_model = current_town_model.getBuildings(),
                buildings = buildings_model.getBuildings();

            var missing_dependencies = [];

            //Check whether dependencies are fulfilled when constructing
            if (!building_order.isBeingTearingDown()) {
                us.each(dependencies, function(required_building_level, required_building_id) {
                    var actual_building_level = buildings[required_building_id];

                    if (actual_building_level < required_building_level) {
                        missing_dependencies.push({
                            building_id: required_building_id,
                            level: required_building_level
                        });
                    }
                });
            }

            //If before the specific order, are orders of the same type, then user can not instant buy it before they will be completed
            //So the dependency is the building of the same type but one level lower
            if (building_orders.getCountOfPreviousOrdersInQueueOfSameType(building_order) > 0) {
                missing_dependencies.push({
                    building_id: building_id,
                    level: this.getNextBuildingLevel(building_orders, building_order, buildings_model) + (building_order.isBeingTearingDown() ? 1 : -1)
                });
            }

            return missing_dependencies;
        },

        getNextBuildingLevel: function(building_orders, building_order, buildings_model) {
            var current_level = this.getBuildingLevel(building_orders, building_order, buildings_model);

            if (building_order.hasTearDown()) {
                return current_level - 1;
            }

            return current_level + 1;
        },

        getBuildingLevel: function(building_orders_collection, building_order, buildings_model) {
            var building_id = building_order.getBuildingId();

            return buildings_model.getBuildingLevel(building_id) + building_orders_collection.getBuildingLevelDependsOnBuildingsInTheQueue(building_order);
        },

        initializeProgressbar: function(strategy, controller, $node, order, sub_context) {
            controller.registerComponent('order_progressbar_' + order.getType() + ' ' + order.getId(), $node.singleProgressbar({
                template: strategy.getProgressbarTemplateName(),
                type: 'time',
                reverse_progress: true,
                liveprogress: true,
                liveprogress_interval: 1,
                value: order.getTimeLeft(),
                max: order.getDuration(),
                countdown: true,
                countdown_settings: {
                    timestamp_end: order.getToBeCompletedAt()
                }
            }), sub_context);
        },

        /**
         * callback in this function is only because of the mass recruit
         */
        initializePremiumButton: function(strategy, controller, $node, order, sub_context, callback) {
            var button_settings = ConstructionQueueHelper.getPremiumActionButtonSettings(strategy, order),
                on_click_event_name = HelperBrowserEvents.getOnClickEventName(sub_context);

            controller.registerComponent('premium_action_' + order.getId(), $node.button(
                    button_settings
                ).on(on_click_event_name, function(e, _btn) {
                    if ((Game.isMobileBrowser() || Game.isHybridApp()) && e.type === 'click') {
                        return;
                    }
                    ConstructionQueueHelper.onPremiumActionCall(strategy, strategy.getOrders(), order, _btn, callback);

                    //Ok, I don't have better place for it to avoid this condition :/
                    if (GameDataInstantBuy.isEnabled()) {
                        var instant_buy_tooltip = controller.getComponent('instant_buy_tooltip');


                        //In the city overview when hammer is pressed we have another way to use premium option (with the button)
                        //but this time we don't want to show there 'instant buy tooltip', so it will not exist there
                        if (instant_buy_tooltip) {
                            instant_buy_tooltip.hideTooltip();
                        }

                        //In case, if player try to buy instant through tooltip from the dropdown list,
                        //the dropdown list stays there. It should vanish.
                        $('#toolbar_activity_recruits_list').hide();
                    }
                })
                .on('mouseover', function(strategy, order, e) {
                    var $btn = $(e.currentTarget),
                        price = this.getPremiumFeaturePrice(strategy, order),
                        tooltip = strategy.getBuildTimeReductionButtonTooltip(order, price);

                    //there is no tooltip for instant buy
                    if (tooltip !== '') {
                        $btn.tooltip(tooltip).showTooltip(e);
                    }
                }.bind(this, strategy, order)), sub_context);
        },

        /**
         * callback in this function is only because of the mass recruit
         */
        loadInstantBuyTooltipContent: function(strategy, controller, $content, order, progressbar_order_index, premium_button_order_index, callback) {
            if (!order) {
                //Actually we could display some text in the tooltip that the order item has been finished, but we still have to sync data with backend
                return;
            }

            var show_progressbar = ConstructionQueueHelper.doInitializeProgressbar(strategy, progressbar_order_index);
            var show_premium_button = ConstructionQueueHelper.doInitializePremiumButtonInTheTooltip(strategy, premium_button_order_index);
            var tooltip_content_template = DM.getTemplate('COMMON', 'instant_buy_tooltip_content');
            var item_name = ConstructionQueueHelper.getItemName(strategy, order.getType());
            var is_free_buy_possible = GameDataInstantBuy.isFreeBuyPossible(strategy, order);
            var hints = GameDataInstantBuy.getTooltipHints(strategy, order);
            var warrnings = GameDataInstantBuy.getTooltipWarrnings(strategy, order);
            var sub_context = GameDataInstantBuy.SUB_CONTEXT_NAME;

            $content.html(us.template(tooltip_content_template, {
                name: item_name,
                is_building_queue: ConstructionQueueHelper.isBuildingQueue(strategy),
                is_unit_queue: ConstructionQueueHelper.isUnitQueue(strategy),
                is_research_queue: ConstructionQueueHelper.isResearchQueue(strategy),
                queue_type: ConstructionQueueHelper.getQueueType(strategy),
                order: order,
                is_free_buy_possible: is_free_buy_possible,
                l10n: DM.getl10n('construction_queue'),
                show_progressbar: show_progressbar,
                show_premium_button: show_premium_button,
                hints: hints,
                warrnings: warrnings
            }));

            controller.unregisterComponents(sub_context);

            var $progressbar = $content.find('.js-item-progressbar');
            var $button = $content.find('.js-item-btn-premium-action');

            if (show_progressbar) {
                GameDataInstantBuy.initializeProgressbar(strategy, controller, $progressbar, order, sub_context);
            }

            //Premium buttons are initialized in the opposite places than in the items in the queue
            if (show_premium_button) {
                GameDataInstantBuy.initializePremiumButton(strategy, controller, $button, order, sub_context, callback);
            }
        }
    };

    window.GameDataInstantBuy = GameDataInstantBuy;
}(window));