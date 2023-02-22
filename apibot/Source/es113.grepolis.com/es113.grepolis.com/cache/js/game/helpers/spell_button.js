/* globals HelperPower, ConfirmationWindowFactory, BuyForGoldWindowFactory,
TooltipFactory, Game, GameData, GeneralModifications, ITowns, MM */

define('helpers/spell_button', function() {
    'use strict';

    var Powers = require('enums/powers');

    return {
        TownCastSpellHandler: function(town_id, town_name, casted_power, is_my_own_town, callback, _btn, hide_confirmation) {
            var on_confirm, power;

            if (!casted_power) {
                power = HelperPower.createCastedPowerModel(_btn.data('power_id'), town_id);
                on_confirm = this.onConfirmCastSpellOnTown.bind(this, power, town_id, is_my_own_town, callback);

                if (hide_confirmation) {
                    on_confirm();
                } else {
                    ConfirmationWindowFactory.openConfirmationCastSpellOnTown(
                        power.getGodId(),
                        GameData.powers[power.getPowerId()].name,
                        town_name,
                        on_confirm
                    );
                }
            } else if (casted_power.isExtendable()) {
                BuyForGoldWindowFactory.openExtendPowerForGoldWindow(_btn, casted_power);
            }
        },

        onConfirmCastSpellOnTown: function(power, town_id, is_my_own_town, callback) {
            var ResourceRewardDataFactory = require('factories/resource_reward_data_factory'),
                on_confirm = function() {
                    power.cast(callback);
                };

            if (power.isNegative() && is_my_own_town) {
                ConfirmationWindowFactory.openConfirmationCastNegativeSpellOnOwnTownWindow(on_confirm);
            } else if (power.getPowerId() === Powers.ARES_SACRIFICE) {
                this.onConfirmCastAresSacrifice(on_confirm, town_id);
            } else if (is_my_own_town) {
                ConfirmationWindowFactory.openConfirmationWastedResources(
                    on_confirm,
                    null,
                    ResourceRewardDataFactory.fromCastedPowersModel(power), town_id
                );
            } else {
                on_confirm();
            }
        },

        onConfirmCastAresSacrifice: function(on_confirm, town_id) {
            var population_available = ITowns.getTown(town_id).getLandUnits(true),
                max_possible_units = GameData.powers.ares_sacrifice.meta_defaults.amount,
                player_gods_model = MM.getModels().PlayerGods[Game.player_id],
                max_possible_fury = player_gods_model.getMaxFury(),
                current_fury = player_gods_model.getFury(),
                population_sum = 0;

            for (var unit_id in population_available) {
                if (population_available.hasOwnProperty(unit_id)) {
                    if (!GameData.units.hasOwnProperty(unit_id)) {
                        continue;
                    }

                    population_sum += GameData.units[unit_id].population * population_available[unit_id];
                }
            }

            var is_population_smaller = population_sum < max_possible_units,
                population_destroyed = is_population_smaller ? population_sum : max_possible_units;

            if (current_fury + population_destroyed > max_possible_fury) {
                ConfirmationWindowFactory.openConfirmationWastedResources(
                    function() {
                        if (is_population_smaller) {
                            ConfirmationWindowFactory.openConfirmationAresSacrificeNotEnoughpopulation(on_confirm);
                        } else {
                            on_confirm();
                        }
                    },
                    null, {
                        fury: population_destroyed * 2 * (1 + GeneralModifications.getAresSacrificeBonus() / 100)
                    },
                    town_id, {
                        skin: 'wnd_skin_grepo_box'
                    }
                );
            } else if (is_population_smaller) {
                ConfirmationWindowFactory.openConfirmationAresSacrificeNotEnoughpopulation(on_confirm);
            } else {
                on_confirm();
            }
        },

        TownSpellMouseOverHandler: function(e, is_my_own_town, town_id) {
            var $btn = $(e.currentTarget),
                casted_power = is_my_own_town ? HelperPower.getCastedPower($btn.data('power_id'), town_id) : null;

            var is_already_casted = !!casted_power;

            if (!casted_power) {
                casted_power = HelperPower.createCastedPowerModel($btn.data('power_id'), Game.townId);
            }

            if (is_my_own_town) {
                if (is_already_casted) {
                    $btn.tooltip(TooltipFactory.getCastedPowerTooltip(casted_power)).showTooltip(e);
                } else {
                    $btn.tooltip(TooltipFactory.getCastedPowerWithCostsTooltip(casted_power)).showTooltip(e);
                }
            } else {
                // hide all extending and cost information on foreign towns
                $btn.tooltip(TooltipFactory.getPowerTooltipWithDefaultSettings(casted_power.getPowerId(), casted_power.getConfiguration())).showTooltip(e);
            }
        }
    };
});