/*global GameDataInstantBuy*/
(function() {
    'use strict';

    /**
     * Class which mixins with it should inherit from BaseController and implements:
     *
     * Requirements:
     *
     * @inherits BaseController
     * @implements
     * - getInstantBuyType
     * - getOrders
     */
    var IntantBuyController = {
        registerUpdatePremiumButtonsCaptionsTimer: function() {
            this._registerUpdatePremiumButtonsCaptionsTimer(this.rerenderPage.bind(this));
        },

        _registerUpdatePremiumButtonsCaptionsTimer: function(callback) {
            var interval = this._getIntervalForNextCheck(),
                type = 'update_premiumc_buttons_captions_' + this.getInstantBuyType() + '_' + this.cid;

            if (interval !== -1) {
                this.registerTimerOnce(type, interval, callback);
            } else {
                this.unregisterTimer(type);
            }
        },

        /**
         * Returns the shortest time
         *
         * @returns {Number}
         */
        _getIntervalForNextCheck: function() {
            var instant_buy_type = this.getInstantBuyType(),
                boundaries = us.keys(GameDataInstantBuy.getPriceTableForType(instant_buy_type));

            var orders = this.getOrders();
            var smallest_time_left = Infinity;

            for (var i = 0, l = orders.length; i < l; i++) {
                var order = orders[i],
                    time_left = order.getTimeLeft();

                for (var j = 0, l2 = boundaries.length; j < l2; j++) {
                    var boundary = boundaries[j];
                    var diff = time_left - boundary;

                    if (diff > 0 && diff < smallest_time_left) {
                        smallest_time_left = diff;
                    }
                }
            }

            return smallest_time_left === Infinity ? -1 : smallest_time_left * 1000;
        }
    };

    window.GameMixins.IntantBuyController = IntantBuyController;
}());