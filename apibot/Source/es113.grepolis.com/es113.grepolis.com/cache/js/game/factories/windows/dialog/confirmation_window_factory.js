/* global us, WF, MM, ConfirmationSimpleData, ConfirmationWindowData */

define('factories/windows/dialog/confirmation_window_factory', function() {
    'use strict';

    var ConfirmationWindowFactory = {
        /**
         * Opens confirmation window depends on the type given as argument
         *
         * @param {Object} data_object   instance of the confirmation window data
         *                               @see /data/windows/dialog/confirmation/
         *
         * @return void
         */
        openConfirmationWindow: function(data_object, window_settings) {
            window_settings = window_settings || {};

            us.defaults(window_settings, {
                width: 430,
                minheight: 150,
                minimizable: false,
                modal: true,
                activepagenr: 'confirmation_window_default'
            });

            if (!(data_object instanceof ConfirmationWindowData)) {
                throw 'To run openConfirmationWindow you need to pass object which is instance of ConfirmationWindowData';
            }

            return WF.open('dialog', {
                preloaded_data: {
                    data_object: data_object
                },
                window_settings: window_settings
            });
        },

        /**
         * Opens confirmation window with question if user realy want to send
         * units to Grepolympia Training Ground
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         */
        openConfirmationSendUnitsToTrainingGroundWindow: function(on_confirm, on_cancel) {
            this.openConfirmationWindow(
                new ConfirmationSendUnitsToTrainingGroundWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openSimpleConfirmation: function(title, question, onConfirm, onCancel) {
            this.openConfirmationWindow(
                new ConfirmationSimpleData({
                    onConfirm: onConfirm,
                    onCancel: onCancel,
                    title: title,
                    question: question
                })
            );
        },

        /**
         * Opens confirmation window with question to cancel building order
         *
         * @param {Function} on_confirm
         * @param {Function} on_cancel
         */
        openConfirmationBuildingOrderCancel: function(on_confirm, on_cancel, data) {
            this.openConfirmationWindow(
                new ConfirmationBuildingOrderCancelWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    data: data
                })
            );
        },

        /**
         * Opens confirmation window with question to cancel research order
         *
         * @param {Function} on_confirm
         * @param {Function} on_cancel
         */
        openConfirmationResearchOrderCancel: function(on_confirm, on_cancel, data) {
            this.openConfirmationWindow(
                new ConfirmationResearchOrderCancelWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    data: data
                })
            );
        },

        /**
         * Opens confirmation window with question to cancel unit order
         *
         * @param {Function} on_confirm
         * @param {Function} on_cancel
         */
        openConfirmationUnitOrderCancel: function(on_confirm, on_cancel) {
            this.openConfirmationWindow(
                new ConfirmationUnitOrderCancelWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        /**
         * Opens confirmation window with question if user realy want to delete
         * map bookmark (saved coordinates)
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         * @param {Object} [data]           additional data
         */
        openConfirmationDeleteMapBookmarkWindow: function(on_confirm, on_cancel, data) {
            var additional_data = data || {};

            this.openConfirmationWindow(
                new ConfirmationDeleteMapBookmarkWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    bookmark_name: additional_data.bookmark_name
                })
            );
        },

        /**
         * Opens confirmation window with question if user realy want to delete
         * town group
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         * @param {Object} [data]           additional data
         */
        openConfirmationDeleteTownGroupWindow: function(on_confirm, on_cancel, data) {
            var additional_data = data || {};

            this.openConfirmationWindow(
                new ConfirmationDeleteTownGroupWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    town_group_name: additional_data.town_group_name
                })
            );
        },

        /**
         * Opens confirmation window with question if user really wants to cast negative spell on his own town
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         */
        openConfirmationCastNegativeSpellOnOwnTownWindow: function(on_confirm, on_cancel) {
            var Confirmation = require('features/spells_dialog/dialogs/confirmation_cast_negative_spell');
            this.openConfirmationWindow(
                new Confirmation({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    is_town: true
                })
            );
        },

        /**
         * Opens confirmation window with question if user really wants to cast negative spell on his own command
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         */
        openConfirmationCastNegativeSpellOnOwnCommand: function(on_confirm, on_cancel) {
            var Confirmation = require('features/spells_dialog/dialogs/confirmation_cast_negative_spell');
            this.openConfirmationWindow(
                new Confirmation({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    is_town: true
                })
            );
        },

        /**
         * Opens confirmation window with question to unassign a hero from a town
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         */
        openConfirmationUnassignHeroFromTown: function(on_confirm, on_cancel) {
            this.openConfirmationWindow(
                new ConfirmationUnassignHeroWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        /**
         * Opens confirmation window with question to remove inventory item
         *
         * @param {Function} on_confirm     function executed when confirmation button is clicked
         * @param {Function} [on_cancel]    function executed when cancelation button is clicked
         * @param {String} item_name        name of the item to remove
         */
        openConfirmationRemoveItemFromInventory: function(on_confirm, on_cancel, item_name) {
            this.openConfirmationWindow(
                new ConfirmationRemoveInventoryItemDataWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    item_name: item_name
                })
            );
        },

        openConfirmationEnlistMilitia: function(on_confirm, on_cancel) {
            this.openConfirmationWindow(
                new ConfirmationEnlistMilitiaWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationResettingResearch: function(on_confirm, on_cancel) {
            this.openConfirmationWindow(
                new ConfirmationResettingResearchWindowData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        /**
         * open a conf. window and to ask the user weather he want´s to waste resources
         * @param {Function} on_confirm  callback
         * @param {Function} on_cancel   callback
         * @param {Object} simple_reward_data -> see ResourceRewardDataFactory
         */
        openConfirmationWastedResources: function(on_confirm, on_cancel, simple_reward_data, town_id, window_settings) {
            var WastedResourcesHelper = require('WastedResourcesHelper'),
                Game = window.Game,
                town_collection = MM.getCollections().Town[0],
                player_hints_collection = MM.getCollections().PlayerHint[0];

            var current_town = town_id ? town_collection.get(town_id) : town_collection.getCurrentTown(),
                player_gods = MM.getModels().PlayerGods[Game.player_id],
                wr_helper = new WastedResourcesHelper(current_town, player_gods),
                wasted_resources = wr_helper.getWastedResources(simple_reward_data),
                dialog_data_object = new window.ConfirmationWasteResourcesData({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    wasted_resources: wasted_resources,
                    town_name: typeof wasted_resources.fury === 'undefined' ? current_town.getName() : ''
                }),
                player_hint = player_hints_collection.getForType(dialog_data_object.getType());

            if (wr_helper.hasWastedResources(simple_reward_data) && !player_hint.isHidden()) {
                window_settings = Object.assign({
                    width: 530
                }, window_settings);
                this.openConfirmationWindow(dialog_data_object, window_settings);
            } else {
                // No resource waste, continue per default
                on_confirm();
            }
        },

        /**
         * @param {Function} on_confirm
         * @param {Function} on_cancel
         * @param {Object} town_reward_data
         * 		Key => Town Id
         * 		Value => {Object} -> see ResourceRewardDataFactory
         * 		{
         * 			42: {
         * 				wood: 0,
         * 				stone: 100,
         * 				iron: 200
         * 			}
         * 		}
         */
        openConfirmationWastedResourcesMultiple: function(on_confirm, on_cancel, town_reward_data) {
            var wasted_resources = this._calculateWastedResourcesForMultipleTowns(town_reward_data),
                wasted_resources_total = {
                    wood: 0,
                    stone: 0,
                    iron: 0
                };

            if (wasted_resources.length === 0) {
                on_confirm();
            } else {
                wasted_resources.forEach(function(resources) {
                    wasted_resources_total.wood += resources.hasOwnProperty('wood') ? resources.wood : 0;
                    wasted_resources_total.stone += resources.hasOwnProperty('stone') ? resources.stone : 0;
                    wasted_resources_total.iron += resources.hasOwnProperty('iron') ? resources.iron : 0;
                });

                this._checkPlayerHintsAndOpenWindow(
                    new window.ConfirmationWasteResourcesData({
                        onConfirm: on_confirm,
                        onCancel: on_cancel,
                        wasted_resources: wasted_resources_total,
                        has_multiple_targets: true
                    })
                );
            }
        },

        openConfirmationWasteResourcesFarmTowns: function(on_confirm, on_cancel) {
            if (MM.getCollections().PlayerHint[0].getForType('waste_resources').isHidden()) {
                on_confirm();

                return;
            }

            this.openConfirmationWindow(
                new window.ConfirmationWasteResourcesFarmTowns({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        /**
         * Assassins Event
         */
        openConfirmationAssassinsResettingTargets: function(cost, on_confirm, on_cancel) {
            this.openConfirmationWindow(
                new ConfirmationAssassinsBuyResetTargets({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    cost: cost
                })
            );
        },

        /**
         * Grepolympia buying an extra attempt in a discipline
         */
        openConfirmationGrepolympiaBuyAttempt: function(cost, on_confirm, on_cancel) {
            var confirmation_grepolympia_buy_attempt_data = new ConfirmationGrepolympiaBuyAttemptTargets({
                onConfirm: on_confirm,
                onCancel: on_cancel,
                cost: cost
            });

            this._checkPlayerHintsAndOpenWindow(confirmation_grepolympia_buy_attempt_data);
        },

        /**
         * Grepolympia resetting the skillpoints of an athlete
         */
        openConfirmationGrepolympiaResetSkillpoints: function(cost, on_confirm, on_cancel) {
            var confirmation_grepolympia_reset_skill_data = new ConfirmationGrepolympiaResetSkillTargets({
                onConfirm: on_confirm,
                onCancel: on_cancel,
                cost: cost
            });

            this._checkPlayerHintsAndOpenWindow(confirmation_grepolympia_reset_skill_data);
        },

        /**
         * Grepolympia buying a training bonus for an athlete
         */
        openConfirmationGrepolympiaBuyBonus: function(cost, on_confirm, on_cancel) {
            var confirmation_grepolympia_buy_bonus_data = new ConfirmationGrepolympiaBuyBonusTargets({
                onConfirm: on_confirm,
                onCancel: on_cancel,
                cost: cost
            });

            this._checkPlayerHintsAndOpenWindow(confirmation_grepolympia_buy_bonus_data);
        },

        /**
         * Grepolympia buying an extra training slot
         */
        openConfirmationGrepolympiaBuyTrainingSlot: function(cost, on_confirm, on_cancel) {
            var confirmation_grepolympia_buy_training_slots_data = new ConfirmationGrepolympiaBuyTrainingSlotTargets({
                onConfirm: on_confirm,
                onCancel: on_cancel,
                cost: cost
            });

            this._checkPlayerHintsAndOpenWindow(confirmation_grepolympia_buy_training_slots_data);
        },

        /**
         * open conf. dialog to ask if the user really wants to attack
         * does NOT simulate attacks or anything, just opens the confirmation dialog
         */
        openConfirmationFatalAttack: function(on_confirm, on_cancel) {
            var ConfirmationFatalAttack = require('features/fatal_attack_warning/dialog/fatal_attack');
            this.openConfirmationWindow(
                new ConfirmationFatalAttack({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                }), {
                    minheight: 400,
                    width: 563
                }
            );
        },

        openConfirmationFoundNewCityWindow: function(on_confirm, on_cancel) {
            var confirmation_found_city_data = new ConfirmationFoundCityData({
                onConfirm: on_confirm,
                onCancel: on_cancel
            });
            this._checkPlayerHintsAndOpenWindow(confirmation_found_city_data);
        },

        openConfirmationCastVote: function(on_confirm, on_cancel) {
            var ConfirmationCastVote = require("data/windows/dialog/confirmation/confirmation_cast_vote");
            this.openConfirmationWindow(
                new ConfirmationCastVote({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationSwapMissionWindow: function(cost, on_confirm, on_cancel) {
            var ConfirmationSwapMissionWindow = require('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_swap_mission_window');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationSwapMissionWindow({
                    cost: cost,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationTaskReduceAmountWindow: function(cost, percentage_to_reduce, on_confirm, on_cancel) {
            var ConfirmationTaskReduceAmountWindow = require('data/windows/dialog/confirmation/happenings/tasks_event/confirmation_tasks_event_reduction_mechanic_window');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationTaskReduceAmountWindow({
                    cost: cost,
                    percentage: percentage_to_reduce,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationBoostMissionWindow: function(cost, on_confirm, on_cancel) {
            var ConfirmationBoostMissionWindow = require('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_boost_mission_window');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationBoostMissionWindow({
                    cost: cost,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationSkipCooldownWindow: function(cost, on_confirm, on_cancel) {
            var ConfirmationSkipCooldownWindow = require('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_skip_cooldown_window');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationSkipCooldownWindow({
                    cost: cost,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationBuyEventUnitsWindow: function(amount, unit_name, cost, on_confirm, on_cancel) {
            var ConfirmationMissionBuyEventUnitsWindow = require('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_buy_event_units_window');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationMissionBuyEventUnitsWindow({
                    amount: amount,
                    unit_name: unit_name,
                    cost: cost,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationGodSelectionWindow: function(new_god_id, prev_god_id, town_units, supporting_units, lose_all_fury, on_confirm, on_cancel) {
            var ConfirmationDialog = require('features/god_selection/dialog/confirmation');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationDialog({
                    new_god_id: new_god_id,
                    prev_god_id: prev_god_id,
                    town_units: town_units,
                    supporting_units: supporting_units,
                    lose_all_fury: lose_all_fury,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                }), {
                    minheight: 300,
                    width: 550
                }
            );
        },

        openConfirmationAttackingOnAllianceMember: function(on_confirm, on_cancel) {
            var ConfirmationAttackingOnAllianceMember = require("data/windows/dialog/confirmation/confirmation_attacking_on_alliance_member_data");
            this.openConfirmationWindow(
                new ConfirmationAttackingOnAllianceMember({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openDeleteAllMarketOffers: function(on_confirm, on_cancel) {
            var ConfirmationDeleteAllMarketOffers = require("features/market/dialog/delete_all_offers_dialog");
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationDeleteAllMarketOffers({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationReturnAllUnits: function(on_confirm, on_cancel, has_selected_cities) {
            var ConfirmationReturnAllUnits = require('data/windows/dialog/confirmation/confirmation_return_all_units');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationReturnAllUnits({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    has_selected_cities: has_selected_cities
                })
            );
        },

        openConfirmationReturnAllUnitsFromTown: function(on_confirm, on_cancel) {
            var ConfirmationReturnAllUnitsFromTown = require('data/windows/dialog/confirmation/confirmation_return_all_units_from_town');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationReturnAllUnitsFromTown({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        openConfirmationPremiumExchangeConfirmOrder: function(on_confirm, on_cancel, resource, resource_type, cost) {
            var ConfirmationPremiumExchange = require('data/windows/dialog/confirmation/confirmation_premium_exchange_confirm_order');
            this._checkPlayerHintsAndOpenWindow(
                new ConfirmationPremiumExchange({
                    onConfirm: on_confirm,
                    onCancel: on_cancel,
                    resource: resource,
                    resource_type: resource_type,
                    cost: cost
                })
            );
        },

        openConfirmationCastSpellOnTown: function(god_id, power_name, town_name, on_confirm, on_cancel) {
            var Confirmation = require('features/spells_dialog/dialogs/confirmation_cast_spell');
            this._checkPlayerHintsAndOpenWindow(
                new Confirmation({
                    god_id: god_id,
                    power_name: power_name,
                    town_name: town_name,
                    is_town: true,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                }), {
                    skin: 'wnd_skin_grepo_box',
                    css_class: 'cast_spell'
                }


            );
        },

        openConfirmationCastSpellOnCommand: function(god_id, power_name, on_confirm, on_cancel) {
            var Confirmation = require('features/spells_dialog/dialogs/confirmation_cast_spell');
            this._checkPlayerHintsAndOpenWindow(
                new Confirmation({
                    god_id: god_id,
                    power_name: power_name,
                    is_town: false,
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                }), {
                    skin: 'wnd_skin_grepo_box',
                    css_class: 'cast_spell'
                }


            );
        },

        openConfirmationAresSacrificeNotEnoughpopulation: function(on_confirm, on_cancel) {
            var Confirmation = require('data/windows/dialog/confirmation/confirmation_ares_sacrifice_not_enough_population');
            this._checkPlayerHintsAndOpenWindow(
                new Confirmation({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                }), {
                    skin: 'wnd_skin_grepo_box'
                }
            );
        },

        openConfirmationLogout: function(on_confirm, on_cancel) {
            var Confirmation = require('data/windows/dialog/confirmation/confirmation_log_out');
            this.openConfirmationWindow(
                new Confirmation({
                    onConfirm: on_confirm,
                    onCancel: on_cancel
                })
            );
        },

        /**
         * Helper function to calculate the resources that are wasted for multiple towns
         *
         * @param {Object} town_reward_data
         * 		Key => Town Id
         * 		Value => {Object} -> see ResourceRewardDataFactory
         * 		{
         * 			42: {
         * 				wood: 0,
         * 				stone: 100,
         * 				iron: 200
         * 			}
         * 		}
         */
        _calculateWastedResourcesForMultipleTowns: function(town_reward_data) {
            var Game = window.Game,
                WastedResourcesHelper = require('WastedResourcesHelper'),
                player_gods = MM.getModels().PlayerGods[Game.player_id],
                town_collection = MM.getCollections().Town[0],
                wasted_resources = [];

            for (var town_id in town_reward_data) {
                if (town_reward_data.hasOwnProperty(town_id)) {
                    var current_town = town_collection.get(town_id),
                        wr_helper = new WastedResourcesHelper(current_town, player_gods);

                    if (wr_helper.hasWastedResources(town_reward_data[town_id])) {
                        wasted_resources.push(wr_helper.getWastedResources(town_reward_data[town_id]));
                    }
                }
            }

            return wasted_resources;
        },

        /**
         * Helper function to check the player's settings if the confirmation is disabled
         * @param confirmation_window_data ConfirmationWindowData
         * @private
         */
        _checkPlayerHintsAndOpenWindow: function(confirmation_window_data, window_settings) {
            var player_hints_collection = MM.getCollections().PlayerHint[0];
            var player_hint = player_hints_collection.getForType(confirmation_window_data.getType());

            // check if the player has disabled this confirmation
            if (!player_hint.isHidden()) {
                this.openConfirmationWindow(confirmation_window_data, window_settings);
            } else {
                var confirmation_callback = confirmation_window_data.getConfirmCallback();
                confirmation_callback();
            }
        }
    };

    window.ConfirmationWindowFactory = ConfirmationWindowFactory;

    return ConfirmationWindowFactory;
});