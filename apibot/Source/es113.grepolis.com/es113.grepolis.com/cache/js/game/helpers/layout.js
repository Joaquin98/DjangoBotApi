/*globals jQuery, ITowns, Game, WQM, GiftsWelcomeWindowFactory */
(function($) {
    'use strict';

    var HelperLayout = {
        /**
         * Function which updates itowns after town switch with data provided by
         * backend
         *
         * @param {Object} bar
         */
        updateItowns: function(bar) {
            var town_id = parseInt(Game.townId, 10),
                itown = ITowns.getTown(town_id);

            // wait until first request is finished
            if (!itown) {
                $(document).one('ajaxComplete', function() {
                    HelperLayout.updateItowns(bar);
                });

                return;
            }

            if (bar.gift && bar.gift.length) {
                var gifts = bar.gift;

                //There can be multiple gifts like "Odysseus", "Gold", "Happiness" or some "Resources" or "Favor"
                for (var i = 0, l = gifts.length; i < l; i++) {
                    var gift = gifts[i];

                    if (typeof gift.type !== 'undefined') {
                        HelperLayout.openGiftWindow(gift);
                    }
                }
            }
        },

        openGiftWindow: function(gift) {
            var windows = require('game/windows/ids');
            var priorities = require('game/windows/priorities');

            WQM.addQueuedWindow({
                type: windows.GIFTS_WELCOME,
                priority: priorities.getPriority(windows.GIFTS_WELCOME),
                open_function: function() {
                    return GiftsWelcomeWindowFactory.openWindow(gift);
                }
            });
        },

        /**
         * Filters gifts data by specific type, for instance: 'gift.daily_reward', "hint.age_of_wonder"
         *
         * @param {Array} gifts
         * @param {String} gift_type
         *
         * @returns {Array|null}
         */
        getGiftData: function(gifts, gift_type) {
            var filtered = [];

            for (var i = 0, l = gifts.length; i < l; i++) {
                if (gifts[i].type === gift_type) {
                    filtered.push(gifts[i]);
                }
            }

            return filtered.length > 0 ? filtered : null;
        },

        containsGift: function(gifts, gift_name) {
            return this.getGiftData(gifts, gift_name) !== null;
        }
    };

    window.HelperLayout = HelperLayout;
}(jQuery));