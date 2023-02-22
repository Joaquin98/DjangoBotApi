/*globals GrepolisModel, GameData, GameDataBuildings, Game, TownRelationProvider, TownResources,
DeltaProperty, TownStorage */

(function() {
    'use strict';

    /**
     * Model which is mapped to GameTown
     *
     * @class Town
     *
     * @property {Number} id
     * @property {String} name
     * @property {Number} player_id
     * @property {Boolean} has_conqueror   If there currently is a conquest running on the town
     * @property {Number} population   The blocked (used by units/buildings) population of the town
     * @property {Number} available_population   The fre-to-use population usually displayed
     * @property {Number} population_extra   Extra population given to the town thru powers and effects
     * @property {Number} last_iron   In the database the field is only called iron. It contains the amount of iron at resources_last_update
     * @property {Number} last_stone   In the database the field is only called stone. It contains the amount of stone at resources_last_update
     * @property {Number} last_wood   In the database the field is only called wood. It contains the amount of wood at resources_last_update
     * @property {String} resource_plenty   The resource rarity on the island
     * @property {String} resource_rare   The resource rarity on the island
     * @property {Number} resources_last_update
     * @property {Number} points
     * @property {Number} player_points
     * @property {Number} available_trade_capacity
     */
    var Town = function() {}, // never use this, because it will be overwritten
        resource;

    Town.urlRoot = 'Town';
    Town.RESOURCE_TIMEOUT = 'resource_timeout';

    GrepolisModel.addAttributeReader(Town,
        'id',
        'name',
        'island_x',
        'island_y',
        'island_id',
        'available_population',
        'population_extra',
        'resource_plenty',
        'resource_rare',
        'points',
        'god',
        'available_trade_capacity',
        'max_trade_capacity',
        'island_x',
        'island_y',
        'link_fragment',
        'espionage_storage',
        'abs_x',
        'abs_y'
    );

    function nextChangeInMethod(propertyCalculationResults) {
        return 1 / propertyCalculationResults.rate;
    }

    function hasImmediateChangeMethod(lastTriggeredVirtualPropertyValue, currentValue) {
        return Math.abs((Math.round(lastTriggeredVirtualPropertyValue) - Math.round(currentValue))) > 1.0;
    }

    /**
     * @method initialize
     * @constructor
     * @protected
     */
    Town.initialize = function( /*params*/ ) {
        var resource_id;

        this.relation_provider = new TownRelationProvider(this.id);
        this.resources = new TownResources(this);
        this.storage = new TownStorage(this);

        for (resource_id in TownResources.resources) {
            if (TownResources.resources.hasOwnProperty(resource_id)) {
                this[resource_id + '_delta_property'] = new DeltaProperty(
                    resource_id,
                    this, {
                        rateMethod: this.resources.getProduction.bind(this.resources, resource_id),
                        basePropertyMethod: this.get.bind(this, 'last_' + resource_id),
                        lastPropertyBaseValueTimestampMethod: this.get.bind(this, 'resources_last_update'),
                        nextChangeInMethod: nextChangeInMethod,
                        hasImmediateChangeMethod: hasImmediateChangeMethod,
                        valuePostProcessor: 'limitResourceByStorage',
                        onStart: this.resources.onGetsWatchedOn.bind(this.resources),
                        onStop: this.resources.onWatchStopped.bind(this.resources)
                    }, {
                        minInterval: 10000
                    }
                );
            }
        }
    };

    /**
     * Returns the amount of resoureces produced per second
     *
     * @method getProduction
     *
     * @param {String} resource_type   The type of resource, eg. wood, iron or stone
     *
     * @return {Integer}
     */
    Town.getProduction = function(resource_type) {
        return this.resources.getProduction(resource_type);
    };

    /**
     *
     * @param {String} resource_type
     * @return {Number}
     */
    Town.getProductionPerHour = function(resource_type) {
        return Math.round(this.getProduction(resource_type) * 3600);
    };

    /**
     * @method getResource
     *
     * @param {string} type The resource type, eg. stone, iron or wood
     *
     * @return {integer} The current amount of the requested resource in the town
     */
    Town.getResource = function(type) {
        var unlimited_resource = this[type + '_delta_property'].currentValue();

        return this.limitResourceByStorage(unlimited_resource);
    };

    /**
     *
     * @returns {{wood: (integer|*), stone: (integer|*), iron: (integer|*)}}
     */
    Town.getResources = function() {
        return {
            wood: this.getResource('wood'),
            stone: this.getResource('stone'),
            iron: this.getResource('iron')
        };
    };

    Town.getUsedPopulation = function() {
        return this.get('population').blocked;
    };

    Town.getMaxPopulation = function() {
        return this.getUsedPopulation() + this.getAvailablePopulation();
    };

    /**
     * @method getStorageCapacity
     *
     * @param {integer} storage_level (optional, if left out current is used)
     * @return {integer} get the current storage capacity
     */
    Town.getStorageCapacity = function(storage_level) {
        return parseInt(this.storage.getCapacity(storage_level), 10);
    };

    /**
     * get the hide storage capacity calculated from the hide level (cave)
     *
     * @returns {Number} hide storage or -1 if storage is unlimited
     */
    Town.getHideStorageCapacity = function() {
        var hide_level = this.getBuildings().get('hide'),
            hide_building_data = GameData.buildings.hide;

        if (hide_level === hide_building_data.max_level) {
            return GameDataBuildings.getHideStorageLevelUnlimited();
        }

        return parseInt(hide_level * GameDataBuildings.getMaxStorageLimitPerHideLevel(), 10);
    };

    /**
     * get the hideout capacity calculated from the storage level (warehouse)
     * (resources save from looting)
     *
     * @returns {Number} hide storage or -1 if storage is unlimited
     */
    Town.getUnlootableCapacity = function(storage_level) {
        var hide_factor = GameData.buildings.storage.hide_factor;
        storage_level = storage_level || this.getBuildings().get('storage');

        return parseInt(storage_level * hide_factor, 10);
    };

    Town.onUsedPopulationChange = function(obj, callback) {
        obj.listenTo(this, 'change:population', callback);
    };

    Town.onEspionageStorageChange = function(obj, callback) {
        obj.listenTo(this, 'change:espionage_storage', callback);
    };

    Town.limitResourceByStorage = function(unlimited) {
        var resource,
            storage_capacity = this.storage.getCapacity();

        if (unlimited >= storage_capacity) {
            resource = parseInt(storage_capacity, 10);
        } else {
            resource = parseInt(unlimited, 10);
        }

        return resource;
    };

    Town.onResearchChange = function(obj, research_type, callback) {
        obj.listenTo(this.getResearches(), 'change:' + research_type, callback);
    };

    Town.onBuildingLvlChange = function(obj, building_type, callback, context) {
        // remove colon if no building given
        building_type = building_type ? ':' + building_type : building_type;
        obj.listenTo(this.getBuildings(), 'change' + building_type, callback, context);
    };

    Town.onAnyBuildingLvlChange = function(obj, callback, context) {
        this.onBuildingLvlChange(obj, null, callback, context);
    };

    Town.onNameChange = function(obj, callback) {
        obj.listenTo(this, 'change:name', callback);
    };

    Town.offBuildingLvlChange = function(building_type, callback, context) {
        this.getBuildings().off('change:' + building_type, callback, context);
    };

    // --------------------------------------------------- resource code, incl virtual properties

    Town.getResourceBinder = function(resource) {
        return function() {
            return this.getResource(resource);
        };
    };

    Town._onResourceChangeBinder = function(resource) {
        return function(obj, callback) {
            obj.listenTo(this, 'change:' + resource, callback);
        };
    };

    Town.externalTrigger = {};

    /* The loop generates additional methods (one for each resource), which otherwise would create a lot of
    	duplicate code */
    for (resource in TownResources.resources) {
        if (TownResources.resources.hasOwnProperty(resource)) {
            Town['onResource' + resource.camelCase() + 'Change'] = Town._onResourceChangeBinder(resource);
        }
    }

    // ------------------------------------------------------- primitive getters / listeners

    Town.onAvailablePopulationChange = function(obj, callback) {
        obj.listenTo(this, 'change:available_population', callback);
    };

    /**
     * Listen to change of the has_conqueror flag
     *
     * @param {Object} obj          controller object
     * @param {Function} callback   callback
     */
    Town.onHasConquerorChange = function(obj, callback) {
        obj.listenTo(this, 'change:has_conqueror', callback);
    };

    /**
     * Triggered when resources changes, but only 1 event with small delay (check GrepolisModel)
     *
     * @param obj
     * @param callback
     */
    Town.onResourcesChange = function(obj, callback) {
        this.listenToMultiEvents('resources_change', ['change:wood', 'change:iron', 'change:stone'], obj, callback);
    };

    /**
     * Listens on change of the god
     *
     * @param {Object} obj          controller object
     * @param {Function} callback   callback
     */
    Town.onGodChange = function(obj, callback) {
        obj.listenTo(this, 'change:god', callback);
    };

    // ---------------------------------------------------------- relations
    Town.getCastedPowers = function() {
        return this.relation_provider.getCastedPowers();
    };

    Town.getBuildings = function() {
        return this.relation_provider.buildings();
    };

    Town.getCelebrations = function() {
        return this.relation_provider.getCelebrations();
    };

    Town.getBuildingBuildData = function(callback) {
        return this.relation_provider.getBuildingBuildData(callback);
    };

    Town.getPremiumFeatures = function() {
        return this.relation_provider.premiumFeatures();
    };

    Town.getBenefits = function() {
        var benefits = this.relation_provider.benefits();
        return us.filter(benefits, function(benefit) {
            return benefit.isRunning();
        });
    };

    Town.getWonders = function() {
        return this.relation_provider.wonders();
    };

    Town.getMilitia = function(town_id) {
        return this.relation_provider.militia(town_id);
    };

    Town.getHeroes = function() {
        return this.relation_provider.heroes();
    };

    Town.getResearches = function() {
        return this.relation_provider.researches();
    };

    Town.hasConqueror = function() {
        return this.get('has_conqueror') === true;
    };

    /**
     * @deprecated
     */
    Town.buildings = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getBuildings';
        }
        return this.getBuildings();
    };

    /**
     * @deprecated
     */
    Town.premiumFeatures = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getPremiumFeatures';
        }

        return this.getPremiumFeatures();
    };

    /**
     * @deprecated
     */
    Town.benefits = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getBenefits';
        }

        return this.getBenefits();
    };

    /**
     * @deprecated
     */
    Town.wonders = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getWonders';
        }

        return this.getWonders();
    };

    /**
     * @deprecated
     */
    Town.militia = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getMilitia';
        }

        return this.getMilitia();
    };

    /**
     * @deprecated
     */
    Town.heroes = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getHeroes';
        }

        return this.getHeroes();
    };

    /**
     * @deprecated
     */
    Town.researches = function() {
        if (Game.dev) {
            throw 'You are using deprecated method, please replace it with getResearches';
        }

        return this.getResearches();
    };

    Town.setTownName = function(new_name, callbacks) {
        this.execute('setTownName', {
            town_name: new_name
        }, callbacks);
    };

    Town.validateTownName = function(new_name, callbacks) {
        this.execute('validateTownName', {
            town_name: new_name
        }, callbacks);
    };

    Town.onAvailableTradeCapacityChange = function(obj, callback) {
        obj.listenTo(this, 'change:available_trade_capacity', callback);
    };

    Town.onMaxTradeCapacityChange = function(obj, callback) {
        obj.listenTo(this, 'change:max_trade_capacity', callback);
    };

    Town.onAllResourcesFull = function(obj, callback) {
        obj.listenTo(this, 'change:wood change:iron change:stone', function() {
            var resources = this.getResources(),
                storage_capacity = this.getStorageCapacity(),
                all_resources_full = true;

            Object.keys(resources).forEach(function(resource) {
                var is_full = this[resource + '_delta_property'].currentValue() >= storage_capacity;
                all_resources_full = all_resources_full && is_full;
            }.bind(this));

            if (all_resources_full) {
                callback();
            }
        }.bind(this));
    };

    window.GameModels.Town = GrepolisModel.extend(Town);
}());