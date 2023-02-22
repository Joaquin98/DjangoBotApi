/*globals PremiumWindowFinishForGold, GameDataHercules2014, Game, us, GameEvents, GameData */

define('no_gold_dialog/factories/buy_for_gold', function() {
    'use strict';

    var GameDataInventory = require('data/inventory');

    var disable_button = function(btn) {
        if (btn && typeof btn.disable === 'function') {
            btn.disable();
        }
    };

    var enable_button = function(btn) {
        if (btn && typeof btn.enable === 'function') {
            btn.enable();
        }
    };

    var getConfirmCallback = function(btn, callback, confirmation_event_callback) {
        return function() {
            var callbacks = {
                success: function(data) {
                    if (confirmation_event_callback) {
                        confirmation_event_callback();
                    }
                    enable_button(btn);
                },

                error: function() {
                    enable_button(btn);
                }
            };

            callback(callbacks);
        };
    };

    var getCancelCallback = function(btn) {
        return function() {
            enable_button(btn);
        };
    };

    var executeConfirmation = function(btn, cost, callback, Confirmation_class, extra_data, confirmation_event_callback) {
        disable_button(btn);

        var data = {
            onConfirm: getConfirmCallback(btn, callback, confirmation_event_callback),
            onCancel: getCancelCallback(btn),
            cost: cost
        };
        us.extend(data, extra_data);

        new PremiumWindowFinishForGold(
            new Confirmation_class(data)
        );
    };

    var BuyForGoldWindowFactory = {
        // Event related, done later

        openAdventBuyRefillForGoldWindow: function(btn, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationAdventBuyRefillWindowData);
        },

        openBuyHalloweenIngredientForGoldWindow: function(btn, ingredient, callback) {
            var cost = ingredient.getCost();
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyHalloweenIngredientWindowData, {
                ingredient: ingredient
            });
        },

        openBuyEasterIngredientForGoldWindow: function(btn, ingredient, callback) {
            var cost = ingredient.getCost();
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyEasterIngredientWindowData, {
                ingredient: ingredient
            });
        },
        /**
         * Shows buy random recipe window
         *
         * @param {jQuery Button} btn
         * @param {Integer} cost
         * @param {Instance of HalloweenReward} reward
         *
         */
        openBuyEasterRecipeWindow: function(btn, reward, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyEasterRecipeWindowData, {
                reward: reward
            });
        },

        /**
         * Shows buy ingredient for gold window
         *
         * @param {jQuery Button} btn
         * @param {GameModels.XXXIngredient} ingredient
         * @param {GameControllers.ControllerXXX} controller        controller which implements 'buyIngredient' method
         *
         */
        //TODO refactor callback
        openBuyEventIngredientWindow: function(btn, ingredient, controller) {
            var cost = ingredient.getCost();
            var callback = function(callbacks) {
                controller.buyIngredient(ingredient.getIngredientType(), callbacks);
            };
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyEventIngredientWindowData, {
                ingredient: ingredient
            });
        },

        /**
         * Shows buy arrows for gold window
         *
         * @param {jQuery Button} btn
         *
         */
        //TODO refactor callback
        openBuyAssassinsArrowsWindow: function(btn, cost, num, name, controller) {
            var callback = function() {
                controller.refillArrows();
            };

            executeConfirmation(btn, cost, callback, window.ConfirmationAssassinsBuyArrowsWindowData, {
                name: name,
                num: num
            });
        },

        /**
         * Shows buy mercenary for gold window
         *
         * @param {jQuery Button} btn
         *
         */
        //TODO refactor callback
        openBuyHercules2014MercenaryWindow: function(btn, mercenary_type, mercenary, cost, controller) {
            var callback = function() {
                controller.buyMercenaryForGold(mercenary_type);
            };

            executeConfirmation(btn, cost, callback, window.ConfirmationHercules2014BuyMercenaryWindowData, {
                name: GameDataHercules2014.getUnitName(mercenary_type)
                //mercenary_type : mercenary_type,
                //mercenary: mercenary,
            });
        },

        /**
         * Shows buy instant healer for gold window
         *
         * @param {jQuery Button} btn
         *
         */
        //TODO refactor callback
        openBuyHercules2014HealerWindow: function(btn, controller, healer_cost) {
            var cost = healer_cost;
            var callback = function() {
                controller.buyHealerForGold();
            };
            executeConfirmation(btn, cost, callback, window.ConfirmationHercules2014BuyHealerWindowData);
        },

        /**
         * Shows buy instant healer for gold for Hercules window
         *
         * @param {jQuery Button} btn
         *
         */
        //TODO controller / parameter order
        //TODO refactor callback
        openBuyHercules2014HealHerculesWindow: function(btn, controller, healer_cost) {
            var cost = healer_cost;
            var callback = function() {
                controller.healHerculesForGold();
            };
            executeConfirmation(btn, cost, callback, window.ConfirmationHercules2014HealHerculesWindowData);
        },

        /**
         * Shows buy random recipe window
         *
         * @param {jQuery Button} btn
         * @param {Integer} cost
         * @param {Instance of HalloweenReward} reward
         *
         */
        openBuyHalloweenRecipeWindow: function(btn, reward, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyHalloweenRecipeWindowData, {
                reward: reward
            });
        },

        /**
         * Shows buy spin for gold window
         *
         * @param {jQuery Button} btn
         * @param {GameModels.AdventSpot} spot
         *
         */
        openBuyAdventSpinWindow: function(btn, spot, callback) {
            var cost = spot.getPriceForSpin();
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyAdventSpinWindowData, {
                spot: spot
            });
        },

        /**
         * Not EVENT related
         */
        openInstantBuyHeroHealForGoldWindow: function(btn, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationInstantBuyHeroHealWindowData);
        },


        openAcceptGoldTradeForGoldWindow: function(btn, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationAcceptGoldTradeWindowData);
        },

        openOfferGoldTradeForGoldWindow: function(btn, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationOfferGoldTradeWindowData);
        },

        openFinishResearchOrderForGoldWindow: function(btn, data, callback) {
            var cost = Game.constants.premium.finish_research_order_cost;
            executeConfirmation(btn, cost, callback, window.ConfirmationFinishResearchOrderWindowData);
        },

        openImmediateCallPhoenicianSalesmanForGoldWindow: function(btn, data, callback) {
            var cost = Game.phoenician.immediate_call_gold_cost;
            executeConfirmation(btn, cost, callback, window.ConfirmationImmediateCallPhoenicianSalesmanWindowData);
        },

        /**
         * Opens 'not enough gold' window which is used for 'unit build time reduction'
         *
         * @param btn {Object}    instance of the button component object which was clicked
         * @param data {Object}   object which represents unit order
         *    Properties:
         *	  - building_type : 'barracks' | 'docks',
         *	  - order_id : 0,
         *	  - unit_id : 0,
         *	  - completed_at : 0,
         *    - completed_at_prev : 0
         * @param callback {Function}   callback function
         *
         * @return void
         */
        // TODO Refactor confirmation_Event_callback
        openReductUnitBuildTimeForGoldWindow: function(btn, order, callback) {
            var cost = window.GameDataUnits.getUnitOrderBuildTimeReductionCost();
            var confirmation_event_callback = function() {
                var unit_id = order.unit_id,
                    building_type = order.building_type;

                $.Observer(GameEvents.premium.build_time_reduction).publish({
                    type: 'unit',
                    id: unit_id,
                    place_name: building_type
                });
            };

            executeConfirmation(btn, cost, callback, window.ConfirmationUnitBuildTimeReductionWindowData, {
                building_type: order.building_type
                //order: order
            }, confirmation_event_callback);
        },

        /**
         * Opens 'not enough gold' window which is used for 'building time reduction'
         *
         * @param btn {Object}    instance of the button component object which was clicked
         * @param data {Object}   object which represents the building order
         *    Properties:
         *	  - order_id : 0,
         *	  - completed_at : 0
         * @param callback {Function}   callback function
         *
         * @return void
         */
        //TODO confirmation events
        openReductBuildingBuildTimeForGoldWindow: function(btn, order, callback) {
            var confirmation_event_callback = function() {
                var building_type = order.type;

                $.Observer(GameEvents.premium.build_time_reduction).publish({
                    type: 'building',
                    id: building_type
                });
            };

            var cost = window.GameDataBuildings.getFinishBuildingOrderCost();
            executeConfirmation(btn, cost, callback, window.ConfirmationBuildingBuildTimeReductionWindowData, {}, confirmation_event_callback);
        },
        /**
         * Opens 'not enough gold' window which is used for 'changing island quest'
         *
         * @param btn {Object}          instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openChangeIslandQuestForGoldWindow: function(btn, callback) {
            var cost = GameData.island_quests.exchange_quest_cost;
            executeConfirmation(btn, cost, callback, window.ConfirmationChangeIslandQuestWindowData);
        },

        /**
         * Opens 'not enough gold' window which is used for 'skip_island_quest_cooldown'
         *
         * @param btn {Object}          instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openSkipIslandQuestCooldownForGoldWindow: function(btn, callback) {
            var cost = GameData.island_quests.skip_cooldown_cost;
            executeConfirmation(btn, cost, callback, window.ConfirmationSkipIslandQuestCooldownWindowData);
        },

        /**
         * Opens 'not enough gold' window which is used for 'halving hero cure time'
         *
         * @param btn {Object}          instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openHalveHeroCureTimeForGoldWindow: function(btn, callback) {
            var cost = window.GameDataHeroes.getHalveCureTimeCost();
            executeConfirmation(btn, cost, callback, window.ConfirmationHalveCureTimeWindowData);
        },

        /**
         * Opens 'not enough gold' window which is used for 'buying hero slot"
         *
         * @param btn {Object}          instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openBuyHeroSlotForGoldWindow: function(btn, callback) {
            var cost = window.GameDataHeroes.getSlotCost();
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyHeroSlotWindowData);
        },

        /**
         * Shows extend power window
         *
         * @param {jQuery Button} btn
         * @param {GameModels.CastedPowers} casted_power
         * @param {Object|Function} [callbacks]
         */
        openExtendPowerForGoldWindow: function(btn, casted_power, callbacks) {
            var cost = window.GameDataPowers.getPowerExtensionCost(),
                callback = function(callbacks) {
                    casted_power.extend(callbacks);
                };
            executeConfirmation(
                btn,
                cost,
                callback,
                window.ConfirmationExtendPowerWindowData, {
                    power_name: GameData.powers[casted_power.getPowerId()].name
                }
            );
        },

        /**
         * Shows buy call new heroes gold window
         *
         * @param {jQuery Button} btn
         *
         */
        openBuyCallNewHeroesWindow: function(btn, callback) {
            var cost = window.GameDataHeroes.getPriceForHeroesCall();
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyCallNewHeroesWindowData);
        },

        /**
         * Shows buy inventory slot gold window
         *
         * @param {jQuery Button} btn
         * @param {Number} slot_number
         *
         */
        openBuyInventorySlotWindow: function(btn, slot_number, callback) {
            var cost = GameDataInventory.getSlotCost(slot_number);
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyInventorySlotWindowData);
        },

        /**
         * Shows extend advisor window
         *
         * @param {jQuery Button} btn
         */
        openExtendAdvisorWindow: function(btn, advisor_id, callback) {
            var cost = window.GameDataPremium.getAdvisorCost(advisor_id);
            executeConfirmation(btn, cost, callback, window.ConfirmationExtendAdvisorWindowData, {
                advisor_id: advisor_id
            });
        },

        /**
         * Shows buy advisor window
         *
         * @param {jQuery Button} btn
         */
        openBuyAdvisorWindow: function(btn, advisor_id, callback) {
            var cost = window.GameDataPremium.getAdvisorCost(advisor_id);
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyAdvisorWindowData, {
                advisor_id: advisor_id
            });
        },

        /**
         * Shows buy curator window
         *
         * @param {jQuery Button} btn
         * @param {Function} callback
         */
        //TODO remove and use enums
        openBuyCuratorWindow: function(btn, callback) {
            this.openBuyAdvisorWindow(btn, 'curator', callback);
        },

        /**
         * Shows buy merchant window
         *
         * @param {jQuery Button} btn
         * @param {Function} callback
         */
        //TODO remove and use ENUMS
        openBuyTraderWindow: function(btn, callback) {
            this.openBuyAdvisorWindow(btn, 'trader', callback);
        },

        /**
         * Opens 'not enough gold" window which is used for 'building cost reduction'
         *
         * @param btn {Object}    instance of the button component object which was clicked
         * @param resource_costs {Object}   object which keeps cost of the building
         *    Properties (values are example):
         *	  - wood : 80,
         *	  - stone : 25,
         *	  - iron : 25
         * @param callback {Function}   callback function
         */
        openReductBuildingBuildCostForGoldWindow: function(btn, resource_costs, callback) {
            var cost = window.GameDataBuildings.getBuildingBuildCostReductionPrice(),
                reduction = window.GameDataBuildings.getBuildingBuildCostReduction(),
                ConfirmationClass = require('window_data/confirmation_building_build_cost_reduction');

            executeConfirmation(btn, cost, callback, ConfirmationClass, {
                reduction: reduction
            });
        },

        /**
         * Opens 'not enough gold' window which is used for starting 'olympic games'
         *
         * @param btn {Object}          instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openCelebrateOlympicGamesForGoldWindow: function(btn, data, callback) {
            var cost = data.cost || window.GameDataCelebrations.getCelebrationGamesPrice();
            executeConfirmation(btn, cost, callback, window.ConfirmationCelebrateOlympicGamesWindowData);
        },

        openBuyVacationDaysForGoldWindow: function(btn, days, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationBuyVacationDaysWindowData, {
                days: days
            });
        },

        /**
         * Opens 'not enough gold' window which is used for 'research build time reduction'
         *
         * @param btn {jQuery Object}   instance of the button component object which was clicked
         * @param order_data {Object}   Some pre-calculated values
         *     {String} type
         *     {Number} order_id
         *     {Number} completed_at
         *     {Number} completed_at_prev
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openReductResearchBuildTimeForGoldWindow: function(btn, order_data, callback) {
            var cost = window.GameDataResearches.getBuildTimeReductionCost();
            var confirmation_event_callback = function() {
                var research_type = order_data.type;

                $.Observer(window.GameEvents.premium.build_time_reduction).publish({
                    type: 'research',
                    id: research_type
                });
            };

            executeConfirmation(btn, cost, callback, window.ConfirmationResearchBuildTimeReductionWindowData, {}, confirmation_event_callback);
        },

        /**
         * Opens 'not enough gold' window which is used for 'research instant buy'
         *
         * @param btn {jQuery Object}   instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openResearchesInstantBuyForGoldWindow: function(btn, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationResearchesInstantBuyWindowData);
        },

        /**
         * Opens 'not enough gold" window which is used for 'research instant buy'
         *
         * @param btn {jQuery Object}   instance of the button component object which was clicked
         * @param callback {Function}   callback function
         *
         * @return void
         */
        openBuildingsInstantBuyForGoldWindow: function(btn, cost, order, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationBuildingsInstantBuyWindowData, {
                order: order
            });
        },

        openUnitsInstantBuyForGoldWindow: function(btn, cost, callback) {
            executeConfirmation(btn, cost, callback, window.ConfirmationUnitsInstantBuyWindowData);
        },

        openConfirmationBuyEventCurrency: function(btn, amount, cost, callback) {
            var ConfirmationBuyCurrency = require('features/currency_shop/dialogs/confirmation_buy_event_currency');
            executeConfirmation(btn, cost, callback, ConfirmationBuyCurrency, {
                amount: amount
            });
        },

        openConfirmationReplaceTasksForGold: function(btn, type, cost, callback) {
            executeConfirmation(
                btn,
                cost,
                callback,
                require('events/tasks_event/dialogs/replace_tasks'), {
                    type: type
                }
            );
        }
    };

    window.BuyForGoldWindowFactory = BuyForGoldWindowFactory;
    return BuyForGoldWindowFactory;
});