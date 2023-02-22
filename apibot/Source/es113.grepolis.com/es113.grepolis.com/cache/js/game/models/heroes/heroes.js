/* global GrepolisModel */
(function() {
    'use strict';

    var Heroes = function() {};

    Heroes.urlRoot = 'Heroes';

    Heroes.initialize = function( /*params*/ ) {

    };

    /**
     * Binds a listener which will be executed when hero call data will change
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    Heroes.onCultureSlotsChange = function(obj, callback) {
        obj.listenTo(this, 'change:culture_slots', callback);
    };

    /**
     * Returns number of available hero slots
     *
     * @return {Number}
     */
    Heroes.getAvailableSlots = function() {
        return this.get('available_slots');
    };

    /**
     * Returns the amount of culture points which are needed for the next slot
     *
     * @return {Number}
     */
    Heroes.getCulturePointsForNextSlot = function() {
        return this.get('culture_points_for_next_slot');
    };

    /**
     * Returns experience limit for each level
     *
     * @param {Number} level   hero level
     *
     * @return {Number}
     */
    Heroes.getExperienceLimit = function(level) {
        return this.get('experience_limits')[level];
    };

    /**
     * Returns information whether the council of heroes tab is opened for a first time
     *
     * @return {Boolean}
     */
    Heroes.isCouncilOpenedFirstTime = function() {
        return this.get('is_first_call');
    };

    /**
     * Returns number of hero free slots
     *
     * @return {Number}
     */
    Heroes.getFreeSlots = function() {
        return parseInt(this.get('free_slots'), 10);
    };

    /**
     * Returns information whether are free slots or not
     *
     * @return {Boolean}
     */
    Heroes.hasFreeSlots = function() {
        return this.getFreeSlots() > 0;
    };

    /**
     * Used to buy hero premium slot
     *
     * @return void
     */
    Heroes.buyAdditionalSlot = function() {
        this.execute('buyPremiumSlot', {}, {
            success: function(data) {
                //console.log('successfull extended:', data);
            },
            error: function(data) {
                //console.log('error during extension:', data);
            }
        });
    };

    Heroes.swapOffer = function() {
        this.execute('swapOffer', {}, {
            success: function(data) {},
            error: function(data) {}
        });
    };

    /**
     * Used to exchange coins (of war and or wisdom)
     *
     * @param {String} coins_type   coins type (coins_of_war, coins_of_wisdom)
     * @param {Number} amount       amount of coins you want to exchange
     * @param {Function} callback   callback function which will be executed on success
     *
     * @return void
     *
     * Example:
     * Exchange 2 coins of war to coins of wisdome with exchange rate which was
     * displayed in the window
     *
     * this.exchangeCoins('coins_of_war', 2, function(){});
     */
    Heroes.exchangeCoins = function(coins_type, amount, callback) {
        this.execute('exchangeCoins', {
            type: coins_type,
            amount: amount
        }, {
            success: function(data) {
                //console.log('successfull coins exchange:', data);
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function(data) {
                //console.log('error coins exchange:', data);
            }
        });
    };

    window.GameModels.Heroes = GrepolisModel.extend(Heroes);
}());