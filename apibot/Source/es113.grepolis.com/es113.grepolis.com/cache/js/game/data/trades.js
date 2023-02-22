/*globals GameData */

(function(window) {
    "use strict";

    var GameDataTrades = {
        /**
         * Returns time in seconds during which trade can be canceled
         *
         * @return {Number}
         */
        getCancelTradeTime: function() {
            return GameData.cancel_times.trades;
        }
    };

    window.GameDataTrades = GameDataTrades;
}(window));