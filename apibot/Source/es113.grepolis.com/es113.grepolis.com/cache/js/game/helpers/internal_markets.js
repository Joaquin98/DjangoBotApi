/* global Game */
define('helpers/internal_markets', function() {
    'use strict';

    var InternalMarketsHelper = {

        /**
         * Check if the given market id is an internal market
         * @param String market_id
         * @returns {boolean}
         */
        isInternalMarket: function(market_id) {
            if (market_id) {
                return Game.internal_markets.indexOf(market_id.toLowerCase()) > -1;
            }
        }

    };

    return InternalMarketsHelper;
});