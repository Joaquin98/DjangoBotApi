/*globals GameData, Game, GeneralModifications */

(function(window) {
    'use strict';

    var GameDataResearches = {
        getBonusArchitecture: function() {
            return GameData.research_bonus.architecture_bonus;
        },
        getBonusBerth: function() {
            return GameData.research_bonus.berth;
        },
        getBonusBuildingCrane: function() {
            return GameData.research_bonus.building_crane_bonus;
        },
        getBonusCallOfTheCcean: function() {
            return GameData.research_bonus.call_of_the_ocean_bonus;
        },
        getBonusCartographySpeed: function() {
            return GameData.research_bonus.cartography_speed;
        },
        getBonusCatapultSpeed: function() {
            return GameData.research_bonus.catapult_speed;
        },
        getBonusColonyShipSpeed: function() {
            return GameData.research_bonus.colony_ship_speed;
        },
        getBonusConscription: function() {
            return GameData.research_bonus.conscription_bonus;
        },
        getBonusFavorLootPerUnit: function() {
            return GameData.research_bonus.favor_loot_per_unit;
        },
        getBonusFertilityImprovement: function() {
            return GameData.research_bonus.fertility_improvement_bonus;
        },
        getBonusInstructor: function() {
            return GameData.research_bonus.instructor_bonus;
        },
        getBonusMathematics: function() {
            return GameData.research_bonus.mathematics_bonus;
        },
        getBonusMeteorologySpeed: function() {
            return GameData.research_bonus.meteorology_speed;
        },
        getBonusPotteryStorage: function() {
            return GameData.research_bonus.pottery_storage;
        },
        getBonusShipwright: function() {
            return GameData.research_bonus.shipwright_bonus;
        },
        getBonusDiplomacyResources: function() {
            return GameData.research_bonus.diplomacy_resources_bonus;
        },
        getBuildTimeReductionCost: function() {
            return Game.constants.premium.finish_research_order_cost;
        },

        getResearchCostsById: function(research_id) {
            var research = GameData.researches[research_id];
            return this.getResearchCosts(research);
        },

        getResearchCosts: function(research) {
            var needed_resources, factor;

            needed_resources = research.resources;
            factor = GeneralModifications.getResearchResourcesModification(Game.townId);
            return {
                wood: Math.ceil(needed_resources.wood * factor),
                stone: Math.ceil(needed_resources.stone * factor),
                iron: Math.ceil(needed_resources.iron * factor)
            };
        },

        getResearchTime: function(research, academy_level) {
            var time, factor;

            time = parseInt(research.required_time * ((100 - Math.pow(academy_level, 1.1)) / 100), 10);

            factor = GeneralModifications.getResearchTimeModification(Game.townId);
            time = Math.floor(time * factor);

            if (time < 1) {
                time = 1;
            }

            return time;
        },

        getResearchPointsPerAcademyLevel: function() {
            return Game.constants.academy.points_per_academy_level;
        },

        getResearchPointsPerLibraryLevel: function() {
            return Game.constants.academy.points_per_library_level;
        },

        /**
         * Return the filename of the research_image
         *
         * @param {String} research_id
         * @return string
         */
        getResearchCssClass: function(research_id) {
            var GameDataFeatureFlags = require('data/features');

            if (!research_id) {
                return null;
            }

            var classname = research_id;

            if (research_id === 'take_over' && GameDataFeatureFlags.isOldCommandVersion()) {
                classname += '_old';
            }

            if (research_id === 'booty' && GameDataFeatureFlags.battlepointVillagesEnabled()) {
                classname += '_bpv';
            }

            return classname;
        }
    };

    window.GameDataResearches = GameDataResearches;
}(window));