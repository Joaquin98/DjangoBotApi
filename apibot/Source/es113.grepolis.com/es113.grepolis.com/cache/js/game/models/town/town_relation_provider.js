/*globals Game, us, MM */

(function() {
    'use strict';

    /**
     * Provides the related models to a town, which is provided in the form of a town id
     *
     * @class TownRelationProvider
     * @constructor
     *
     * @param {integer} town_id
     */
    function TRP(town_id) {
        this.town_id = town_id;
    }

    /**
     * @deprecated
     *
     * @returns {Buildings|*}
     */
    TRP.prototype.buildings = function() {
        return this.getBuildings();
    };

    TRP.prototype.getBuildings = function() {
        return MM.getModels().Buildings && MM.getModels().Buildings[this.town_id];
    };

    /**
     * fetches current build data for buildings in town and triggers force update
     *
     * @returns {GameModels.BuildingBuildData}
     */
    TRP.prototype.getBuildingBuildData = function(callback) {
        var model = MM.getModels().BuildingBuildData && MM.getModels().BuildingBuildData[this.town_id];

        // During gameload we might run into the case that we did not yet receive the buildingBuildData collection
        // and there is no model for the requested town.
        // In this case we simply fetch the model manually.
        if (!model) {
            model = new window.GameModels.BuildingBuildData();
            model.id = this.town_id;
            MM.addModelAndPopulate(model);
            model.forceUpdate(callback);
        } else {
            callback();
        }

        return model;
    };

    TRP.prototype.getCelebrations = function() {
        return us.filter(MM.getModels().Celebrations, function(celebration) {
            return celebration.getTownId() === this.town_id;
        }, this);
    };

    TRP.prototype.premiumFeatures = function() {
        return MM.getModels().PremiumFeatures && MM.getModels().PremiumFeatures[Game.player_id];
    };

    TRP.prototype.benefits = function() {
        return us.values(MM.getModels().Benefit);
    };

    TRP.prototype.getCastedPowers = function() {
        // TODO: This returns the powers for the currently active town, not the town specified by this.town_id
        var collection = MM.getCollections().CastedPowers[0];
        return collection.getCastedPowers();
    };

    TRP.prototype.getCastedPower = function(power_id) {
        // TODO: This returns the power for the currently active town, not the town specified by this.town_id
        var collection = MM.getCollections().CastedPowers[0];
        return us.filter(collection.getCastedPowers(), function(power) {
            return power.getPowerId() === power_id;
        });
    };

    TRP.prototype.wonders = function() {
        return us.values(MM.getModels().Wonder);
    };

    TRP.prototype.militia = function(town_id) {
        return MM.getModels().Militia && MM.getModels().Militia[town_id || this.town_id];
    };

    TRP.prototype.heroes = function() {
        return us.filter(MM.getModels().PlayerHero, function(hero) {
            return hero.isInTown(this.town_id);
        }.bind(this));
    };

    TRP.prototype.researches = function() {
        return MM.getModels().Researches && MM.getModels().Researches[this.town_id];
    };

    // We have two town_agnostic collections for Units: 1 with segmentation key 'current_town_id'
    // this is the one we want all the models from
    TRP.prototype.units = function() {
        var collections = MM.getCollections().Units;
        for (var i = 0; i < collections.length; i++) {
            var collection = collections[i];
            if (collection && us.contains(collections.segmentation_keys, 'current_town_id')) {
                return collection.models;
            }
        }
    };

    /**
     * Get the town model for the town this instance provides relations
     *
     * @method getModel
     *
     * @return {Town}
     */
    TRP.prototype.getModel = function() {
        return MM.getModels().Town[this.town_id];
    };

    window.TownRelationProvider = TRP;
}());