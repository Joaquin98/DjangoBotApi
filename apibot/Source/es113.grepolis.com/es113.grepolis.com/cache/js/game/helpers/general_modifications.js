/*global ITowns, Game, GameDataResearches, $, GameData, MM, us */

(function(window) {
    'use strict';

    var HEROES = require('enums/heroes'),
        NAVAL_UNITS = require('enums/naval_units'),
        GROUND_UNITS = require('enums/ground_units'),
        Powers = require('enums/powers');

    var GeneralHelper = {
        /**
         * Returns informations about all powers which are casted on the current town
         *
         * @return Object   An array of objects with details about powers
         */
        getCastedPowers: function() {
            return ITowns.getTown(Game.townId).getCastedPowers();
        },

        /**
         * Returns array with power ids which are casted on the current town
         *
         * @return Object   An array with string values inside
         */
        getCastedPowersIds: function() {
            var ids = [],
                casted_powers = this.getCastedPowers(),
                i, l = casted_powers.length;

            for (i = 0; i < l; i++) {
                ids[ids.length] = casted_powers[i].power_id;
            }

            return ids;
        },

        /**
         *
         * Provides all casted powers for the current alliance
         *
         * @returns Array
         */
        getCastedAlliancePowers: function() {
            return MM.getOnlyCollectionByName('CastedAlliancePowers').getCastedAlliancePowers();
        }
    };

    window.GeneralHelper = GeneralHelper;

    var GeneralModifications = {

        /**
         * @return {Number}
         */
        getResearchResourcesModification: function(town_id) {
            var modification_factor = 1.0,
                town = ITowns.getTown(town_id),
                hero;

            if (town.hasHero(HEROES.APHELEDES)) {
                hero = town.getHero(HEROES.APHELEDES);
                if (hero.isAvailableInTown()) {
                    modification_factor *= (1 - hero.getCalculatedBonusForLevel());
                }
            }

            return modification_factor;
        },

        /**
         * @return {Number}
         */
        getResearchTimeModification: function(town_id) {
            var modification_factor = 1.0,
                town = ITowns.getTown(town_id),
                hero;

            if (town.hasHero(HEROES.APHELEDES)) {
                hero = town.getHero(HEROES.APHELEDES);
                if (hero.isAvailableInTown()) {
                    modification_factor *= (1 - hero.getCalculatedBonusForLevel());
                }
            }

            return modification_factor;
        },

        getBuildingBuildResourcesModification: function() {
            var modification_factor = 1,
                researches = ITowns.getTown(Game.townId).researches();

            if (researches.hasResearch('architecture')) {
                modification_factor -= GameData.research_bonus.architecture_bonus;
            }

            return modification_factor;
        },

        getTriumphCost: function() {
            var cost = GameData.celebration_cost,
                casted_powers = GeneralHelper.getCastedPowers(),
                alliance_power_bonus = 0;

            $.each(
                GeneralHelper.getCastedAlliancePowers(),
                function(idx, casted_power) {
                    if (casted_power.attributes.power_id === Powers.CHARITABLE_FESTIVAL_BOOST_ALLIANCE) {
                        alliance_power_bonus += casted_power.attributes.configuration.percent;
                    }
                }
            );

            var power = casted_powers.find(function(power) {
                return power.power_id === Powers.CHARITABLE_FESTIVAL;
            });

            if (power !== undefined) {
                cost -= Math.round((cost / 100) * (power.configuration.percent + alliance_power_bonus));
            }

            return cost;
        },

        getAresSacrificeBonus: function() {
            return GeneralHelper.getCastedAlliancePowers().reduce(
                function(total, casted_power) {
                    return total + (casted_power.attributes.power_id === Powers.ARES_SACRIFICE_BOOST_ALLIANCE) ?
                        casted_power.attributes.configuration.percent :
                        0;
                },
                0
            );
        },

        getStorageVolumeModification: function() {
            var levels_enabled = require('data/features').isArtifactLevelsEnabled();

            if (!levels_enabled) {
                var player = MM.getModelByNameAndPlayerId('Player');

                return player.getDominationArtifactUnlocked() ?
                    1.0 + GameData.artifacts.storage_modification_for_domination_artifact :
                    1.0;
            }

            var artifacts = MM.getOnlyCollectionByName('PlayerArtifact');

            if (!artifacts) {
                return 1.0;
            }

            var artifact = artifacts.getArtifact(require('enums/artifacts').ATHENAS_CORNUCOPIA);

            if (typeof artifact !== 'undefined' && artifact.getLevel() > 0) {
                return 1.0 + artifact.getBonus() / 100;
            }

            return 1.0;
        },

        /**
         * Returns unit build time modifier
         *
         * @param {Number} town_id     the id of the town you want to get info for
         * @param {Boolean} is_naval   determinates whether identifier should be calculated for naval or ground units
         * @todo refactor to accept gd_unit instead if is_naval
         * @todo honor heroes here
         * @return {Number}
         */
        getUnitBuildTimeModification: function(town_id, is_naval) {
            var modification_factor_by_powers = 1,
                modification_factor_by_researches = 1;

            var casted_powers = GeneralHelper.getCastedPowers(),
                researches = ITowns.getTown(Game.townId).getResearches(),
                research_bonus = GameData.research_bonus;

            $.each(casted_powers, function(idx, casted_power) {
                if (is_naval && casted_power.power_id === 'call_of_the_ocean') {
                    modification_factor_by_powers -= research_bonus.call_of_the_ocean_bonus;
                } else if (!is_naval && casted_power.power_id === 'fertility_improvement') {
                    modification_factor_by_powers -= research_bonus.fertility_improvement_bonus;
                } else if (us.contains(
                        ['unit_order_boost', 'longterm_unit_order_boost', 'assassins_unit_order_boost', 'mourning', 'missions_power_2'],
                        casted_power.power_id)) {
                    modification_factor_by_powers -= parseInt(casted_power.configuration.percent, 10) / 100.0;
                } else if (casted_power.power_id === 'mourning') {
                    modification_factor_by_powers += parseInt(casted_power.configuration.percent, 10) / 100.0;
                } else if (casted_power.power_id === 'great_arming') {
                    modification_factor_by_powers *= (1 - parseInt(casted_power.configuration.percent, 10) / 100.0);
                }
            });

            if (is_naval && researches.hasShipwright()) {
                modification_factor_by_researches -= research_bonus.shipwright_bonus;
            }

            if (!is_naval && researches.hasInstructor()) {
                modification_factor_by_researches -= research_bonus.instructor_bonus;
            }

            $.each(
                GeneralHelper.getCastedAlliancePowers(),
                function(idx, casted_power) {
                    if (casted_power.power_id === 'unit_order_boost_alliance' ||
                        casted_power.power_id === 'unit_order_boost_alliance_hera') {
                        var configuration = casted_power.configuration;
                        var type = configuration.type || '';

                        // The configured type must either be "all" or match the type of the current unit
                        if (type === 'all' || (is_naval ? type === 'naval' : type === 'ground')) {
                            modification_factor_by_powers *= 0.01 * (100 - configuration.percent || 0);
                        }
                    }
                }
            );

            return modification_factor_by_powers * modification_factor_by_researches;
        },

        getUnitBuildTime: function(unit_id, building_level, augmentation_bonus, modification_bonus, world_boost_bonus) {
            var gd_unit = GameData.units[unit_id],
                build_time;

            build_time = ((gd_unit.build_time * (1 - Math.pow(building_level - 1, 1.1) / 100)));

            build_time *= modification_bonus;
            build_time *= augmentation_bonus;
            build_time *= world_boost_bonus;

            return Math.max(1, Math.round(build_time));
        },

        getUnitBuildResourcesModification: function(town_id, gd_unit) {
            var modification_factor = 1,
                finished_wonders = us.last(MM.getCollections().Wonder);

            var town = ITowns.getTown(town_id),
                researches = town.getResearches(),
                research_bonus = GameData.research_bonus,
                power;

            if (!gd_unit.is_naval && researches.hasConscription()) {
                modification_factor *= (1 - research_bonus.conscription_bonus);
            }

            if (!gd_unit.is_naval) {
                power = town.getCastedPower('passionate_training');
                if (power) {
                    modification_factor *= (1 - parseInt(power.configuration.percent, 10) / 100.0);
                }
            }

            if (gd_unit.is_naval) {
                power = town.getCastedPower('help_of_the_nereids');
                if (power) {
                    modification_factor *= (1 - parseInt(power.configuration.percent, 10) / 100.0);
                }
            }

            power = town.getCastedPower('great_arming');
            if (power) {
                modification_factor *= (1 - parseInt(power.configuration.percent, 10) / 100.0);
            }

            if (gd_unit.is_naval && researches.hasMathematics()) {
                modification_factor *= (1 - research_bonus.mathematics_bonus);
            }

            if (gd_unit.favor > 0 && finished_wonders.hasWonder('mausoleum_of_halicarnassus')) {
                modification_factor *= (1 - Game.constants.wonder.myth_units_modification_for_mausoleum);
            }

            if (gd_unit.id === GROUND_UNITS.HOPLITE && town.hasHero(HEROES.CHEIRON)) {
                modification_factor *= (1 - town.getHero(HEROES.CHEIRON).getCalculatedBonusForLevel());
            }

            if (gd_unit.id === GROUND_UNITS.ARCHER && town.hasHero(HEROES.PHILOCTETES)) {
                modification_factor *= (1 - town.getHero(HEROES.PHILOCTETES).getCalculatedBonusForLevel());
            }

            if (gd_unit.id === GROUND_UNITS.SWORD && town.hasHero(HEROES.ODYSSEUS)) {
                modification_factor *= (1 - town.getHero(HEROES.ODYSSEUS).getCalculatedBonusForLevel());
            }

            if (gd_unit.id === NAVAL_UNITS.ATTACK_SHIP && town.hasHero(HEROES.ARISTOTLE)) {
                modification_factor *= (1 - town.getHero(HEROES.ARISTOTLE).getCalculatedBonusForLevel());
            }
            if (gd_unit.id === NAVAL_UNITS.BIREME && town.hasHero(HEROES.DAIDALOS)) {
                modification_factor *= (1 - town.getHero(HEROES.DAIDALOS).getCalculatedBonusForLevel());
            }
            if (gd_unit.id === NAVAL_UNITS.TRIREME && town.hasHero(HEROES.EURYBIA)) {
                modification_factor *= (1 - town.getHero(HEROES.EURYBIA).getCalculatedBonusForLevel());
            }

            return modification_factor;
        },
        getWeddingAdditionalResources: function() {
            var bonus_modification = 0;

            var town = ITowns.getTown(Game.townId);
            var wedding_ritual = town.getCastedPower("wedding_of_the_aristocrats");
            if (wedding_ritual) {
                bonus_modification = Math.ceil(town.getStorage() * (wedding_ritual.configuration.percent / 100));
            }
            $.each(
                GeneralHelper.getCastedAlliancePowers(),
                function(idx, casted_power) {
                    if (casted_power.power_id === 'wedding_resource_boost_alliance') {
                        var configuration = casted_power.configuration;
                        var amount = configuration.amount || 0;
                        bonus_modification += amount;
                    }
                }
            );

            return bonus_modification;
        },
        getNeededFavorReductionFactor: function() {
            var modification = 1;

            var town = ITowns.getTown(Game.townId);
            if (town.getCastedPower('grepolympia_championship_4')) {
                modification -= 0.1;
            }
            return modification;
        }
    };

    window.GeneralModifications = GeneralModifications;
}(window));