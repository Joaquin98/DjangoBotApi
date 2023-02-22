/* global us */

(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var GameEvents = window.GameEvents;

    var Trade = window.GameModels.Trade;

    var Trades = function() {}; // never use this, becasue it will be overwritten

    Trades.model = Trade;
    Trades.model_class = 'Trade';

    Trades.initialize = function(models, options) {
        //Sort trades by time left
        this.comparator = function(model_trade) {
            return model_trade.getTimeLeft();
        };

        window.CollectionAutomaticFetchFactory.initializeNotificationRequestHandlerForTrades(this);

        /**
         * we do not sort on model.add during gameload, so we have to do it here manually
         */
        $.Observer(GameEvents.game.start).subscribe(['trades'], function() {
            this.sort();
        }.bind(this));
    };

    /**
     * Returns array of trades models
     *
     * @return {Array}
     */
    Trades.getTrades = function() {
        return this.models;
    };

    Trades.getTradeById = function(trade_id) {
        var trade, trades = this.getTrades(),
            i, l = trades.length;

        for (i = 0; i < l; i++) {
            trade = trades[i];

            if (trade.getId() === trade_id) {
                return trade;
            }
        }

        return false;
    };

    /**
     * Returns number of trades
     */
    Trades.getTradesCount = function() {
        return this.models.length;
    };

    /**
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    Trades.onTradeArrived = function(obj, callback) {
        obj.listenTo(this, 'timestamp:arrival_at', callback);
    };

    window.GameCollections.Trades = GrepolisCollection.extend(Trades);

    /**
     * Mixin GrepolisCollectionAutomaticFetch into Trades
     */
    us.extend(window.GameCollections.Trades.prototype, window.GrepolisCollectionAutomaticFetch);
}());