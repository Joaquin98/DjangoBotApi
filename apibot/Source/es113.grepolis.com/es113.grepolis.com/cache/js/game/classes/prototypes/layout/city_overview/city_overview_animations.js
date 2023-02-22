/*globals CityOverviewHelper, Game */
(function() {
    'use strict';

    var configuration = [{
        name: 'lumber',
        check: 'isResourceBuildingAnimated',
        check_args: ['wood'],
        getter: 'getResourceBuildingAnimationClasses',
        getter_args: ['wood']
    }, {
        name: 'stoner',
        check: 'isResourceBuildingAnimated',
        check_args: ['stone'],
        getter: 'getResourceBuildingAnimationClasses',
        getter_args: ['stone']
    }, {
        name: 'ironer',
        check: 'isResourceBuildingAnimated',
        check_args: ['iron'],
        getter: 'getResourceBuildingAnimationClasses',
        getter_args: ['iron']
    }, {
        name: 'farm',
        check: 'isFarmBuildingAnimated',
        check_args: [],
        getter: 'getFarmBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'main',
        check: 'isMainBuildingAnimated',
        check_args: [],
        getter: 'getMainBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'barracks',
        check: 'isBarracksBuildingAnimated',
        check_args: [],
        getter: 'getBarracksBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'docks',
        check: 'isDocksBuildingAnimated',
        check_args: [],
        getter: 'getDocksBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'academy',
        check: 'isAcademyBuildingAnimated',
        check_args: [],
        getter: 'getAcademyBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'temple',
        check: 'isTempleBuildingAnimated',
        check_args: [],
        getter: 'getTempleBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'place',
        check: 'isPlaceBuildingAnimated',
        check_args: [],
        getter: 'getPlaceBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'theater',
        check: 'isTheaterBuildingAnimated',
        check_args: [],
        getter: 'getTheaterBuildingAnimationClasses',
        getter_args: []
    }, {
        name: 'triumph',
        check: 'isTriumphAnimated',
        check_args: [],
        getter: 'getTriumphAnimationClasses',
        getter_args: []
    }, {
        name: 'games',
        check: 'isGamesAnimated',
        check_args: [],
        getter: 'getGamesAnimationClasses',
        getter_args: []
    }, {
        name: 'construction guy',
        check: 'isConstructionGuyVisible',
        check_args: [
            ['barracks', 'docks', 'farm', 'main', 'stoner', 'temple']
        ],
        getter: 'getConstructionGuyAnimationClasses',
        getter_args: [
            ['barracks', 'docks', 'farm', 'main', 'stoner', 'temple']
        ]
    }, {
        name: 'blessed town place_overlay',
        check: 'isTownBlessed',
        check_args: [],
        getter: 'getBlessedTownPlaceAnimationClasses',
        getter_args: []
    }];

    /**
     *
     * @param {Object} data
     * @constructor
     */
    function CityOverviewAnimations(data) {
        //Models
        this.town_model = data.models.current_town;
        this.buildings_model = this.town_model.getBuildings();
        this.player_gods_model = data.models.player_gods;
        this.casual_worlds_blessed_town = data.models.casual_worlds_blessed_town;
        //Collections
        this.building_orders_collection = data.collections.building_orders;
        this.unit_orders_collection = data.collections.unit_orders;
        this.research_orders_collection = data.collections.research_orders;
        this.celebrarions_collection = data.collections.celebrations;
    }

    CityOverviewAnimations.inherits(CityOverviewHelper);

    /**
     * Returns animation css class names which should be visible in the city overview depends on the conditions
     *
     * @return {Array}
     */
    CityOverviewAnimations.prototype.getObjects = function() {
        var classes = [];

        for (var i = 0, l = configuration.length, config_item; i < l; i++) {
            config_item = configuration[i];

            if (this[config_item.check].apply(this, config_item.check_args)) {
                classes = classes.concat(this[config_item.getter].apply(this, config_item.getter_args));
            }
        }

        return classes;
    };

    /**
     * =======================================================
     * Resources
     * =======================================================
     */

    CityOverviewAnimations.prototype.isResourceBuildingAnimated = function(resource_id) {
        var storage_capacity = this.town_model.getStorageCapacity(),
            res_count = this.town_model.getResource(resource_id);

        if (res_count === undefined) {
            throw 'Unsupported resource id';
        }

        return res_count < storage_capacity;
    };

    CityOverviewAnimations.prototype.getResourceBuildingAnimationClasses = function(resource_id) {
        var building_id, level, image_level;

        switch (resource_id) {
            case 'wood':
                building_id = 'lumber';
                return [building_id];
            case 'iron':
            case 'stone':
                //Its not that pretty but saves code duplication
                building_id = resource_id + (resource_id === 'iron' ? 'er' : 'r');
                level = this.buildings_model.getBuildingLevel(building_id);
                image_level = this.getImageLevel(building_id, level);

                if (level > 0) {
                    return [building_id + '_' + image_level];
                }
                break;
            default:
                throw 'Unsupported resource id';
        }

        return [];
    };

    /**
     * =======================================================
     * Farm
     * =======================================================
     */

    CityOverviewAnimations.prototype.isFarmBuildingAnimated = function() {
        var max_population = this.town_model.getMaxPopulation(),
            used_population = this.town_model.getUsedPopulation();

        return max_population > used_population;
    };

    CityOverviewAnimations.prototype.getFarmBuildingAnimationClasses = function() {
        var animations = ['farm'],
            building_id = 'farm',
            level = this.buildings_model.getBuildingLevel(building_id),
            image_level = this.getImageLevel(building_id, level);

        //If building is in the construction
        if (!this.building_orders_collection.getOrder(building_id) && image_level > 1) {
            animations.push('mill');
        }

        return animations;
    };

    /**
     * =======================================================
     * Main
     * =======================================================
     */

    CityOverviewAnimations.prototype.isMainBuildingAnimated = function() {
        return this.building_orders_collection.getOrder('main') !== undefined;
    };

    CityOverviewAnimations.prototype.getMainBuildingAnimationClasses = function() {
        var building_id = 'main',
            level = this.buildings_model.getBuildingLevel(building_id),
            image_level = this.getImageLevel(building_id, level);

        if (!this.building_orders_collection.getOrder(building_id)) {
            return [];
        } else {
            return image_level < 3 ? [building_id + '_' + image_level] :
                [building_id + '_' + image_level + '_1', building_id + '_' + image_level + '_2'];
        }
    };

    /**
     * =======================================================
     * Barracks
     * =======================================================
     */

    CityOverviewAnimations.prototype.isBarracksBuildingAnimated = function() {
        return this.unit_orders_collection.getGroundUnitOrdersCount() > 0;
    };

    CityOverviewAnimations.prototype.getBarracksBuildingAnimationClasses = function() {
        return ['barracks'];
    };

    /**
     * =======================================================
     * Docks
     * =======================================================
     */

    CityOverviewAnimations.prototype.isDocksBuildingAnimated = function() {
        return this.unit_orders_collection.getNavalUnitOrdersCount() > 0;
    };

    CityOverviewAnimations.prototype.getDocksBuildingAnimationClasses = function() {
        return ['docks'];
    };

    /**
     * =======================================================
     * Academy
     * =======================================================
     */

    CityOverviewAnimations.prototype.isAcademyBuildingAnimated = function() {
        return this.research_orders_collection.getCount() > 0;
    };

    CityOverviewAnimations.prototype.getAcademyBuildingAnimationClasses = function() {
        return ['academy'];
    };

    /**
     * =======================================================
     * Temple
     * =======================================================
     */

    CityOverviewAnimations.prototype.isTempleBuildingAnimated = function() {
        var god_id = this.town_model.getGod();

        if (god_id === null) {
            return false;
        }

        var max_favor = this.player_gods_model.getMaxFavor(),
            current_favor = this.player_gods_model.getCurrentFavorForGod(god_id);

        return current_favor < max_favor;
    };

    CityOverviewAnimations.prototype.getTempleBuildingAnimationClasses = function() {
        return ['temple'];
    };

    /**
     * =======================================================
     * Place
     * =======================================================
     */

    CityOverviewAnimations.prototype.isPlaceBuildingAnimated = function() {
        return this.celebrarions_collection.isPartyRunning();
    };

    CityOverviewAnimations.prototype.getPlaceBuildingAnimationClasses = function() {
        return ['place'];
    };

    /**
     * =======================================================
     * Theater
     * =======================================================
     */

    CityOverviewAnimations.prototype.isTheaterBuildingAnimated = function() {
        var has_theater = this.buildings_model.hasBuildingWithLevel('theater', 1),
            theater_celebration_running = this.celebrarions_collection.isTheaterRunning();

        return has_theater && theater_celebration_running;
    };

    CityOverviewAnimations.prototype.getTheaterBuildingAnimationClasses = function() {
        return ['theater'];
    };

    /**
     * =======================================================
     * Triumph
     * =======================================================
     */

    CityOverviewAnimations.prototype.isTriumphAnimated = function() {
        return this.celebrarions_collection.isTriumphRunning();
    };

    CityOverviewAnimations.prototype.getTriumphAnimationClasses = function() {
        return ['triumph'];
    };

    /**
     * =======================================================
     * Games
     * =======================================================
     */

    CityOverviewAnimations.prototype.isGamesAnimated = function() {
        return this.celebrarions_collection.isGamesRunning();
    };

    CityOverviewAnimations.prototype.getGamesAnimationClasses = function() {
        return ['olympic'];
    };

    /**
     * =======================================================
     * Construction guy
     * =======================================================
     */

    CityOverviewAnimations.prototype.isConstructionGuyVisible = function(buildings) {
        var building_id,
            buildings_orders = this.building_orders_collection;

        for (var i = 0, l = buildings.length; i < l; i++) {
            building_id = buildings[i];

            //If any of these buildings are being constructed
            if (buildings_orders.getOrder(building_id)) {
                return true;
            }
        }

        return false;
    };

    CityOverviewAnimations.prototype.getConstructionGuyAnimationClasses = function(buildings) {
        var building_id, classes = [],
            class_name, level, image_level,
            buildings_orders = this.building_orders_collection;

        for (var i = 0, l = buildings.length; i < l; i++) {
            building_id = buildings[i];

            //If any of these buildings are being constructed
            if (buildings_orders.getOrder(building_id)) {
                level = this.buildings_model.getBuildingLevel(building_id);
                image_level = this.getImageLevel(building_id, level);
                class_name = 'construction_' + building_id + (building_id === 'main' ? '_' + image_level : '');

                classes.push(class_name);
            }
        }

        return classes;
    };

    CityOverviewAnimations.prototype.isTownBlessed = function() {
        return this.casual_worlds_blessed_town && this.casual_worlds_blessed_town.getTownId() === Game.townId;
    };

    CityOverviewAnimations.prototype.getBlessedTownPlaceAnimationClasses = function() {
        return ['blessed_town_place_overlay'];
    };

    window.CityOverviewAnimations = CityOverviewAnimations;
}());