/*globals GameData, Logger, Game, GameModels, hours_minutes_seconds, GeneralModifications, MM */

define('data/powers', function() {
    'use strict';

    function getConfigurationValue(configuration, configuration_key, level, power_name) {
        var configuration_value = configuration[configuration_key];
        if (!configuration_value && GameData.powers[power_name].is_upgradable) {
            // handling of upgradable powers
            configuration_value = level > 0 ? "cast" : "not_cast";
        }
        return configuration_value;
    }

    function _unpackEffectProperty(effect_property, configuration, power_name, level) {
        var configuration_key, configuration_value,
            effect_sub_type, effect_sub_property;

        if (typeof(effect_property) === 'string') {
            return effect_property;
        } else {
            for (configuration_key in effect_property) {
                if (effect_property.hasOwnProperty(configuration_key)) {
                    configuration_value = getConfigurationValue(configuration, configuration_key, level, power_name);
                    effect_sub_type = effect_property[configuration_key];

                    if (configuration_value !== undefined) {
                        effect_sub_property = effect_sub_type[configuration_value];
                        if (effect_sub_property !== undefined) {
                            return effect_sub_property;
                        } else {
                            Logger.get('error').log('Power ' + power_name + ' has no description of type ' + configuration_key + ' for value ' + configuration_value);
                        }
                    } else {
                        Logger.get('error').log('Power ' + power_name + ' has no configuration field ' + configuration_key);
                    }
                }
            }
        }
    }

    var GameDataPowers = {
        getPowerIsEnabled: function(power_id) {
            var power_data = GameData.powers[power_id];
            return power_data.god_id === null || Game.gods_active.hasOwnProperty(power_data.god_id);
        },

        getPowerExtensionCost: function() {
            return Game.constants.premium.extend_power_cost;
        },

        getCastablePowersOnTown: function() {
            return GameData.godPowersTown;
        },

        getCastablePowersOnOtherTowns: function() {
            return GameData.godPowersForOtherTowns;
        },

        getCastablePowersOnCommand: function() {
            return GameData.godPowersCommand;
        },

        /**
         * returns true, if the amount for the given power should be shown
         * @param {string} power_id
         * @returns {Boolean}
         */
        displayRewardAmount: function(power_id) {
            return GameData.powers[power_id].display_amount === true;
        },

        /**
         * returns true, if the power is wasteable (for example if your storage is full, but you get a instant resource power, the wasteable dialog should appear)
         * @param {string} power_id
         * @returns {Boolean}
         */
        isWasteable: function(power_id) {
            return GameData.powers[power_id].wasteable === true;
        },

        /**
         * returns true, if the power is a capped power (for example if your storage is full, but you get a instant resource power, the wasteable dialog should appear)
         * @param {string} power_id
         * @returns {Boolean}
         */
        isCapped: function(power_id) {
            return GameData.powers[power_id].is_capped === true;
        },

        getUpgradableCssClass: function(power_id) {
            var power = GameData.powers[power_id];

            return power && power.is_upgradable && !power.passive ? ' upgradable' : '';
        },

        /**
         * Returns Css class for the casted power.
         *
         * @todo When we will get rid of casted powers object which are not Bakcbone Models
         * please move this function to the {GameModels.CastedPowers}
         *
         * @param {Object} casted_power   its GameModels.CastedPowers.attributes
         */
        getCssPowerId: function(casted_power) {
            if (casted_power.power_id === 'longterm_unit_order_penalty') {
                return casted_power.configuration.type;
            }

            var gd_power = GameData.powers[casted_power.power_id],
                configuration = $.extend({
                    casted_power_end_at: casted_power.end_at
                }, casted_power.configuration),
                level = !gd_power.passive && casted_power.configuration ? casted_power.configuration.level : 0,
                data = this.getTooltipPowerData(gd_power, configuration, level);

            return data.i_id + (data.i_skin ? ' ' + data.i_skin : '');
        },

        getCssPowerIdSelector: function(casted_power) {
            return (this.getCssPowerId(casted_power)).split(' ').map(function(element) {
                return '.' + element;
            }).join('');
        },

        getCssPowerIdWithLevel: function(css_power_id, level, power_id) {
            if (GameData.powers[power_id].passive) {
                level = 0; // Passive powers will not show level icons
            }

            return css_power_id + (level ? ' lvl lvl' + level : '') +
                this.getUpgradableCssClass(power_id);
        },

        /**
         * Returns reward image class name
         *
         * @param {GameModels.RewardItem.attributes} reward_arg
         *     @param {power_id}
         *     @param {configuration}
         *
         * @return {String}
         */
        getRewardCssClassIdWithLevel: function(reward_arg) {
            var level = 0,
                reward = reward_arg instanceof GameModels.RewardItem ? reward_arg.attributes : reward_arg,
                skin = '';

            if (reward.power_id === 'population_boost') {
                return reward.power_id + '_' + reward.configuration.type;
            }

            if (reward.configuration && reward.configuration.type) {
                skin = reward.configuration.type;
            }

            if (reward.type === 'hero' || reward.type === 'culture_level') {
                return reward.type + ' ' + reward.subtype;
            }

            var gd_power = GameData.powers[reward.power_id];

            if (reward.configuration && reward.configuration.level && !gd_power.passive) {
                level = reward.configuration.level; // Passive powers will not show level icons
            }

            var tooltip_data = GameDataPowers.getTooltipPowerData(gd_power, reward.configuration, level);

            return GameDataPowers.getCssPowerIdWithLevel(tooltip_data.i_id + ' ' + skin, level, gd_power.id);
        },

        /**
         * Returns power name for the casted power.
         *
         * @todo When we will get rid of casted powers object which are not Backbone Models
         * please move this function to the {GameModels.CastedPowers}
         *
         * @param {Object} casted_power   its GameModels.CastedPowers.attributes
         */
        getPowerName: function(casted_power) {
            var gd_power = GameData.powers[casted_power.power_id],
                configuration = $.extend({
                    casted_power_end_at: casted_power.end_at
                }, casted_power.configuration),
                level = casted_power.configuration ? casted_power.configuration.level : 0;

            return this.getTooltipPowerData(gd_power, configuration, level).i_name;
        },

        /**
         * Since backend delivers a string that has placeholders starting with 0 instead of 1 you can use this function to reindex every occurrence
         * of a placeholder in order to use it with the common.js s function
         * @param power Power
         * @param {String/boolean} skin
         * @returns {string}
         */
        getReindexEffectString: function(power, skin) {
            var power_effect = power.effect.type ? power.effect.type[skin] : power.effect;
            return power_effect.replace(/%(\d)/g, function(a, b) {
                var newIndex = parseInt(b, 10) + 1;
                return "%" + newIndex;
            });
        },

        getTooltipPowerData: function(gd_power, configuration_arg, level, progress, use_short) {
            var configuration = $.extend({}, configuration_arg),
                id = gd_power.id || gd_power.power_id,
                description = gd_power.description,
                effect_description = gd_power.effect,
                meta_idx,
                meta_fields_length = gd_power.meta_fields && gd_power.meta_fields.length,
                meta_field,
                config_value,
                power_name = gd_power.name,
                needed_population = {},
                skin = '',
                current_progress = 0,
                limit = 0,
                fury_cost = 0,
                battlepoint_power_ids = [
                    'divine_battle_strategy_rare',
                    'divine_battle_strategy_epic',
                    'naval_battle_strategy_rare',
                    'naval_battle_strategy_epic',
                    'land_battle_strategy_rare',
                    'land_battle_strategy_epic'
                ];

            if (configuration.cf_on && configuration[configuration.cf_on] && level) {
                configuration[configuration.cf_on] = configuration[configuration.cf_on] * level;
            }

            if (gd_power.short_effect && use_short) {
                effect_description = gd_power.short_effect;
            }

            effect_description = _unpackEffectProperty(effect_description, configuration, id, level);
            description = _unpackEffectProperty(description, configuration, id, level);
            power_name = _unpackEffectProperty(power_name, configuration, id, level);

            var replacement_data = [],
                replaceBy = function(match) {
                    // Remove the "%" from "%x"
                    var nr = match.substr(1);
                    if (replacement_data[nr] !== undefined) {
                        return replacement_data[nr];
                    } else {
                        return match;
                    }
                };

            if (id === 'population_boost') {
                id = 'population_boost' + '_' + configuration_arg.type;
            }

            if (configuration.fury_used && configuration.fury_used > 0) {
                fury_cost = configuration.fury_used;
            } else if (gd_power.fury_percentage_cost > 0) {
                fury_cost = (gd_power.fury_percentage_cost * MM.getModelByNameAndPlayerId('PlayerGods').getFury()) / 100;
                fury_cost = fury_cost === 0 ? 0 : Math.round(Math.max(fury_cost, 1));
            }

            for (meta_idx = 0; meta_idx < meta_fields_length; ++meta_idx) {
                meta_field = gd_power.meta_fields[meta_idx];
                config_value = null;

                if (meta_field === 'lifetime') {
                    // Lifetime COULD be set in metadata, but doesn't have to be set!
                    if (configuration[meta_field]) {
                        config_value = hours_minutes_seconds(configuration[meta_field], true);
                    } else {
                        config_value = hours_minutes_seconds(gd_power.lifetime, true);
                    }
                } else if (configuration[meta_field]) {
                    config_value = configuration[meta_field];
                }

                if ((gd_power.id === 'unit_training_boost' ||
                        gd_power.id === 'instant_unit_package' ||
                        gd_power.id === 'unit_training_boost_non_scaling') &&
                    meta_field === 'type_plural' && configuration.type) {
                    config_value = configuration.type;
                }

                if (gd_power.id === 'divine_sign' || gd_power.id === 'patroness') {
                    config_value = configuration.type;
                }

                if (gd_power.id === 'culture_points') {
                    id = 'culture_level';
                }

                if ((meta_field === 'limit' || meta_field === 'progress') &&
                    battlepoint_power_ids.indexOf(gd_power.id) !== -1
                ) {
                    if (typeof progress !== 'undefined' && progress !== null && progress !== false) {
                        // Typeof progress = CappedPowersProgresses
                        current_progress = progress.getProgress();
                        limit = progress.getLimit();

                        config_value = meta_field === 'limit' ? limit : current_progress;
                    } else {
                        config_value = configuration[meta_field] ?
                            configuration[meta_field].battlepoints :
                            gd_power.meta_defaults[meta_field].battlepoints;
                    }
                }

                if ((gd_power.id === 'unit_training_boost' || gd_power.id === 'instant_unit_package' ||
                        gd_power.id === 'unit_training_boost_non_scaling' || (gd_power.id === 'divine_sign' ||
                            gd_power.id === 'patroness') && configuration.type) &&
                    (meta_field === 'type' || meta_field === 'type_plural')) {
                    if (gd_power.id === 'instant_unit_package') {
                        id = configuration_arg.type + '_instant';
                    } else if (gd_power.id === 'unit_training_boost_non_scaling') {
                        id = configuration_arg.type + '_generation_non_scaling';
                    } else if (gd_power.id === 'divine_sign' || gd_power.id === 'patroness') {
                        id = gd_power.id;
                    } else {
                        id = configuration_arg.type + '_generation';
                    }

                    var amount = configuration.amount || 1,
                        population_per_unit = GameData.units[configuration.type].population,
                        hours = Math.floor(configuration.lifetime / 3600) || 1;

                    if (amount === 1 && meta_field !== 'type_plural') {
                        config_value = GameData.units[config_value].name;
                    } else {
                        config_value = GameData.units[config_value].name_plural;
                    }

                    needed_population = {
                        all: population_per_unit * hours * amount,
                        unit: population_per_unit
                    };
                } else if (meta_field === 'type') {
                    var type_based_instant_resources = [
                        'instant_resources',
                        'instant_resources_rare',
                        'instant_resources_epic'
                    ];
                    if (type_based_instant_resources.indexOf(gd_power.id) >= 0) {
                        id = gd_power.id + '_' + configuration_arg.type;
                        config_value = GameData.resource_names[config_value];
                    } else if (gd_power.id === 'resource_boost') {
                        id = 'resource_' + configuration_arg.type;
                        config_value = GameData.resource_names[config_value];
                    } else if (gd_power.id === 'instant_currency' || gd_power.id === 'instant_currency_crm') {
                        id = configuration_arg.type + '_generation';
                        config_value = GameData.resource_names[config_value];
                    } else if (gd_power.id === 'longterm_resource_boost') {
                        id = 'longterm_' + configuration_arg.type + '_boost';
                        config_value = GameData.resource_names[config_value];
                    } else if (gd_power.id === 'hero') {
                        config_value = GameData.heroes[config_value].name;
                    } else if (
                        [
                            'unit_attack_boost_alliance',
                            'unit_attack_defense_boost_alliance',
                            'unit_defense_boost_alliance'
                        ].indexOf(gd_power.id) !== -1
                    ) {
                        config_value = GameData.units[config_value].name_plural;
                    } else if (gd_power.id === 'mythical_type_attack_boost_alliance') {
                        config_value = Game.mythical_types[config_value];
                    } else if (gd_power.id === 'attack_type_boost_alliance' ||
                        gd_power.id === 'attack_defense_boost_alliance') {
                        config_value = Game.attack_types[config_value];
                    } else if (gd_power.id === 'resource_boost_alliance') {
                        config_value = GameData.resource_names[config_value];
                    }

                    if (configuration_arg.type !== undefined) {
                        // we have to check if the type is set, because the god powers like 'kingly gift' don't use configuration args.
                        skin = configuration_arg.type;
                    }
                }

                if (config_value === null && gd_power.meta_defaults && gd_power.meta_defaults[meta_field]) {
                    config_value = gd_power.meta_defaults[meta_field];
                }

                // we have some negative powers with negative values. So just for output we have to convert it to positive values
                if (typeof config_value === 'number') {
                    config_value = Math.abs(config_value);
                }

                replacement_data.push(config_value);
            }

            var power = Object.assign({}, gd_power);
            power.favor = gd_power.favor * GeneralModifications.getNeededFavorReductionFactor();

            return {
                i_id: id,
                i_name: power_name.replace(/%\d/g, replaceBy),
                i_descr: description.replace(/%\d/g, replaceBy),
                i_effect: effect_description.replace(/%\d/g, replaceBy),
                i_favor: power.favor,
                i_level: gd_power.passive ? 0 : level, // Passive powers will not show level icons
                i_skin: skin,
                i_upgradable: (gd_power.is_upgradable && !gd_power.passive) ? ' upgradable' : '',
                population: needed_population,
                fury_cost: fury_cost,
                power: power
            };
        }
    };

    window.GameDataPowers = GameDataPowers;
    return GameDataPowers;
});