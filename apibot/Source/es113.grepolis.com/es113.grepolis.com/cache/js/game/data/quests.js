/*globals Game, MM */

(function(window) {
    "use strict";

    var GameDataQuests = {
        /**
         * Returns total number of tutorial quests
         *
         * @return {Integer}
         */
        getTutorialQuestsCount: function() {
            return Game.tutorial_bar_quests;
        },

        getEndOfDeadZoneQuestCount: function() {
            return 26;
        },

        /**
         * Returns number of already finished quests
         *
         * @return {Integer}
         */
        getFinishedTutorialQuestsCount: function() {
            return MM.getModels().Player[Game.player_id].getQuestsClosed();
        },

        isTutorialSkipped: function() {
            return MM.getModels().Player[Game.player_id].getTutorialSkipped();
        },

        isTutorialRunning: function() {
            return Game.quest_tutorial_running;
        },

        /**
         * Returns number of tutorial quests which are still available to do
         *
         * @return {Integer}
         */
        getTutorialQuestsLeftCount: function() {
            return this.getTutorialQuestsCount() - this.getFinishedTutorialQuestsCount();
        },

        /**
         * Checks if the player is still in the dead zone.
         * The dead zone starts when the player has closed the first quests
         * and ends when the player has finished 20 quests.
         * @returns {boolean|*}
         */
        isInTutorialDeadZone: function() {
            var quest_collection = MM.getOnlyCollectionByName('Progressable');
            var player = MM.getModels().Player[Game.player_id];
            return !player.getTutorialSkipped() && (
                quest_collection.hasQuests() && player.getQuestsClosed() > 0 && !this.isOverQuestCount()
            );
        },

        /**
         * Checks if the player has finished the 26 quest
         * @returns {boolean}
         */
        isOverQuestCount: function() {
            var player = MM.getModels().Player[Game.player_id];
            //Dead zone ends after the 26 quest, that is why + 6
            return player.getQuestsClosed() >= GameDataQuests.getEndOfDeadZoneQuestCount();
        }
    };

    window.GameDataQuests = GameDataQuests;
}(window));