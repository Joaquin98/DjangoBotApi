/*globals WF */

// TODO remove file
window.QuestWindowFactory = (function() {
    'use strict';

    var windows = require('game/windows/ids');

    return {
        /**
         * Opens 'Quest' window
         *
         * @param {GameModels.Progressable} quest_model
         */
        openQuestWindow: function(quest_model) {
            //return WF.open(windows.QUEST, {models : {progressable : quest_model}});
        }
    };
}());