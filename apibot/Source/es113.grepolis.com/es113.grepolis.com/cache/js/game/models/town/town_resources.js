/*globals Timestamp, Game, MM, us*/

(function() {
    'use strict';

    var heroes_enum = require('enums/heroes');
    var BOOST_TYPES = require('enums/world_boost_types');

    /**
     * Handles the resource management for a town. It contains all code to calculate the production of the different resources
     * and the final resource amounts.
     * It is used internally by the Town model
     *
     * @class TownResources
     * @constructor
     *
     * @param {Town} town
     */
    function TR(town) {
        this.town = town;
    }

    // globally visible constants (used here and in Town)
    TR.resources = {
        wood: 'lumber',
        stone: 'stoner',
        iron: 'ironer'
    };

    /**
     * @method getResource
     *
     * @param {string} type The resource type, eg. stone, iron or wood
     * @return {float} the anticipated current amount of resources of the given type in town
     */
    TR.prototype.getResource = function(type) {
        var last_res = this.town.get('last_' + type),
            last_update = this.town.get('resources_last_update'),
            production = this.getProduction(type);

        return last_res + ((Timestamp.server() - last_update) * production);
    };

    /**
     * Always returns the production for exactly now (the server time), because it uses the Town.resources_last_update
     * and the Timestamp.server() methods internally (in addition to all the other current game state)
     *
     * @param {string} type The type of resource, eg. wood, iron or stone
     * @return {number} The amount of resoureces produced per second
     * @see GameTown.php->getProduction()
     * @see Town.php->getResProduction()
     * @see GeneralModifications.php->getResourceProductionModificationFactor()
     */
    TR.prototype.getProduction = function(type) {
        var production = this.getBaseProduction(type),
            last_update = this.town.get('resources_last_update'),
            modifier = 1.0;

        // This more or less corresponds to GeneralModifications.php
        // getResourceProductionModificationFactor()
        modifier += this.getPremiumTraderModifier(type);
        modifier += this.getBenefitMultiplier(type, last_update);
        modifier += this.getPowersResourceModifier(type);
        modifier += this.getWonderModifier();
        modifier += this.getHeroModifier(type);
        modifier += this.getWorldBoostResourceModifier(type);
        modifier += this.getArtifactsResourceModifier(type);

        // Milita factor is applied after all factors are calculated and multiplied - not added
        // @see GameTown.php getProduction:180
        modifier *= this.getMilitiaModifier() ? this.getMilitiaModifier() : 1.0;

        // @see models/Towns.php getResProduction
        // second part of the function that applies modifiers, game_speed and does a round
        production *= modifier;
        production *= Game.game_speed;

        production = Math.round(production);

        // this is unique in frontend and not reflected in the backend anywhere
        return production / 3600.0;
    };

    TR.prototype.onGetsWatchedOn = function(resource_delta_property) {
        this.town.on(
            'change:resources_last_update change:last_' + resource_delta_property.propertyName,
            resource_delta_property.calculateAndTriggerVirtualProperty.bind(resource_delta_property, false),
            resource_delta_property
        );
        // TODO we have to listen on benefit changes as well, because those do not trigger an GameTown resource update
        // in the DB. That in return means the resource production in the frontend is not recalculated.
        // This does not have longterm consequences, but it might display a wrong resource amount for at least 10 seconds
    };

    TR.prototype.onWatchStopped = function(resource_delta_property) {
        this.town.off(
            'change:resources_last_update change:last_' + resource_delta_property.propertyName,
            null,
            resource_delta_property
        );
    };

    // @see models/Town.php getResProduction()
    // this is the part of the function without modifiers and game speed
    TR.prototype.getBaseProduction = function(type) {
        var rare_res = this.town.get('resource_rare'),
            plenty_res = this.town.get('resource_plenty'),
            building_level = this.getResourceBuildingLevel(type),
            production;

        if (plenty_res === type && building_level >= 20) {
            production = 3.5 * Math.pow(building_level, 1.32) - 30;
        } else if (rare_res === type && building_level >= 20) {
            production = 3.5 * Math.pow(building_level, 1.14) + 40;
        } else if (building_level === 0) {
            production = 7;
        } else {
            production = 3.5 * Math.pow(building_level, 1.245) + 4;
        }

        return production;
    };

    TR.prototype.getResourceBuildingLevel = function(resource) {
        var buildings = this.town.getBuildings(),
            building_type = this.getBuildingFor(resource);

        return buildings ? buildings.get(building_type) : 0;
    };

    /**
     * @private
     */
    TR.prototype.getBuildingFor = function(type) {
        return TR.resources[type];
    };

    TR.prototype.getArtifactsResourceModifier = function(resource) {
        if (!require('data/features').isArtifactLevelsEnabled() ||
            resource !== this.town.get('resource_plenty') ||
            !this.town.get('on_small_island')
        ) {
            return 0.0;
        }

        var artifacts = MM.getOnlyCollectionByName('PlayerArtifact');

        if (!artifacts) {
            return 0.0;
        }

        var artifact = artifacts.getArtifact(require('enums/artifacts').AMBROSIA);

        if (typeof artifact === 'undefined' || artifact.getLevel() <= 0) {
            return 0.0;
        }

        return artifact.getBonus() / 100;
    };

    TR.prototype.getPremiumTraderModifier = function() {
        var premium = this.town.getPremiumFeatures();

        return (premium && premium.isActivated('trader')) ? Game.constants.premium.trader_resource_boost : 0.0;
    };

    TR.prototype.getBenefitMultiplier = function(type, last_update) {
        var benefits = this.town.getBenefits(),
            modifier = 0.0;

        us.each(benefits, function(benefit) {
            switch (benefit.getType()) {
                case 'happiness':
                    modifier += Game.constants.power.happiness_resource_production_boost;
                    break;
                case 'resource_production':
                    modifier += benefit.getParam(type) * benefit.getTimeCoverage(last_update, Timestamp.server()) * 0.01;
                    break;
            }
        });

        return modifier;
    };

    TR.prototype.getWorldBoostResourceModifier = function(resource) {
        var boosts,
            modifier = 0.0;

        boosts = us.filter(this.getWorldBoosts(), function(boost) {
            var affected_resource_type = boost.getType();
            return boost.getBoostType() === BOOST_TYPES.RESOURCE_PRODUCTION &&
                (affected_resource_type === 'all' || affected_resource_type === resource);
        });

        us.each(boosts, function(boost) {
            modifier += boost.getPercent() * 0.01;
        });

        return modifier;
    };

    TR.prototype.getPowersResourceModifier = function(resource) {
        var powers = this.town.getCastedPowers().concat(this.getCastedAlliancePowers()),
            modifier = 0.0,
            affected_resource_type;

        us.each(powers, function(power) {
            switch (power.getPowerId()) {
                case 'happiness':
                    modifier += Game.constants.power.happiness_resource_production_boost;
                    break;
                case 'happy_folks':
                    modifier += Game.constants.power.happy_folks_resource_production_boost;
                    break;
                case 'pest':
                    modifier -= Game.constants.power.pest_resource_production_malus;
                    break;
                case 'hermes_boost':
                    modifier += Game.constants.power.hermes_boost_resource_production_boost;
                    break;
                case 'resource_boost':
                case 'longterm_resource_boost':
                case 'resource_boost_alliance':
                    // res boost only affecting a special resource type
                    affected_resource_type = power.getConfiguration().type;
                    if (affected_resource_type === 'all' || resource === affected_resource_type) {
                        modifier += (power.getConfiguration().percent * 0.01);
                    }
                    break;
                case 'assassins_resource_boost':
                case 'rare_resource_boost':
                case 'epic_resource_boost':
                case 'a_new_hope':
                case 'loyalty_resource_boost':
                case (resource + '_production_penalty'):
                case 'suffering':
                case 'olympic_merchant':
                case 'missions_power_1':
                    modifier += (power.getConfiguration().percent * 0.01);
                    break;
            }
        });

        return modifier;
    };

    TR.prototype.getWonderModifier = function() {
        var wonders = this.town.getWonders(),
            modifier = 0.0;

        if (us.find(wonders, function(wonder) {
                return wonder.getType() === 'hanging_gardens_of_babylon' && wonder.isMaxExpansionStage();
            })) {
            modifier += Game.constants.wonder.resource_production_modification_for_hanging_gardens;
        }

        return modifier;
    };

    TR.prototype.getMilitiaModifier = function() {
        var militia = this.town.getMilitia();

        return militia ? Game.constants.units.militia_resource_production_bonus : 0.0;
    };

    TR.prototype.getHeroModifier = function(type) {
        var heroes = this.town.getHeroes(),
            modifier = 0.0;

        us.each(heroes, function(hero) {
            var effect_modifier;

            if (hero.isAvailableInTown()) {
                switch (hero.getId()) {
                    case heroes_enum.TERYLEA:
                        if (type === 'iron') {
                            effect_modifier = hero.getEffectModifier()[1];
                            modifier += (effect_modifier.value + (hero.getLevel() * effect_modifier.level_mod));
                        }
                        break;
                    case heroes_enum.REKONOS:
                        if (type === 'stone') {
                            effect_modifier = hero.getEffectModifier()[1];
                            modifier += (effect_modifier.value + (hero.getLevel() * effect_modifier.level_mod));
                        }
                        break;
                    case heroes_enum.YLESTRES:
                        if (type === 'wood') {
                            effect_modifier = hero.getEffectModifier()[1];
                            modifier += (effect_modifier.value + (hero.getLevel() * effect_modifier.level_mod));
                        }
                        break;
                    case heroes_enum.ANDROMEDA:
                        effect_modifier = hero.getEffectModifier()[1];
                        modifier += (effect_modifier.value + (hero.getLevel() * effect_modifier.level_mod));
                        break;
                }
            }
        });

        return modifier;
    };

    TR.prototype.getCastedAlliancePowers = function() {
        return MM.getOnlyCollectionByName('CastedAlliancePowers').getCastedAlliancePowers();
    };

    TR.prototype.getWorldBoosts = function() {
        return MM.getOnlyCollectionByName('WorldBoost').getWorldBoosts();
    };

    window.TownResources = TR;
}());