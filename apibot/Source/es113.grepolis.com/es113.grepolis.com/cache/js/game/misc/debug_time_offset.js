/* global gpAjax */

/**
 * Helper class for manipulating the game time. Currently will be used for testing of midnight switch.
 */
(function() {

    var InternalMarketsHelper = require('helpers/internal_markets');

    if (Game.dev || InternalMarketsHelper.isInternalMarket(Game.market_id)) {
        window.DebugTimeOffset = (function() {
            'use strict';

            $(document).ready(function() {
                $('#debug_time_offset a').on('click', reset);
            });

            function setMinutesUntilMidnight(minutes) {
                gpAjax.ajaxPost('debug', 'macro', {
                    macro: 'dailylogingift_setminutesuntilmidnight',
                    args: {
                        minutes: minutes
                    }
                }, false, function() {
                    window.location.reload();
                });
            }

            function reset() {
                gpAjax.ajaxPost('debug', 'macro', {
                    macro: 'dailylogingift_resetdebugtimeoffset'
                }, false, function() {
                    window.location.reload();
                });
            }

            return {
                setMinutesUntilMidnight: setMinutesUntilMidnight,
                reset: reset
            };
        })();
    }
}());