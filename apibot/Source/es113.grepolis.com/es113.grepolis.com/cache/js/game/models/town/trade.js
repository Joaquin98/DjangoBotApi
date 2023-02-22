/*global GameDataTrades, Timestamp, Game, GrepolisModel */

(function() {
    'use strict';

    var Trade = function() {};

    Trade.urlRoot = 'Trade';

    GrepolisModel.addAttributeReader(Trade,
        'id',
        'started_at',
        'arrival_at',
        'in_exchange',
        'origin_town_link',
        'destination_town_link',
        'wonder_type',
        'destination_town_id',
        'origin_town_id',
        'wood',
        'stone',
        'iron',
        'gold'
    );

    GrepolisModel.addTimestampTimer(Trade, 'arrival_at', true);

    /**
     * Check if trade will be cancelable at given timestamp, e.g. now
     *
     * @return {Boolean}
     */
    Trade.isCancelable = function() {
        var started_at = this.getStartedAt(),
            in_exchange = this.getInExchange();

        return this.get('cancelable') === true && (started_at + GameDataTrades.getCancelTradeTime() > Timestamp.now() && !this.isReturning() && !in_exchange);
    };

    Trade.isReturning = function() {
        return this.get('destination_town_id') === parseInt(Game.townId, 10) && this.get('destination_town_type') === 'game_town';
    };

    /**
     * Returns time when this specific order will not be cancelable anymore
     * or -1 if its already not cancelable
     *
     * @return {Number}
     */
    Trade.getCancelTimeLeft = function() {
        return !this.isCancelable() ? -1 : this.getStartedAt() + GameDataTrades.getCancelTradeTime() - Timestamp.now();
    };

    Trade.getTimeLeft = function() {
        return Math.max(0, this.getRealTimeLeft());
    };

    Trade.getRealTimeLeft = function() {
        return this.getArrivalAt() - Timestamp.now();
    };

    /**
     * get the town link "other_town_id" is interested in
     *
     * @param {Integer} other_town_id
     * @returns {String} destination town link if other_town_id is origin, otherwise origin_town_link
     */
    Trade.getTownLink = function(other_town_id) {
        var town_link;

        if (other_town_id === this.getOriginTownId()) { // I sent this
            town_link = this.getDestinationTownLink();
        } else { // incoming to me
            town_link = this.getOriginTownLink();
        }

        return town_link;
    };

    /**
     * @returns {Object}
     */
    Trade.getCancelRefund = function() {
        return this.getResources();
    };


    Trade.getWorldWonderType = function() {
        return this.get('wonder_type');
    };

    Trade.isTradeToWorldWonder = function() {
        return this.getWorldWonderType() !== null;
    };

    Trade.getTradeIconClass = function() {
        var css_class = 'res';

        if (this.isTradeToWorldWonder()) {
            css_class = 'world_wonder ' + this.getWorldWonderType();
        }

        return css_class;
    };

    /**
     * Returns traded resources
     *
     * @return {Object} wood, stone, iron
     */
    Trade.getResources = function() {
        return {
            wood: this.get('wood'),
            stone: this.get('stone'),
            iron: this.get('iron'),
            gold: this.get('gold')
        };
    };

    /**
     * cancel this trade
     *
     * @return {Promise|null}
     */
    Trade.cancel = function() {
        var params = {
            id: this.getId()
        };

        return this.execute('cancel', params);
    };

    window.GameModels.Trade = window.GrepolisModel.extend(Trade);
}());