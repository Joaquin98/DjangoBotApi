/*globals WF, GameDataHeroes, GameModels, Game */

window.QuestProgressWindowFactory = (function() {
    'use strict';

    var windows = require('game/windows/ids');
    var heroes_enum = require('enums/heroes');

    return {
        /**
         * Opens "Quest Progress" window which displays information about the
         * finishing all quests and which rewards user will receive
         */
        openQuestProgressWindow: function() {
            var rewards = [{
                type: 'power',
                id: 'happy_folks',
                cssClass: 'power_icon45x45 happy_folks'
            }];

            if (GameDataHeroes.areHeroesEnabled() && !Game.quest_tutorial_andromeda_exists) {
                rewards.push({
                    type: 'hero',
                    id: heroes_enum.ANDROMEDA,
                    cssClass: 'hero40x40 andromeda'
                });
            }

            return WF.open(windows.QUEST_PROGRESS, {
                window_settings: {

                },
                models: {
                    progressable: new GameModels.Progressable({
                        questtype: 'helen',
                        rewards: rewards
                    })
                }
            });
        }
    };
}());