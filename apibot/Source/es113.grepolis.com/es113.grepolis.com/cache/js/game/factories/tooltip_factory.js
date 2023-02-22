/*globals DM, Game, s, GameDataBuildings, GameData, ITowns, us, GameDataPowers, GameDataHeroes, Timestamp,
DateHelper, readableUnixTimestamp, PopupFactory, GameDataQuests, MM, GameDataUnits, WMap */

define('factories/tooltip_factory', function() {
    'use strict';

    var l10n = DM.getl10n('tooltips'),
        ViewHelper = require('view/helper')(),
        Features = require('data/features');

    function getIcon(icon_id) {
        return '<img src="' + Game.img() + '/game/res/' + (icon_id === 'population' ? 'pop' : icon_id) + '.png" alt="' + l10n[icon_id] + '" />';
    }

    function getBuildingHeader(building) {
        return '<h3 style="margin: 10px 0;">' + building.name + ' (' + building.level + ')</h3>';
    }

    function getBuildingMaxLevelReached(building) {
        return s(l10n.max_level_reached, building.name) + '<br />';
    }

    function getTitle(title) {
        return '<strong>' + title + '</strong><br />';
    }

    function getAvailableCurrency(currency_id, currency_amount) {
        return '<span class="available_gold">' + l10n.available_currency[currency_id](currency_amount) + '</span>';
    }

    function getPremiumFeatureInfo(currency_id, tooltip, currency_amount) {
        return '<b><div>' + tooltip + '</div></b><br />' + getAvailableCurrency(currency_id, currency_amount) + '<br />';
    }

    function getReductionInfo(type, available_gold) {
        var tooltip;

        switch (type) {
            case 'building_build_cost':
                var reduction = GameDataBuildings.getBuildingBuildCostReduction(),
                    gold_cost = GameDataBuildings.getBuildingBuildCostReductionPrice();

                tooltip = s(l10n.reductions[type], gold_cost, reduction + '%');
                break;
            case 'hero_cure_time':
                tooltip = s(l10n.reductions[type], GameData.heroes_meta.premium_halve_cure_cost);
                break;
            default:
                break;
        }

        return getPremiumFeatureInfo('gold', tooltip, available_gold);
    }

    /**
     *
     */
    function getNeededTimeInfo(building) {
        return getTitle(l10n.build_time) + getIcon('time') + '<span>' + building.build_time + '</span>';
    }

    /**
     *
     */
    function getDescriptionInfo(building) {
        return '<p style="width: 320px;">' + building.description + '</p>';
    }

    function getResourcesForBuildBuilding(building, ceil, modifier) {
        var requirements = {};

        if (ceil) {
            requirements = {
                wood: {
                    amount: Math.ceil(building.needed_resources.wood * modifier)
                },
                stone: {
                    amount: Math.ceil(building.needed_resources.stone * modifier)
                },
                iron: {
                    amount: Math.ceil(building.needed_resources.iron * modifier)
                },
                population: {
                    amount: building.pop
                }
            };
        } else {
            requirements = {
                wood: {
                    amount: parseInt(building.needed_resources.wood * modifier, 10)
                },
                stone: {
                    amount: parseInt(building.needed_resources.stone * modifier, 10)
                },
                iron: {
                    amount: parseInt(building.needed_resources.iron * modifier, 10)
                },
                population: {
                    amount: building.pop
                }
            };
        }

        return requirements;
    }

    /**
     * Returns resources which are needed to build specific building
     */
    function getNeededResourcesInfo(town_id, building, options) {
        options = options || {};

        var result = '',
            itown = ITowns.getTown(town_id),
            resources = itown.resources(),
            current_production = itown.getProduction(),
            time_to_build = 0,
            enough_population = true,
            enough_resources = true,
            upgrade_not_possible = options.upgrade_not_possible || false,
            modifier = options.modifier || 1,
            ceil = options.ceil || false,
            requirements = getResourcesForBuildBuilding(building, ceil, modifier);

        result += '<strong>' + l10n.build_costs + '</strong><br />';

        us.each(requirements, function(requirement, req_id) {
            result += getIcon(req_id);

            if (requirement.amount > resources[req_id]) {
                upgrade_not_possible = true;

                if (req_id !== 'time') {
                    if (req_id === 'population') {
                        if (requirement.amount > 0) {
                            enough_population = false;
                        } else {
                            upgrade_not_possible = false;
                        }
                    } else {
                        enough_resources = false;

                        if (current_production[req_id] > 0) {
                            var time = parseInt(3600 * parseFloat((requirement.amount - resources[req_id]) / current_production[req_id]), 10);

                            if (time_to_build < time && time > 0) {
                                time_to_build = time;
                            }
                        }
                    }
                }

                result += '<span' + (upgrade_not_possible ? ' style="color:#B00"' : '') + '>' + requirement.amount + '</span>';
            } else {
                result += requirement.amount;
            }
        });

        return {
            result: result,
            upgrade_not_possible: upgrade_not_possible,
            enough_population: enough_population,
            enough_resources: enough_resources,
            time_to_build: time_to_build
        };
    }


    /**
     * Returns informations about requirements needed to construct building
     *
     * @param {Object} building
     * @param {Boolean} [upgrade_not_possible]
     *
     * @return {Object}
     */
    function getDependenciesInfo(building, upgrade_not_possible) {
        upgrade_not_possible = upgrade_not_possible || false;

        var result = '';

        if ($(building.get_dependencies).length) {
            upgrade_not_possible = true;

            result += l10n.requirements + '<br />';

            $.each(building.get_dependencies, function() {
                result += '<span class="requirement">' + s(l10n.building_level_x, this.name, this.needed_level) + '</span><br />';
            });
        }

        return {
            result: result,
            upgrade_not_possible: upgrade_not_possible
        };
    }

    function getPowerLevel(configuration) {
        var level = 0;

        if (configuration && configuration.level) {
            level = configuration.level;
        }

        return level;
    }

    var TooltipFactory = {
        /**
         * Returns power tooltip
         *
         * @param {GameModels.CastedPowers}
         * @param {Object} properties_arg {show_image: boolean, casted_power_end_at: integer}
         * @param {GameModels.CappedPowersProgress} progress
         * @return {String}
         *
         * Instances:
         * casted_power, {show_costs : true}
         * casted_power, {}
         */
        _getCastedPowerTooltip: function(casted_power, show_cost, progress) {
            var properties = {
                casted_power_end_at: casted_power.getEndAt(),
                extendable: casted_power.isExtendable(),
                show_costs: show_cost
            };

            return this.createPowerTooltip(casted_power.getPowerId(), properties, casted_power.getConfiguration(), progress);
        },

        getCastedPowerTooltip: function(casted_power, progress) {
            return this._getCastedPowerTooltip(casted_power, false, progress);
        },

        getCastedPowerWithCostsTooltip: function(casted_power) {
            return this._getCastedPowerTooltip(casted_power, true);
        },

        getBasicPowerTooltip: function(power_id) {
            return this.createPowerTooltip(power_id);
        },

        getBasicPowerTooltipWithoutImage: function(power_id) {
            return this.createPowerTooltip(power_id, {
                show_image: false
            });
        },

        getPowerTooltipWithCountdown: function(power_id, configuration, casted_power_end_at) {
            return this.createPowerTooltip(power_id, {
                casted_power_end_at: casted_power_end_at
            }, configuration);
        },

        getPowerTooltipWithDefaultSettings: function(power_id, configuration) {
            return this.createPowerTooltip(power_id, {
                show_costs: true
            }, configuration);
        },

        getCulturePointsTooltip: function() {
            return '<h4>' + l10n.culture_points.headline + '</h4>' + l10n.culture_points.body;
        },

        /**
         * @param {String} power_id
         * @param {Object} [properties] {show_image: boolean, casted_power_end_at: integer}
         * @param {Object} [configuration_arg]
         * @param {GameModels.CappedPowersProgress} progress
         * @param use_short
         * @return {String}
         */
        createPowerTooltip: function(power_id, properties, configuration_arg, progress, use_short) {
            var configuration = configuration_arg || {},
                level = getPowerLevel(configuration),
                gd_power = GameData.powers[power_id],
                tooltip_data = GameDataPowers.getTooltipPowerData(gd_power, configuration, level, progress, use_short);

            return us.template(DM.getTemplate('COMMON', 'casted_power_tooltip'), $.extend({}, tooltip_data, properties));
        },

        /**
         * Creates a tooltip template from a RewardItem
         * @param {RewardItem} reward
         * @returns {String} tooltip template
         */
        getRewardTooltip: function(reward) {
            return this.createPowerTooltip(reward.getPowerId(), {}, reward.getConfiguration());
        },

        getAwardTooltip: function(award_id, event_id) {
            var award_collection = MM.getOnlyCollectionByName('PlayerAward');

            var award = event_id ?
                award_collection.getByAwardIdAndEventId(award_id, event_id) :
                award_collection.getByAwardId(award_id);

            if (!award) {
                throw 'Unknown award: ' + award_id;
            }
            return award.getName();
        },

        /**
         * calculate the savings for build cost reduced building a building
         *
         * @param {object} building
         * @returns {{wood: number, stone: number, iron: number}}
         */
        getSavedResourcesForReducedBuilding: function(building) {
            var needed_resources = getResourcesForBuildBuilding(building, true, 1),
                needed_resources_reduced = getResourcesForBuildBuilding(building, true, GameDataBuildings.getBuildingBuildCostReductionFactor());

            return {
                wood: needed_resources.wood.amount - needed_resources_reduced.wood.amount,
                stone: needed_resources.stone.amount - needed_resources_reduced.stone.amount,
                iron: needed_resources.iron.amount - needed_resources_reduced.iron.amount
            };
        },

        /**
         * Returns full requirements to build specific building
         */
        getBuildingConstructionRequirements: function(town_id, building, full_queue, show_description) {
            var result = '',
                max_level_reached = false,
                upgrade_not_possible = false;

            var res_info, dep_info;

            result += getBuildingHeader(building);

            if (building.max_level) {
                max_level_reached = true;
                upgrade_not_possible = true;

                result += getBuildingMaxLevelReached(building);
            } else {
                //Get info about needed resources
                res_info = getNeededResourcesInfo(town_id, building, {
                    upgrade_not_possible: upgrade_not_possible
                });

                result += res_info.result + '<br/>';
                upgrade_not_possible = res_info.upgrade_not_possible;

                //Get info about needed time
                result += getNeededTimeInfo(building) + '<br/>';

                //Get info about dependencies
                dep_info = getDependenciesInfo(building, upgrade_not_possible);
                result += dep_info.result;
                upgrade_not_possible = dep_info.upgrade_not_possible;

                //Show info about not enough population
                if (!res_info.enough_population) {
                    upgrade_not_possible = true;
                    result += '<span class="requirement">' + l10n.not_enough_population + '</span><br />';
                }

                //Show info about not enough resources
                if (!res_info.enough_resources) {
                    upgrade_not_possible = true;

                    if (!building.enough_storage) {
                        result += '<span class="requirement">' + l10n.too_small_storage + '</span><br />';
                    } else {
                        result += '<span class="requirement">' + l10n.not_enough_resources + '</span><br />' +
                            '<span class="requirement">' +
                            s(l10n.enough_resources_in, DateHelper.formatDateTimeNice(Timestamp.server() + res_info.time_to_build, false)) +
                            '</span><br />';
                    }
                }

                if (full_queue) {
                    upgrade_not_possible = true;
                    result += l10n.full_queue + '<br />';
                }
            }

            if (show_description) {
                result += getDescriptionInfo(building);
            }

            return {
                result: result,
                max_level_reached: max_level_reached,
                upgrade_not_possible: upgrade_not_possible
            };
        },

        getBuildingConstructionRequirementsWidthCostReduction: function(town_id, building, available_gold, full_queue) {
            var result = '',
                res_info,
                dep_info,
                max_level_reached = false,
                upgrade_not_possible = false;

            result += getBuildingHeader(building);

            if (building.max_level) {
                max_level_reached = true;
                upgrade_not_possible = true;

                result += getBuildingMaxLevelReached(building);
            } else {
                res_info = getNeededResourcesInfo(town_id, building, {
                    modifier: GameDataBuildings.getBuildingBuildCostReductionFactor(),
                    ceil: true,
                    upgrade_not_possible: upgrade_not_possible
                });
                upgrade_not_possible = res_info.upgrade_not_possible;

                result += res_info.result + '<br /><br />';

                //Get feature description and info about available gold
                result += getReductionInfo('building_build_cost', available_gold);
                if (!res_info.enough_resources || !res_info.enough_population) {
                    upgrade_not_possible = true;
                }

                dep_info = getDependenciesInfo(building, upgrade_not_possible);
                upgrade_not_possible = upgrade_not_possible || dep_info.upgrade_not_possible;

                if (full_queue) {
                    upgrade_not_possible = true;
                    result += l10n.full_queue + '<br />';
                }
            }

            return {
                result: result,
                upgrade_not_possible: upgrade_not_possible,
                max_level_reached: max_level_reached
            };
        },

        getAvailableGold: function(gold) {
            return getAvailableCurrency('gold', gold);
        },

        getReductionInfo: function(type, available_gold) {
            return getReductionInfo(type, available_gold);
        },

        /*
         * options = {
        	show_portrait: true,
        	show_statistics: true,
        	show_description: true,
        	show_requirements: false
        	}
         *
         */
        getHeroCard: function(hero_id, options) {
            var hero_card = DM.getTemplate('heroes', 'hero_card'),
                hero_data = us.extend({
                    portrait: hero_id
                }, GameData.heroes[hero_id]),
                settings = us.extend({
                    hero: hero_data,
                    l10n: l10n.hero_card
                }, options);

            if (!GameData.heroes[hero_id]) {
                throw 'unknown hero: ' + hero_id;
            }

            settings.hero_level = settings.hero_level || hero_data.default_level;

            us.each(hero_data.description_args, function(arg, key, list) {
                var value = arg.value,
                    modifier = arg.level_mod,
                    calculated_value = value + modifier * settings.hero_level;

                settings.hero.description_replaced = settings.hero.description.replace(new RegExp("%" + key, "g"), parseFloat((calculated_value * 100).toFixed(2)).toPrecision());
            });

            return us.template(hero_card, settings);
        },

        getUnitCard: function(unit_id, options) {
            if (!unit_id || !GameData.units[unit_id]) {
                return;
            }

            var getCategory = function(unit) {
                if (unit.is_naval) {
                    return 'naval';
                } else if (typeof unit.capacity === 'undefined') {
                    return 'land';
                } // there are no land units with capacity
            };

            var unit_card = DM.getTemplate('units', 'unit_card'),
                unit_data = GameData.units[unit_id],
                isMythical = typeof(unit_data.god_id) !== 'undefined' && unit_data.god_id !== null,
                settings = us.extend({
                    unit: unit_data,
                    l10n: l10n.unit_card,
                    category: getCategory(unit_data),
                    isMythical: isMythical,
                    show_statistics: true,
                    show_description: true,
                    additional_info: '',
                    unit_info_classes: GameDataUnits.getCombinedIconCssClasses(unit_id),
                    unit_skin_class: '',
                    hide_population: false,
                    skin: ''
                }, options);

            return us.template(unit_card, settings);
        },

        // This supplies a generic info card for the artifact that can be won on the current world
        // It does not include how many levels can be won, as this depends on the ranking(s)
        getArtifactCard: function(artifact_id, options) {
            var template = DM.getTemplate('artifacts', 'artifact_card'),
                l10n = DM.getl10n('god_selection', 'artifacts'),
                settings = us.extend({
                    l10n: l10n[artifact_id],
                    artifact_id: artifact_id,
                    _grepo_box: ViewHelper._grepo_box,
                    _game_border: ViewHelper._game_border,
                    is_artifact_levels_enabled: Features.isArtifactLevelsEnabled(),
                    unlocked: true
                }, options);

            return us.template(template, settings);
        },

        getBuyHeroSlotTooltip: function(available_gold) {
            var text = l10n.buy_hero_slot,
                currency_id = 'gold',
                cost = GameDataHeroes.getSlotCost();

            return getPremiumFeatureInfo(currency_id, text(cost), available_gold);
        },

        /**
         * Tooltip which is used for Tutorial Quests (near the red chest) and also in "heroes_welcome" screen
         */
        getTutorialQuestsProgressbarTooltip: function() {
            return us.template(DM.getTemplate('quest_progressbar').tooltip, {
                l10n: DM.getl10n('progessables', 'quest').progressbar,
                quests_left_count: GameDataQuests.getTutorialQuestsLeftCount(),
                show_hero_reward: GameDataHeroes.areHeroesEnabled() && !Game.quest_tutorial_andromeda_exists
            });
        },

        /**
         * Format resources
         *
         * @param resources Object
         * @param separator String
         *
         * @todo: Maybe put this somewhere else together with other format helper functions
         */
        getRefundTooltip: function(resources) {
            var html = '',
                res_id, path = Game.img(),
                gd_resources = GameData.resources,
                separator = ' ';

            for (res_id in gd_resources) {
                if (gd_resources.hasOwnProperty(res_id)) {
                    html += '<img src="' + path + '/game/res/' + res_id + '.png" alt=""/> ' + resources[res_id] + separator;
                }
            }

            if (resources.gold) {
                html += '<img src="' + path + '/game/res/gold.png" alt=""/> ' + resources.gold + separator;
            }

            if (resources.favor) {
                html += '<img src="' + path + '/game/res/favor.png" alt=""/> ' + resources.favor + separator;
            }

            return s(l10n.refund, html);
        },

        /**
         * Returns tooltip for single trade in menu bubble
         *
         * @param {GameModels.Trade} trade
         *
         * @return {String}
         */
        getTradeTooltip: function(trade) {
            var res_id, resources = trade.getResources(),
                popup_text = '';

            for (res_id in resources) {
                if (resources.hasOwnProperty(res_id) && resources[res_id] > 0) {
                    popup_text += '<img src="' + Game.img() + '/game/res/' + res_id + '.png" alt=""/> ' + resources[res_id] + ' ';
                }
            }

            popup_text += '<br />' + s(l10n.arrival_at, readableUnixTimestamp(trade.getArrivalAt(), 'player_timezone'));

            return popup_text;
        },

        /**
         * Returns tooltip for the resources counter
         *
         * @param {String} resource_type
         * @param {Object} data
         *     {Number} data.production
         *     {Number} data.storage_size
         *     {String} data.resource_rare
         *     {String} data.resource_plenty
         */
        getResourcesTooltip: function(resource_type, data) {
            var local_l10n = l10n.resources,
                icon_plenty = data.resource_plenty.substr(0, 1).toUpperCase(),
                icon_rare = data.resource_rare.substr(0, 1).toLowerCase(),
                icon_class_suffix = icon_plenty + icon_rare,
                resource_rare = data.resource_rare || '',
                resource_plenty = data.resource_plenty || '',
                show_rare_plenty_hint = (resource_rare === resource_type) || (resource_plenty === resource_type);

            var tooltip = us.template(DM.getTemplate('COMMON', 'resources_tooltip'), {
                l10n: local_l10n,
                icon_class_suffix: icon_class_suffix,
                resource_type: resource_type,
                production: data.production,
                storage_size: data.storage_size,
                resource_rare: resource_rare,
                resource_plenty: resource_plenty,
                show_rare_plenty_hint: show_rare_plenty_hint
            });

            return tooltip;
        },

        getPopulationTooltip: function() {
            return '<b>' + l10n.free_population + '</b>';
        },

        getFavorsTooltip: function(favors) {
            var popup_html, favor;
            popup_html = '<h4>' + l10n.favor + '</h4>';
            popup_html += '<ul>';

            for (var key in favors) {
                if (favors.hasOwnProperty(key)) {
                    favor = favors[key];

                    if (favor.production) {
                        popup_html += '<li>' + favor.god + ': ' + favor.current + ' - ' + l10n.production_per_hour + ' ' + favor.production + '</li>';
                    }
                }
            }
            popup_html += '</ul>';

            return popup_html;
        },

        getFuryTooltip: function(current_fury, max_fury) {
            return '<h4>' + l10n.fury + '</h4>' +
                '<div>' + current_fury + '/' + max_fury + '</div>';
        },

        getCultureOverviewTooltip: function() {
            var player_model = MM.getModelByNameAndPlayerId('Player'),
                l10n_overview = l10n.culture_overview,
                owned_towns = MM.getOnlyCollectionByName('Town').length,
                cultural_level = player_model.getCulturalStep(),
                cultural_points = player_model.getCulturalPoints(),
                needed_cultural_points_for_next_step = player_model.getNeededCulturalPointsForNextStep(),
                html;

            html = l10n_overview.cities(owned_towns, cultural_level) + '<br />' +
                l10n_overview.cultural_level(cultural_level) + '<br />' +
                l10n_overview.cultural_points(cultural_points, needed_cultural_points_for_next_step) + '<br /><br />' +
                l10n_overview.description;

            return html;
        },

        getAdvisorTooltip: function(advisor_id) {
            return PopupFactory.texts[advisor_id + '_info'];
        },

        getTitle: function(title) {
            return getTitle(title);
        },

        getIcon: function(icon_id) {
            return getIcon(icon_id);
        },

        getPremiumFeatureInfo: function(currency_id, tooltip, currency_amount) {
            return getPremiumFeatureInfo(currency_id, tooltip, currency_amount);
        },

        getResearchTooltip: function(research_id) {
            return '<b>' + GameData.researches[research_id].name + '</b><br/><br/>' + GameData.researches[research_id].description;
        },

        getSpecialBuildingTooltip: function(building_id) {
            return '<b>' + GameData.buildings[building_id].name + '</b><br/><br/>' + GameData.buildings[building_id].description;
        },

        getUnitListTooltip: function(units) {
            var tooltip = '';

            for (var unit in units) {
                if (units.hasOwnProperty(unit)) {
                    if (units[unit] === null || units[unit] <= 0) {
                        continue;
                    }

                    if (tooltip.length !== 0) {
                        tooltip += '<br />';
                    }

                    tooltip += '<b>' + GameData.units[unit].name_plural + ':</b> ' + units[unit];
                }
            }

            return tooltip;
        },

        getOlympusTemplePowerList: function(powers, temple) {
            return '<ul>' + powers.map(
                function(power) {
                    if (!GameData.powers.hasOwnProperty(power.power_id)) {
                        return '';
                    }

                    var configuration = power.configuration;
                    var gd_power = GameData.powers[power.power_id];

                    if (power.power_id === 'portal_to_olympus_alliance') {
                        if (temple !== undefined) {
                            configuration.type = temple.getSea();

                            if (!configuration.type) {
                                configuration.type = WMap.getSea(temple.getIslandX(), temple.getIslandY()).join('');
                            }
                        }

                        if (!configuration.type) {
                            // Fallback to name (without sea number) if none is available
                            return GameDataPowers.getTooltipPowerData(gd_power, configuration, 0).i_name;
                        }
                    }

                    return GameDataPowers.getTooltipPowerData(gd_power, configuration, 0).i_descr;
                }
            ).reduce(
                function(accumulator, list_item) {
                    return list_item ? accumulator + '<li>' + list_item + '</li>' : accumulator;
                },
                ''
            ) + '</ul>';
        },

        getAlliancePowersTooltip: function(origin, powers) {
            return '<div class="alliance_powers with_points">' +
                '<div class="title">' +
                '<div class="power_icon30x30 ' + origin + '_temple_powers"></div>' +
                this.getTitle(l10n.alliance_powers.olympus_temple_powers[origin]) +
                '</div>' +
                this.getOlympusTemplePowerList(powers) +
                '</div>';
        },

        getAlliancePowersReportTooltips: function(origin, powers, powers_configurations) {
            var power_list = [];

            powers.forEach(function(power) {
                var configs = powers_configurations[power];
                configs.forEach(function(config) {
                    if (origin === config.origin) {
                        power_list.push({
                            power_id: power,
                            configuration: config
                        });
                    }
                });
            });
            return TooltipFactory.getAlliancePowersTooltip(origin, power_list);
        },

        getOlympusTempleTooltip: function(temple) {
            var TempleSizes = require('enums/temple_sizes'),
                Helper = require('helpers/olympus'),
                MovementTooltipHelper = require('helpers/movement_tooltip_helper'),
                powers = temple.getBuff(),
                owner = temple.getAllianceName() || l10n.olympus,
                temple_name = temple.getName(),
                temple_protection_ends = temple.getTempleProtectionEnds(),
                god = temple.getGod(),
                is_olympus = temple.getTempleSize() === TempleSizes.OLYMPUS,
                is_small = temple.getTempleSize() === TempleSizes.SMALL,
                is_large = temple.getTempleSize() === TempleSizes.LARGE,
                movement_data = MovementTooltipHelper.createMovementTooltipData(temple),
                result;

            result = '<div class="olympus_temple_tooltip alliance_powers">';

            if (god) {
                god = GameData.gods[god].name;
            }

            if (is_small && god) {
                temple_name = l10n.small_temple_name(temple_name, god);
            }

            if (is_large && god) {
                temple_name = l10n.large_temple_name(god);
            }

            result += l10n.olympus_temple(temple_name, owner);

            powers = Object.keys(powers).map(function(power_id) {
                return {
                    power_id: power_id,
                    configuration: powers[power_id]
                };
            });

            if (powers.length > 0) {
                result += '<br /><br />' + this.getOlympusTemplePowerList(powers, temple);
            }

            if (temple_protection_ends > Timestamp.now()) {
                temple_protection_ends = DateHelper.timestampToDateTime(temple_protection_ends);
                result += '<br /><br /><b>' + l10n.temple_protection_ends(temple_protection_ends) + '</b>';
            }

            if (is_olympus) {
                result += '<br /><br /><b>' + l10n.next_jump(Helper.getOlympusNextJumpAtTimestamp());
            }

            if (movement_data) {
                result += '<br /><br /><table>' + movement_data + '</table>';
            }

            result += '</div>';

            return result;
        },

        getArtifactDistributionTooltip: function(artifact_id, data) {
            var l10n_artifacts = DM.getl10n('god_selection', 'artifacts'),
                artifact_name = l10n_artifacts[artifact_id].name,
                description;

            if (data.artifact_levels > 0) {
                description = l10n.artifact_distribution.all_players(data.artifact_levels, artifact_name) + '<br><br>' +
                    l10n.artifact_distribution.top_players(data.top_players) + ' ' +
                    l10n.artifact_distribution.top_players_additional(data.top_players_artifact_levels);
            } else {
                description = l10n.artifact_distribution.top_players_level_0(
                    data.top_players, data.top_players_artifact_levels, artifact_name
                );
            }

            return '<div class="artifact_distribution_tooltip">' +
                '<div class="artifact artifact_icons56x56 ' + artifact_id + '"></div>' +
                '<div class="description">' + description + '</div>' +
                '</div>';
        }
    };

    window.TooltipFactory = TooltipFactory;
    return TooltipFactory;
});