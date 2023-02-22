define('models/common/player_award', function() {
    'use strict';

    var GameDataAwards = require('data/awards');
    var GrepolisModel = require_legacy('GrepolisModel');

    var PlayerAward = function() {};
    PlayerAward.urlRoot = 'PlayerAward';

    GrepolisModel.addAttributeReader(PlayerAward,
        'award_id',
        'awarded_at',
        'has_level',
        'level',
        'name',
        'owned',
        'tier',
        'category',
        'subcategory',
        'is_obtainable',
        'is_reoccurring',
        'order_index',
        'daily_award_score',
        'awarded_first',
        'daily_last_year',
        'daily_last_date',
        'event_id'
    );

    PlayerAward.getId = function() {
        return this.get('award_id');
    };

    /**
     * @returns {boolean} true if the award has 4 levels, false if only 1 level
     */
    PlayerAward.hasLevels = function() {
        return this.getHasLevel();
    };

    /**
     * @returns {number} the total number of points gained by this award on a certain level in the grepo-score
     */
    PlayerAward.getScoreAtLevel = function(level) {
        var points = 0;
        var minLevel = this.getMinLevel();
        for (var i = minLevel; i <= level; i++) {
            points += this.getPointsForLevel(i);
        }
        return points;
    };

    /**
     * @returns {number} the number of points gained by this award in the grepo-score
     */
    PlayerAward.getScore = function() {
        var daily_award_score = this.getDailyAwardScore(),
            level_score = this.getScoreAtLevel(this.getLevel());

        if (this.getOwned()) {
            return typeof daily_award_score !== 'undefined' ? daily_award_score : level_score;
        }
        return 0;
    };

    /**
     * @returns {number} the maxium number of points that can be gained by this award in the grepo-score
     */
    PlayerAward.getMaxScore = function() {
        return this.getScoreAtLevel(this.getMaxLevel());
    };

    /**
     * @returns {number} the number of points gained by the current level of this award in the grepo-score
     */
    PlayerAward.getPoints = function() {
        if (this.getOwned()) {
            return this.getPointsForLevel(this.getLevel());
        } else {
            return 0;
        }
    };

    /**
     * @returns {number} the number of points gained by a certain level of this award in the grepo-score
     */
    PlayerAward.getPointsForLevel = function(level) {
        var pointsForLevel = GameDataAwards.getTiers()[this.getTier()];
        return pointsForLevel[level];
    };

    /**
     * @returns {string} the description of a certain level of this award
     */
    PlayerAward.getDescriptionForLevel = function(level) {
        var descriptions = this.get('descriptions');
        return descriptions[level];
    };

    /**
     * @returns {number} The minimum level of this award
     */
    PlayerAward.getMinLevel = function() {
        return this.hasLevels() ? 1 : 0;
    };

    /**
     * @returns {number} The maximum level of this award
     */
    PlayerAward.getMaxLevel = function() {
        return this.hasLevels() ? 4 : 0;
    };

    /**
     * @returns {boolean} true, if the award is obtained and at max-level
     */
    PlayerAward.getIsMaxed = function() {
        return this.getOwned() && this.getLevel() === this.getMaxLevel();
    };

    /**
     * @returns {string} css image class for the award
     */
    PlayerAward.getCssImageClass = function() {
        return this.hasLevels() ? this.getAwardId() + '_' + this.getLevel() : this.getAwardId();
    };

    /**
     * true, if the award is event related
     * @returns {boolean}
     */
    PlayerAward.isEventCategory = function() {
        return GameDataAwards.isEventCategory(this.getCategory());
    };

    /**
     * true, if this player is the first on this world to complete this award (all levels)
     * @returns {boolean}
     */
    PlayerAward.isAwardedFirst = function() {
        return this.get('awarded_first');
    };

    /**
     * @returns {boolean}
     */
    PlayerAward.isDaily = function() {
        return typeof this.getDailyAwardScore() !== 'undefined';
    };

    window.GameModels.PlayerAward = GrepolisModel.extend(PlayerAward);

    return window.GameModels.PlayerAward;
});