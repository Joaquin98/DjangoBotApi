/*global Game, MM */

/**
 * parent class for benefits (like LargeIcon / Events-WelcomeWindow) with preconditions. Those have the conditions only to be running for players that
 * have barracks on at least lvl 1 and/or island quests are known by the player
 */
(function() {
    'use strict';

    var Benefit = window.GameModels.Benefit;

    var BenefitWithPreconditions = function() {};

    /**
     * overwrites isRunning from Benefit itself to add additional requirements
     */
    BenefitWithPreconditions.isRunning = function() {
        return Benefit.prototype.isRunning.call(this) && this._satisfiesPrerequisites();
    };

    /**
     * Should not be used to check if there is a benefit running
     * It's only a workaround to get the event skin regardless of player status
     */
    BenefitWithPreconditions.isRunningWithoutPrerequisites = function() {
        return Benefit.prototype.isRunning.call(this);
    };

    BenefitWithPreconditions._satisfiesPrerequisites = function() {
        // defaults to senate level 3 or greater, can be overriden by actual class
        return this._hasSenateOnLevelGreaterOrEqualThan(3);
    };

    BenefitWithPreconditions._hasSenateOnLevelGreaterOrEqualThan = function(level) {
        return !!(this._hasBuildingOnLevelGreaterOrEqualThan('main', level));
    };

    BenefitWithPreconditions._hasFarmOnLevelGreaterOrEqualThan = function(level) {
        return !!(this._hasBuildingOnLevelGreaterOrEqualThan('farm', level));
    };

    BenefitWithPreconditions._hasBuildingOnLevelGreaterOrEqualThan = function(building_id, level) {
        var buildings = MM.getModels().Buildings;

        if (buildings) {
            return us.find(buildings, function(building) {
                return building.get(building_id) >= level;
            });
        }
    };

    BenefitWithPreconditions._hadIslandQuests = function() {
        return Game.had_island_quests;
    };

    BenefitWithPreconditions._hasIslandQuests = function() {
        return this._getLivingIslandQuests().length > 0;
    };

    BenefitWithPreconditions._getLivingIslandQuests = function() {
        var island_quests = MM.getCollections().IslandQuest;

        if (island_quests.length < 1) {
            throw 'There have to be island quest collections!';
        }

        return island_quests[0];
    };

    /**
     * will be called from GrepolisCollection when somebody starts listening for 'started' for the first time
     */
    BenefitWithPreconditions._boundStartListener = function() {
        if (this._satisfiesPrerequisites()) {
            return Benefit.prototype._boundStartListener.apply(this, arguments);
        } else {
            this._getLivingIslandQuests().off('add', null, this);
            this._getLivingIslandQuests().on('add', this._checkRunningOrBoundStartListener, this);

            window.ITowns.all_buildings.off('change:barracks', null, this);
            window.ITowns.all_buildings.off('change:main', null, this);
            window.ITowns.all_buildings.off('change:farm', null, this);
            window.ITowns.all_buildings.on('change:barracks', this._checkRunningOrBoundStartListener, this);
            window.ITowns.all_buildings.on('change:main', this._checkRunningOrBoundStartListener, this);
            window.ITowns.all_buildings.on('change:farm', this._checkRunningOrBoundStartListener, this);

            this._bindCustomStartListener(this._checkRunningOrBoundStartListener, this);
        }
    };

    /**
     * special listeners to trigger rechecking start in case of not satisfied prerequisites
     *
     * @private
     * @param {Function} callback
     * @param {Object} context
     */
    BenefitWithPreconditions._bindCustomStartListener = function(callback, context) {

    };

    BenefitWithPreconditions._checkRunningOrBoundStartListener = function(model, barrack_level) {
        if (this.isRunning()) {
            this.trigger('started', this, true);
        } else {
            this._boundStartListener();
        }
    };

    /**
     * will be called from GrepolisCollection when somebody starts listening for 'ended' for the first time
     */
    BenefitWithPreconditions._boundEndListener = function() {
        if (this._satisfiesPrerequisites()) {
            return Benefit.prototype._boundEndListener.apply(this, arguments);
        } else {
            this._getLivingIslandQuests().on('add', this._checkAndBoundEndListener, this);

            window.ITowns.all_buildings.on('change:barracks', this._checkAndBoundEndListener, this);
            window.ITowns.all_buildings.on('change:main', this._checkAndBoundEndListener, this);

            this._bindCustomEndListener(this._checkRunningOrBoundStartListener, this);
        }
    };

    /**
     * special listeners to trigger rechecking end in case of not satisfied prerequisites
     *
     * @private
     * @param {Function} callback
     * @param {Object} context
     */
    BenefitWithPreconditions._bindCustomEndListener = function(callback, context) {

    };

    BenefitWithPreconditions._checkAndBoundEndListener = function(model, barrack_lvl) {
        if (!this.hasEnded() && barrack_lvl > 0) {
            this._boundEndListener();
        }
    };

    BenefitWithPreconditions.finalize = function() {
        this._getLivingIslandQuests().off(null, null, this);
        window.ITowns.all_buildings.on('change:barracks', null, this);
    };

    window.GameModels.BenefitWithPreconditions = Benefit.extend(BenefitWithPreconditions);
}());