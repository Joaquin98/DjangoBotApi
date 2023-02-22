define('collections/common/player_awards', function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var PlayerAward = window.GameModels.PlayerAward;
    var GrepoScoreCategory = require('enums/grepo_score_category');
    var Features = require('data/features');

    var PlayerAwards = function() {}; // never put code in here, because it will be overwritten

    PlayerAwards.model = PlayerAward;
    PlayerAwards.model_class = 'PlayerAward';

    PlayerAwards._getMostRecentAward = function(awards) {
        return us.chain(awards)
            .filter(function(model) {
                return model.getOwned();
            })
            .sort(function(award_a, award_b) {
                if (award_a.getAwardedAt() === award_b.getAwardedAt()) {
                    return award_a.getPoints() - award_b.getPoints();
                } else {
                    return award_a.getAwardedAt() - award_b.getAwardedAt();
                }
            })
            .last().value();
    };

    PlayerAwards.getByAwardId = function(award_id) {
        return this.findWhere({
            award_id: award_id
        });
    };
    PlayerAwards.getByAwardIdAndEventId = function(award_id, event_id) {
        return this.findWhere({
            award_id: award_id,
            event_id: event_id
        });
    };

    PlayerAwards.getAllOfCategory = function(category) {
        return this.where({
            category: category
        });
    };

    PlayerAwards.getPointsForCategory = function(category) {
        return this.getAllOfCategory(category).reduce(function(sum, award) {
            return sum + award.getScore();
        }, 0);
    };

    PlayerAwards.onAwardObtained = function(obj, callback) {
        obj.listenTo(this, 'add change', function(award) {
            var has_higher_level = award.getLevel() > award.previous('level');
            if ((award.getOwned() && (!award.previous('owned') || has_higher_level)) || award.getIsReoccurring()) {
                callback.call(this, award);
            }
        });
    };

    PlayerAwards.onDailyAwardScoreChange = function(obj, callback) {
        obj.listenTo(this, 'change:daily_award_score', callback);
    };

    PlayerAwards.getAllEventAwardsForTheme = function(event_theme) {
        return this.filter(function(model) {
            return model.getCategory() === GrepoScoreCategory.EVENT && model.getSubcategory() === event_theme;
        });
    };

    PlayerAwards.getAllAwardsForActiveEndGame = function() {
        var active_end_game = Features.getEndGameType();
        return this.filter(function(model) {
            return model.getCategory() === GrepoScoreCategory.END_GAME && model.getSubcategory() === active_end_game;
        });
    };

    window.GameCollections.PlayerAwards = GrepolisCollection.extend(PlayerAwards);

    return window.GameCollections.PlayerAwards;
});