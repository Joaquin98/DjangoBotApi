/*global Game */

(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var PlayerHero = window.GameModels.PlayerHero;
    var GameEvents = window.GameEvents;
    var StringSorter = window.StringSorter;

    var PlayerHeroes = function() {}; // never use this, because it will be overwritten

    PlayerHeroes.model = PlayerHero;
    PlayerHeroes.model_class = 'PlayerHero';
    PlayerHeroes.sort_attribute = 'name';
    PlayerHeroes.string_sorter = new StringSorter();

    PlayerHeroes.initialize = function() {
        /**
         * we do not sort on model.add during gameload, so we have to do it here manually
         */
        $.Observer(GameEvents.game.start).subscribe(['player_heroes'], function() {
            this.sort();
        }.bind(this));
    };

    /**
     * Returns level for hero (if owned by player) or 0
     *
     * @param {String} hero_id
     *
     * @return {Integer}
     */
    PlayerHeroes.getLevelForHero = function(hero_id) {
        var hero_model = this.find(function(model) {
            return model.getId() === hero_id;
        });

        return hero_model ? hero_model.getLevel() : 0;
    };

    /**
     * checks if there is any trainable hero (with not max level)
     */
    PlayerHeroes.isAnyTrainableHero = function() {
        var collection = this.filter(
            function(model) {
                return model.isTrainable();
            }
        );
        return collection.length > 0;
    };

    /**
     * Checks number of exclusive heroes a player owns
     *
     * @returns {Number}
     */
    PlayerHeroes.getExclusiveHeroCount = function() {
        var collection = this.filter(
            function(model) {
                return model.isExclusive();
            }
        );
        return collection.length;
    };

    /**
     * Returns hero model depends on the given hero id
     *
     * @return {GameModels.PlayerHero}
     */
    PlayerHeroes.getHero = function(hero_id) {
        return this.find(function(model) {
            return model.getId() === hero_id;
        });
    };

    /**
     * Returns hero model depending on the given town id
     *
     * @param {Integer} town_id
     *
     * @return {GameModels.PlayerHero|undefined}
     */
    PlayerHeroes.getHeroOfTown = function(town_id) {
        return this.find(function(model) {
            return model.isInTown(town_id);
        });
    };

    /**
     * Returns hero model of the hero who is being assigned to the town, depends on the town id
     *
     * @param {Integer} town_id
     *
     * @return {GameModels.PlayerHero|undefined}
     */
    PlayerHeroes.getHeroBeingAssignedToTown = function(town_id) {
        return this.find(function(model) {
            return model.isOnTheWayToTown(town_id);
        });
    };

    /**
     * Checks if user has a hero
     *
     * @param {String} hero_id
     *
     * @return {Boolean}
     */
    PlayerHeroes.hasHero = function(hero_id) {
        return (this.getHero(hero_id)) ? true : false;
    };

    /**
     * Returns all heroes models
     *
     * @return {Array}
     */
    PlayerHeroes.getHeroes = function() {
        return this.models;
    };

    /**
     * Returns heroes count
     *
     * @return {Integer}
     */
    PlayerHeroes.getHeroesCount = function() {
        return this.models.length;
    };

    /**
     * Returns non-exclusive heroes count
     *
     * @return {Integer}
     */
    PlayerHeroes.getHeroesCountWithoutExclusives = function() {
        return this.models.filter(function(model) {
            return !model.isExclusive();
        }).length;
    };

    /**
     * Binds a listener which will be executed when hero experience will change
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onHeroExperienceChange = function(obj, callback) {
        obj.listenTo(this, 'change:experience_points', callback);
    };

    /**
     * Binds a listener which will be executed when hero level will change
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onHeroLevelChange = function(obj, callback) {
        obj.listenTo(this, 'change:level', callback);
    };

    /**
     * Binds a listener which will be executed when cured at timestamp will change
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onCuredAtChange = function(obj, callback) {
        obj.listenTo(this, 'change:cured_at', callback);
    };

    /**
     * Binds a listener which will be executed when a hero has been cured (curedAt timer ran out)
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onHealed = function(obj, callback) {
        obj.listenTo(this, 'timestamp:cured_at', callback);
    };

    /**
     * Binds a listener which will be executed when Hero is on the way to town or it was just canceled
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onTownArrivalAtChange = function(obj, callback) {
        obj.listenTo(this, 'change:town_arrival_at', callback);
    };

    /**
     * Binds a listener which will be executed when the origin town changes
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onTownNameChange = function(obj, callback) {
        obj.listenTo(this, 'change:origin_town_name', callback);
    };

    /**
     * Binds a listener which will be executed new Hero will be added to the collection
     *
     * @param {Backbone.Events} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onHeroAdd = function(obj, callback) {
        obj.listenTo(this, 'add', callback);
    };

    /**
     * Binds a listener which will be executed new Hero will be removed from the collection
     *
     * @param {Backbone.Events} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onHeroRemove = function(obj, callback) {
        obj.listenTo(this, 'remove', callback);
    };

    /**
     * Binds a listener which will be executed when Hero is attacking a town
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    PlayerHeroes.onAssignmentTypeChange = function(obj, callback) {
        obj.listenTo(this, 'change:assignment_type', callback);
    };

    /**
     * Returns information whether the hero is injured
     *
     * @return {Boolean}
     */
    PlayerHeroes.isStateInjuredHeroInTown = function() {
        var hero = this.getHeroOfTown(Game.townId);

        return hero && hero.isAssignedToTown() && hero.isInjured();
    };

    /**
     * Returns information whether the hero is healthy
     *
     * @param {Integer} town_id
     *
     * @return {Boolean}
     */
    PlayerHeroes.isStateHealthyHeroInTown = function(town_id) {
        var hero_town_id = parseInt(town_id || Game.townId, 10),
            hero = this.getHeroOfTown(hero_town_id);

        return hero && hero.isAssignedToTown() && !hero.isInjured();
    };

    /**
     * Returns information whether the hero is attacking
     *
     * @return {Boolean}
     */
    PlayerHeroes.isStateHeroIsAttacking = function() {
        var hero = this.getHeroOfTown(Game.townId);

        return hero && hero.attacksTown();
    };

    /**
     * Returns information whether the hero is currently on the way to current town
     *
     * @return {Boolean}
     */
    PlayerHeroes.isStateHeroBeingAssigned = function() {
        var hero = this.getHeroBeingAssignedToTown(Game.townId);

        return hero && hero.isOnTheWayToTown(Game.townId);
    };

    PlayerHeroes.sortByAttribute = function(attribute) {
        this.sort_attribute = attribute;
        this.sort();
    };

    PlayerHeroes.comparator = function(a, b) {
        var attr_a = a.getSortAttributes(),
            attr_b = b.getSortAttributes(),
            value_a = attr_a[this.sort_attribute],
            value_b = attr_b[this.sort_attribute],
            result;

        if (typeof value_a === 'number') {
            result = value_a > value_b ? -1 : (value_a < value_b ? 1 : 0);
        } else {
            result = (value_a === null && value_b !== null) || (value_a !== null && value_b === null) ?
                -this.string_sorter.compare(value_a, value_b) : this.string_sorter.compare(value_a, value_b);
        }

        return result !== 0 ? result : this.string_sorter.compare(attr_a.name, attr_b.name);
    };

    window.GameCollections.PlayerHeroes = GrepolisCollection.extend(PlayerHeroes);
}());