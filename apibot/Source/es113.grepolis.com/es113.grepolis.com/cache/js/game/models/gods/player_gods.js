/* global Timestamp, GameDataPowers, DeltaProperty, GrepolisModel, GameEvents */

(function() {
    'use strict';

    /**
     * @class PlayerGods
     * @constructor
     *
     * @property {number} id
     * @property {object} production_overview
     *   @property {number} production_overview.current
     *   @property {float} production_overview.production
     * @property {[string]} castable_powers_on_town
     * @property {number} last_updated_timestamp
     * @property {number} max_favor
     */
    var PlayerGods = function() {};
    var GameDataGods = require('data/gods');

    PlayerGods.urlRoot = 'PlayerGods';

    GrepolisModel.addAttributeReader(PlayerGods, 'temples_for_gods');
    GrepolisModel.addAttributeReader(PlayerGods, 'castable_powers_on_town');

    PlayerGods.initialize = function( /*params*/ ) {
        this._createDeltaGodFavorProperties();
        this.onGodsFavorFull(this, function(gods) {
            if (gods.length === this.getWorldAvailableGods().length) {
                $.Observer(GameEvents.favor.full.all_gods).publish();
            }
        }.bind(this));
    };

    function nextChangeInMethod(propertyCalculationResults) {
        return 1 / propertyCalculationResults.rate;
    }

    function hasImmediateChangeMethod(lastTriggeredVirtualPropertyValue, currentValue) {
        return Math.abs((Math.round(lastTriggeredVirtualPropertyValue) - Math.round(currentValue))) > 1.0;
    }

    PlayerGods._createDeltaGodFavorProperties = function() {
        var GameDataGods = require('data/gods');

        var gods = GameDataGods.getAllGods(),
            god_idx, gods_length = gods.length,
            god,
            delta_property;

        for (god_idx = 0; god_idx < gods_length; ++god_idx) {
            god = gods[god_idx];

            this[god + '_favor_delta_property'] = delta_property = new DeltaProperty(
                god + '_favor',
                this, {
                    rateMethod: this.getProductionForGodPerSecond.bind(this, god),
                    basePropertyMethod: this._getBaseFavorForGod.bind(this, god),
                    lastPropertyBaseValueTimestampMethod: this.get.bind(this, 'last_updated_timestamp'),
                    nextChangeInMethod: nextChangeInMethod,
                    hasImmediateChangeMethod: hasImmediateChangeMethod,
                    valuePostProcessor: '_limitFavor'
                }, {
                    minInterval: 10000
                }
            );

            this.on('change:production_overview change:last_updated_timestamp',
                delta_property.calculateAndTriggerVirtualProperty, delta_property);
        }
    };

    PlayerGods._limitFavor = function(unlimited) {
        var favor,
            max_favor = this.getMaxFavor();

        favor = parseInt(Math.min(max_favor, unlimited), 10);

        return favor;
    };

    /**
     * model id (is player id)
     *
     * @returns {number}
     */
    PlayerGods.getId = function() {
        return this.get('id');
    };

    /**
     * Returns whether player has god of specific type in any of his towns or not
     *
     * @return {Boolean}
     */
    PlayerGods.hasGod = function(god_id) {
        return this.get('temples_for_gods')[god_id] === true;
    };

    /**
     * get the production overview for all gods
     *
     * @returns {Object} has a key for each god and on it an object with keys current (favor), production
     */
    PlayerGods.getProductionOverview = function() {
        return this.get('production_overview');
    };

    PlayerGods.isCorrectIdOfGod = function(id) {
        var overview = this.getProductionOverview();
        return overview.hasOwnProperty(id);
    };

    PlayerGods.getCurrentFavorForGod = function(god_id) {
        if (this.isCorrectIdOfGod(god_id)) {
            return parseInt(this[god_id + '_favor_delta_property'].currentValue(), 10);
        } else {
            throw new Error('Not an gods name');
        }
    };

    PlayerGods.getCurrentFavorForGods = function() {
        var gods = this.getWorldAvailableGods(),
            favor = {};

        for (var i = 0, l = gods.length; i < l; i++) {
            var god_id = gods[i];

            favor[god_id] = this.getCurrentFavorForGod(god_id);
        }

        return favor;
    };

    /**
     * get the production overview for all gods
     *
     * @returns {Object} has a key for each god and on it an object with keys current (favor), production
     */
    PlayerGods.getCurrentProductionOverview = function() {
        var production_overview = this.getProductionOverview(),
            god,
            return_data = {};
        for (god in production_overview) {
            if (production_overview.hasOwnProperty(god)) {
                return_data[god] = {
                    current: this._getRecalculatedCurrentFavorForGod(god),
                    god: production_overview[god].god,
                    production: production_overview[god].production
                };
            }
        }
        return return_data;
    };

    PlayerGods.getWorldAvailableGods = function() {
        return us.keys(this.getTemplesForGods());
    };

    PlayerGods.getPlayerAvailableGods = function() {
        var gods_temples = this.getTemplesForGods(),
            result = [];

        for (var god_id in gods_temples) {
            if (gods_temples.hasOwnProperty(god_id)) {
                if (gods_temples[god_id]) {
                    result.push(god_id);
                }
            }
        }

        return result;
    };

    /**
     * get production overview for one god
     *
     * @param {string} god_id
     * @returns {object} with keys current (favor), production
     */
    PlayerGods.getProductionOverviewForGod = function(god_id) {
        var overview = this.getProductionOverview();
        return overview ? overview[god_id] : undefined;
    };

    PlayerGods.getGodPowersForTown = function(god_id, is_own_town) {
        var own_town = (is_own_town === undefined) ? true : is_own_town;

        var castable_powers_on_town = own_town ?
            GameDataPowers.getCastablePowersOnTown() :
            GameDataPowers.getCastablePowersOnOtherTowns();

        return us.values(castable_powers_on_town[god_id]);
    };

    PlayerGods.getGodPowersForOtherTowns = function(god_id) {
        var castable_powers_on_town = GameDataPowers.getCastablePowersOnOtherTowns();

        return us.values(castable_powers_on_town[god_id]);
    };

    /**
     * Get powers which are grouped by gods
     *
     * @returns {Object}
     */
    PlayerGods.getCastablePowersOnTownForAvailableGods = function() {
        var gods = this.getPlayerAvailableGods(),
            result = {};

        for (var i = 0, l = gods.length; i < l; i++) {
            var god_id = gods[i];

            result[god_id] = this.getGodPowersForTown(god_id);
        }

        return result;
    };

    /**
     * Get powers which are grouped by gods
     *
     * @returns {Object}
     */
    PlayerGods.getCastablePowersOnTownForAllGods = function(is_own_town) {
        var gods = this.getWorldAvailableGods(),
            result = {};

        for (var i = 0, l = gods.length; i < l; i++) {
            var god_id = gods[i];

            result[god_id] = this.getGodPowersForTown(god_id, is_own_town);
        }

        return result;
    };

    PlayerGods.getGodPowersForCommand = function(god_id) {
        var castable_powers_on_town = GameDataPowers.getCastablePowersOnCommand();

        return us.values(castable_powers_on_town[god_id]);
    };

    PlayerGods.getCastablePowersOnCommandForGods = function(gods) {
        var result = {};

        for (var i = 0, l = gods.length; i < l; i++) {
            var god_id = gods[i];

            result[god_id] = this.getGodPowersForCommand(god_id);
        }

        return result;
    };

    /**
     * test if power is castable by player on his towns
     *
     * @param {string} power_id
     * @returns {Boolean}
     */
    PlayerGods.isCastablePowersOnTown = function(power_id) {
        var i,
            castable_powers = this.getCastablePowersOnTown(),
            castable_powers_length = castable_powers.length;

        for (i = 0; i < castable_powers_length; i++) {
            if (castable_powers[i] === power_id) {
                return true;
            }
        }

        return false;
    };

    /**
     * test if player has god
     *
     * @param {string} god_id
     * @returns {boolean}
     */
    PlayerGods.hasGod = function(god_id) {
        return this.getProductionOverview()[god_id] && this.getProductionForGod(god_id) > 0.0;
    };

    /**
     * get a list of gods the player has
     *
     * @returns {Array}
     */
    PlayerGods.getGodsInTowns = function() {
        var god_id,
            gods = [],
            production_overview = this.getProductionOverview();

        for (god_id in production_overview) {
            if (production_overview.hasOwnProperty(god_id) && this.hasGod(god_id)) {
                gods.push(god_id);
            }
        }

        return gods;
    };

    /**
     * get production per hour for god
     *
     * @param {string} god_id
     * @returns {number}
     */
    PlayerGods.getProductionForGod = function(god_id) {
        var production_overview = this.getProductionOverviewForGod(god_id);

        if (production_overview) {
            return production_overview.production;
        } else {
            return 0;
        }
    };

    /**
     * get production per hour for god
     *
     * @param {string} god_id
     * @returns {number}
     */
    PlayerGods.getProductionForGodPerSecond = function(god_id) {
        var production_overview = this.getProductionOverviewForGod(god_id),
            production;

        if (production_overview) {
            production = production_overview.production;

            return production / 3600.0;
        } else {
            return 0;
        }
    };

    /**
     * get base favor for god
     *
     * @private
     * @param {string} god_id
     * @returns {number}
     */
    PlayerGods._getBaseFavorForGod = function(god_id) {
        var production_overview = this.getProductionOverviewForGod(god_id);

        if (production_overview) {
            return production_overview.current;
        } else {
            return 0;
        }
    };

    /**
     * timestamp favor was updated on the backend
     *
     * @returns {number}
     */
    PlayerGods.getLastUpdatedTimestamp = function() {
        return this.get('last_updated_timestamp');
    };

    /**
     * max favor for player
     *
     * @returns {number}
     */
    PlayerGods.getMaxFavor = function() {
        return this.get('max_favor');
    };

    PlayerGods.isAnyGodAvailable = function() {
        var production_overview = this.getProductionOverview(),
            god_id;

        for (god_id in production_overview) {
            if (production_overview.hasOwnProperty(god_id) && production_overview[god_id].production !== 0) {
                return true;
            }
        }

        return false;
    };

    /**
     * Get favor for god last updated from backend
     * could be different as backend update value only when is used
     *
     * @param {string} god_id
     * @returns {number}
     */
    PlayerGods._getFavorForGod = function(god_id) {
        if (this.getProductionOverview()[god_id]) {
            return this.getProductionOverview()[god_id].current;
        } else {
            return 0;
        }
    };

    /**
     * Calculates current favor for god
     *
     * @param {string} god_id
     * @returns {number}
     */
    PlayerGods._getRecalculatedCurrentFavorForGod = function(god_id) {
        var favor = this._getFavorForGod(god_id),
            last_updated_timestamp = this.getLastUpdatedTimestamp(),
            now_timestamp = Timestamp.now(),
            production_per_hour = this.getProductionForGod(god_id),
            calculated_favor,
            max_favor = this.getMaxFavor();

        if (favor >= max_favor) {
            return Math.floor(max_favor);
        }

        calculated_favor = favor + ((now_timestamp - last_updated_timestamp) / 3600) * production_per_hour;
        return Math.min(max_favor, Math.floor(calculated_favor));
    };

    PlayerGods.getMaxFury = function() {
        return this.get('max_fury');
    };

    PlayerGods.getFury = function() {
        return this.get('fury');
    };

    PlayerGods.onFuryChange = function(obj, callback) {
        obj.listenTo(this, 'change:fury', callback);
    };

    /**
     * Listens on a global god change. Will trigger if the player gets a god he didn't worship before in any town or if he loses the last temple of a god in any town
     * Don't use this to listen for changes of god in temple. It will not trigger if you change to a god that was already worshipped before
     *
     * @param {Object} obj that want to listen on the event
     * @param {Function} callback
     * @return {void}
     */
    PlayerGods.onGodChange = function(obj, callback) {
        obj.listenTo(this, 'change:temples_for_gods', callback);
    };

    PlayerGods.onGodsFavorChange = function(obj, callback) {
        var gods = GameDataGods.getAllGods(),
            change_event_names = us.map(gods, function(god_id) {
                return 'change:' + god_id + '_favor';
            }).join(' ');

        obj.listenTo(this, change_event_names, callback);
    };

    /**
     *
     * @param {Backbone.Events} obj - subscriber
     * @param {function} callback - gets an god_id string
     */
    PlayerGods.onGodsFavorFull = function(obj, callback) {
        var self = this;
        self.onGodsFavorChange(obj, function() {
            var max_favor = self.getMaxFavor(),
                result = self.getWorldAvailableGods().filter(function(god_id) {
                    return self.get(god_id + '_favor') >= max_favor;
                });

            callback(result);
        });
    };

    /**
     * Listens on favor change for specific god
     *
     * @param {Object} obj
     * @param {String} god_id
     * @param {Function} callback
     */
    PlayerGods.onGodFavorChange = function(obj, god_id, callback) {
        obj.listenTo(this, 'change:' + god_id + '_favor', callback);
    };

    PlayerGods.offGodsFavorChange = function(obj, god_id, callback) {
        var GameDataGods = require('data/gods');

        if (!god_id) {
            var gods = GameDataGods.getAllGods(),
                change_event_names = us.map(gods, function(god) {
                    return 'change:' + god + '_favor';
                }).join(' ');

            obj.stopListening(this, change_event_names, callback);
        } else {
            obj.stopListening(this, 'change:' + god_id + '_favor', callback);
        }
    };

    window.GameModels.PlayerGods = GrepolisModel.extend(PlayerGods);
}());