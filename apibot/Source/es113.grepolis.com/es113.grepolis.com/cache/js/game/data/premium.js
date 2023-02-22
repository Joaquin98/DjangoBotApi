/*globals Game, MM */

(function(window) {
    'use strict';

    var ucfirst = function(string) {
        var f = string.charAt(0).toUpperCase();
        return f + string.substr(1);
    };

    var GameDataPremium = {
        getAdvisorsIds: function() {
            return us.keys(Game.premium_data);
        },

        getAdvisorName: function(advisor_id) {
            return Game.premium_data[advisor_id].name;
        },

        getAdvisorDescription: function(advisor_id) {
            return Game.premium_data[advisor_id].description;
        },

        getAdvisorBonus: function(advisor_id) {
            return Game.premium_data[advisor_id].bonus;
        },

        /**
         * Determinates if user has Curator activated or not
         *
         * @return {Boolean}
         */
        hasCurator: function() {
            // don't use the code below which always triggers an update on the model
            // we don't like to access MM.getModels() directly, but in that case we suffer from performance
            // since hasCurator() is used quite often
            // MM.checkAndPublishRawModel('PremiumFeatures', {id: Game.player_id});
            return this.getPremiumFeaturesModel().hasCurator();
        },

        /**
         * Returns number of available advisors in the game
         *
         * @returns {Number}
         */
        getNumberOfAdvisors: function() {
            return us.keys(Game.premium_features).length;
        },

        /**
         * Returns cost of the curator
         *
         * @returns {Number}
         */
        getCuratorCost: function() {
            return this.getAdvisorCost('curator');
        },

        /**
         * Returns the resource boost of the trader
         *
         * @returns {Number} the boost factor
         */
        getTraderResourceBoost: function() {
            return Game.constants.premium.trader_resource_boost;
        },

        /**
         * Returns cost of the advisor
         *
         * @param {String} advisor_id
         * @param {Quests} tutorial_quest_collection
         * @return {Number}
         */
        getAdvisorCost: function(advisor_id, tutorial_quest_collection) {
            if (tutorial_quest_collection && tutorial_quest_collection.isQuestRunning('Premium' + (ucfirst(advisor_id)) + 'Quest')) {
                return 0;
            } else {
                return Game.constants.premium[advisor_id];
            }
        },

        /**
         * Returns duration extension of the advisor
         *
         * @param {String} advisor_id
         * @param {window.GameCollections.EagerQuests} tutorial_quest_collection
         * @return {Number}
         */
        getAdvisorDuration: function(advisor_id, tutorial_quest_collection) {
            if (tutorial_quest_collection && tutorial_quest_collection.isQuestRunning('Premium' + (ucfirst(advisor_id)) + 'Quest')) {
                return 3;
            } else {
                return Game.premium_data[advisor_id].duration;
            }
        },

        isAdvisorActivated: function(advisor_id) {
            return this.getPremiumFeaturesModel().isActivated(advisor_id);
        },

        getAdvisorExpirationTime: function(advisor_id) {
            return this.getPremiumFeaturesModel().getExpiredTime(advisor_id);
        },

        getPremiumFeaturesModel: function() {
            return MM.getModels().PremiumFeatures[Game.player_id];
        }
    };

    window.GameDataPremium = GameDataPremium;
}(window));