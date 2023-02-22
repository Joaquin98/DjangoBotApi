define('game/windows/priorities', function(require) {
    "use strict";

    var windows = require('game/windows/ids'),
        GPWindowMgr = window.GPWindowMgr, //@todo_require
        window_priority = {}; //Keeps priorities for all windows in the game.

    window_priority.neutral = 10;
    window_priority.highest = 999;
    window_priority[GPWindowMgr.TYPE_BOT_CHECK] = 140;
    window_priority[GPWindowMgr.TYPE_RECAPTCHA] = 140;
    window_priority[GPWindowMgr.TYPE_CONQUEST] = 130;

    ////
    //Keep in mind CRM uses range between 10-100
    ////

    window_priority[windows.QUEST_WELCOME] = 52;
    window_priority[windows.WORLD_END_WELCOME] = 51;
    window_priority[windows.MOBILE_TUTORIAL] = 50;
    window_priority[windows.HEROES_WELCOME] = 49;
    window_priority[windows.INTERSTITIAL] = 40;
    window_priority[windows.GIFTS_WELCOME] = 34;
    window_priority[windows.MILITIA_WELCOME] = 33;
    window_priority[windows.PHOENICIAN_SALESMAN_WELCOME] = 32;
    window_priority[windows.WORLD_WONDERS_WELCOME] = 31;
    window_priority[windows.DAILY_LOGIN] = 30;

    window_priority[windows.HALLOWEEN] = 44;
    window_priority[windows.HALLOWEEN_SALE_INTERSTITIAL] = 43;
    window_priority[windows.HALLOWEEN_END_INTERSTITIAL] = 42;
    window_priority[windows.HALLOWEEN_COLLECT] = 41;

    window_priority[windows.GREPOLYMPIA_WELCOME_INTERSTITIAL] = 45;
    window_priority[windows.GREPOLYMPIA_END_INTERSTITIAL] = 43;
    window_priority[windows.GREPOLYMPIA_SHOP] = 42;
    window_priority[windows.GREPOLYMPIA] = 41;

    window_priority[windows.EASTER_WELCOME] = 47;
    window_priority[windows.EASTER] = 46;
    window_priority[windows.EASTER_END_INTERSTITIAL] = 42;
    window_priority[windows.EASTER_COLLECT] = 41;

    window_priority[windows.ASSASSINS_WELCOME] = 47;
    window_priority[windows.ASSASSINS_END_INTERSTITIAL] = 44;
    window_priority[windows.ASSASSINS_SHOP_INTERSTITIAL] = 43;
    window_priority[windows.ASSASSINS] = 42;
    window_priority[windows.ASSASSINS_SHOP] = 41;

    window_priority[windows.HERCULES2014] = 44;
    window_priority[windows.HERCULES2014_END_INTERSTITIAL] = 42;
    window_priority[windows.HERCULES2014_COLLECT] = 41;

    window_priority[windows.NWOT_WELCOME_INTERSTITIAL] = 44;
    window_priority[windows.NWOT_END_INTERSTITIAL] = 42;
    window_priority[windows.ADVENT_WELCOME_INTERSTITIAL] = 44;
    window_priority[windows.ADVENT_END_INTERSTITIAL] = 42;
    window_priority[windows.ADVENT] = 41;

    window_priority[windows.COMMUNITY_GOAL_REACHED] = 41;
    window_priority[windows.ASSASSINS_COMMUNITY_GOAL_REACHED] = 41;

    window_priority[windows.MISSIONS_WELCOME] = 44;
    window_priority[windows.MISSIONS_PLOT_INTERSTITIAL] = 43;
    window_priority[windows.MISSIONS_END_INTERSTITIAL] = 42;

    /**
     * Methods
     */
    return {
        getPriority: function(window_type) {
            return window_priority[window_type];
        }
    };
});