/*global GameData, Timestamp, DM, Game, GrepolisModel, GameDataHeroes */

(function() {
    "use strict";

    function PlayerHero() {} // never use this, becasue it will be overwritten

    PlayerHero.urlRoot = 'PlayerHero';

    GrepolisModel.addAttributeReader(PlayerHero,
        'level',
        'experience_points',
        'home_town_id',
        'origin_town_id',
        'origin_town_name',
        'origin_town_link',
        'target_town_id',
        'target_town_name',
        'target_town_link',
        'cured_at',
        'target_player_link',
        'assignment_type',
        'is_attacking_attack_spot'
    );

    GrepolisModel.addTimestampTimer(PlayerHero, 'cured_at', true);
    GrepolisModel.addTimestampTimer(PlayerHero, 'town_arrival_at', true);

    /**
     * The human readable name
     *
     * @returns {String}
     */
    PlayerHero.getName = function() {
        return this.getStaticData().name;
    };

    /**
     * Hero static data
     *
     * @returns {Object}
     */
    PlayerHero.getStaticData = function() {
        return this.staticData || (this.staticData = GameData.heroes[this.getId()]);
    };

    /**
     * @returns {Boolean}
     */
    PlayerHero.isHeroOfWar = function() {
        return this.getCategory() === 'war';
    };

    /**
     * @returns {Boolean}
     */
    PlayerHero.isHeroOfWisdom = function() {
        return this.getCategory() === 'wisdom';
    };

    /**
     * Get machine readable name/type of hero
     *
     * @returns {String}
     */
    PlayerHero.getId = function() {
        return this.get('type');
    };

    /**
     * The real model if
     *
     * @returns {Number}
     */
    PlayerHero.getDbId = function() {
        return this.get('id');
    };

    /**
     * The category of the hero (war|wisdom)
     *
     * @returns {Number}
     */
    PlayerHero.getCategory = function() {
        return this.getStaticData().category;
    };

    /**
     * The category of the hero (war|wisdom)
     *
     * @returns {Boolean}
     */
    PlayerHero.isExclusive = function() {
        return this.getStaticData().exclusive === true;
    };

    /**
     * @returns {Boolean}
     */
    PlayerHero.hasMaxLevel = function() {
        return this.getLevel() === GameDataHeroes.getMaxLevel();
    };

    /**
     * Calculate current bonus for hero special ability with base value and add per level
     *
     * @param {Number} level_arg level to calculate bonus for, if empty uses current level
     * @returns {Number}
     */
    PlayerHero.getCalculatedBonusForLevel = function(level_arg) {
        var level = level_arg || this.getLevel();
        return this.getBonus() + this.getBonusAddPerLevel() * level;
    };

    /**
     * Base bonus value for hero special ability
     *
     * @param {Number} bonus_id_arg index number of special ability, defaults to first ability
     * @returns {Number}
     */
    PlayerHero.getBonus = function(bonus_id_arg) {
        var bonus_id = bonus_id_arg || 1;
        return this.getStaticData().description_args[bonus_id].value;
    };

    /**
     * Get the unit for the bonus, e.g. %
     *
     * @param bonus_id_arg
     * @returns {String}
     */
    PlayerHero.getBonusUnit = function(bonus_id_arg) {
        var bonus_id = bonus_id_arg || 1;
        return this.getStaticData().description_args[bonus_id].unit;
    };

    /**
     * Bonus add per level of hero for special ability
     *
     * @param {Number} bonus_id_arg index number of special ability, defaults to first ability
     * @returns {Number}
     */
    PlayerHero.getBonusAddPerLevel = function(bonus_id_arg) {
        var bonus_id = bonus_id_arg || 1;
        return this.getStaticData().description_args[bonus_id].level_mod;
    };

    //TODO: the hero could be not yet in the town - name this function differently to reflect this
    PlayerHero.isInTown = function(town_id) {
        return this.getHomeTownId() === town_id && !this.isTravelingToTown();
    };

    //TODO: is assigned to any town - adjust comment and name
    PlayerHero.isAssignedToTown = function() {
        return this.getHomeTownId() !== null && this.get('assignment_type') === 'town';
    };

    /**
     * a hero is available if he is assigned to a town, has arrived and is not injured
     *
     * @returns {Boolean}
     */
    PlayerHero.isAvailableInTown = function() {
        return this.isAssignedToTown() && !this.isInjured() && !this.isTravelingToTown();
    };

    /**
     * check if hero is town assigned and still on the way to town
     *
     * @returns {bool}
     */
    PlayerHero.isTravelingToTown = function() {
        var town_arrival_at = this.get('town_arrival_at');
        return town_arrival_at && (town_arrival_at > Timestamp.now());
    };

    /**
     * True if hero is assigned to command
     *
     * @returns {Boolean}
     */
    PlayerHero.attacksTown = function() {
        return this.get('assignment_type') === 'command';
    };

    /**
     * @returns {Boolean}
     */
    PlayerHero.isInjured = function() {
        var cured_at = this.getCuredAt();

        return cured_at !== null && cured_at > Timestamp.now();
    };

    /**
     * Time of arrival at town
     *
     * @returns {Number}
     */
    PlayerHero.getArrivalAt = function() {
        return this.get('town_arrival_at');
    };

    /**
     * Get effect modifier object
     *
     * @todo merge with duplicate
     * @see getBonus()
     * @see getBonusAddPerLevel
     * @returns {Object}
     */
    PlayerHero.getEffectModifier = function() {
        return this.getStaticData().description_args;
    };

    /**
     * Hero is on the way to given town id
     *
     * @param {Number} town_id
     * @returns {boolean}
     */
    PlayerHero.isOnTheWayToTown = function(town_id) {
        town_id = parseInt(town_id, 10);

        var town_arrival_at = this.getArrivalAt();

        return town_arrival_at !== null && town_arrival_at > Timestamp.now() && this.getOriginTownId() === town_id;
    };

    /**
     * Hero is on the way to assigned town
     *
     * @returns {Boolean}
     */
    PlayerHero.isBeingTransferedToTown = function() {
        var town_arrival_at = this.getArrivalAt();

        return town_arrival_at !== null && town_arrival_at > Timestamp.now();
    };

    /**
     * Hero has not reached max level
     *
     * @todo merge with duplicate
     * @see hasMaxLevel()
     * @returns {boolean}
     */
    PlayerHero.isTrainable = function() {
        return this.getLevel() !== GameDataHeroes.getMaxLevel();
    };

    PlayerHero.getTransferToTownTime = function() {
        return Math.max(0, GameData.heroes_meta.town_travel_time);
    };

    PlayerHero.getTransferToTownTimeLeft = function() {
        return Math.max(0, this.getArrivalAt() - Timestamp.now());
    };

    PlayerHero.getHealingTime = function() {
        return Math.max(0, GameData.heroes_meta.time_to_cure);
    };

    PlayerHero.getHealingTimeLeft = function() {
        return Math.max(0, this.getCuredAt() - Timestamp.now());
    };

    PlayerHero.getAdditionalInfo = function() {
        var l10n = DM.getl10n('COMMON', 'heroes');
        if (this.isAssignedToTown()) {
            //			if(this.isBeingTransferedToTown()) {
            //				return l10n.is_assigned_to_town(this.getOriginTownName());
            //			}
            return l10n.is_assigned_to_town(this.getOriginTownName());
        } else if (this.attacksTown()) {
            return l10n.is_attacking;
        } else if (this.isInjured()) {
            return l10n.is_injured;
        }

        return false;
    };

    /**
     * Execute level up/coins spending
     *
     * @param {Number} coins
     * @return {void}
     */
    PlayerHero.levelUpHero = function(coins) {
        this.execute('levelUpHero', {
            type: this.getId(),
            amount: coins
        });
    };

    /**
     * Execute halve cure time
     *
     * @return {void}
     */
    PlayerHero.halveCureTime = function() {
        this.execute('halveCureTime', {
            type: this.getId()
        });
    };

    /**
     * Execute instant healing
     *
     * @return {void}
     */
    PlayerHero.healInstant = function() {
        this.execute('healInstant', {
            type: this.getId()
        });
    };

    /**
     * Buys hero
     *
     * @param {Object} data
     * Parameters:
     *     hero_id
     *
     * @return void
     */
    PlayerHero.buyHero = function(data) {
        this.execute('buyHero', data);
    };

    PlayerHero.assignToTown = function(callbacks) {
        this.execute('assignToTown', {
            type: this.getId(),
            target_town_id: Game.townId
        }, callbacks);
    };

    PlayerHero.unassignFromTown = function() {
        this.execute('unassignFromTown', {
            type: this.getId(),
            target_town_id: this.getOriginTownId()
        });
    };

    PlayerHero.cancelTownTravel = function(callbacks) {
        this.execute('cancelTownTravel', {
            type: this.getId(),
            target_town_id: this.getOriginTownId()
        }, callbacks);
    };

    PlayerHero.getSortAttributes = function() {
        return {
            name: this.getName(),
            level: this.getLevel(),
            category: this.getCategory(),
            origin_town_name: this.getOriginTownName()
        };
    };

    window.GameModels.PlayerHero = GrepolisModel.extend(PlayerHero);
}());