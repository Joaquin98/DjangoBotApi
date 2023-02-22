/*globals GPWindowMgr, Game */

window.RankingWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Ranking' window
         */
        openRankingWindow: function() {
            return GPWindowMgr.Create(GPWindowMgr.TYPE_RANKING, null, {}, Game.player_rank, Game.townId);
        }
    };
}());