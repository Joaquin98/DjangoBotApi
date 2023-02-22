/* global GrepolisModel, Game */
(function() {
    'use strict';

    var MobileMessages = require('mobile/messages');

    var PlayerLedger = GrepolisModel.extend({
        urlRoot: 'PlayerLedger',

        initialize: function() {
            if (Game.isHybridApp()) {
                this.on('change:gold', function() {
                    MobileMessages.updatePlayerGold(this.getGold());
                }.bind(this));
            }
        },

        /**
         * Function used only for debugging
         */
        _setGold: function(value) {
            return this.set('gold', value);
        },

        /**
         * Returns amount of currency that player owns by type
         *
         * @param {String} type
         *
         * @return {Integer}
         */
        getCurrency: function(type) {
            return this.get(type);
        },

        /**
         * Returns amount of gold owned by user
         *
         * @return {Integer}
         */
        getGold: function() {
            return this.get('gold');
        },

        /**
         * Returns amount of "Coins of Wisdom" owned by user
         *
         * @return {Integer}
         */
        getCoinsOfWisdom: function() {
            return this.get('coins_of_wisdom');
        },

        /**
         * Returns amount of "Coins of War" owned by user
         *
         * @return {Integer}
         */
        getCoinsOfWar: function() {
            return this.get('coins_of_war');
        },

        /**
         * Returns the sum of "Battle tokens" (Event currency) earned by the player
         *
         * @return {Integer}
         */
        getBattleTokens: function() {
            return this.get('battle_tokens');
        },

        /**
         * @return {Integer}
         */
        getLaurels: function() {
            return this.get('laurels');
        },

        /**
         * @return {Integer}
         */
        getGridCurrency: function() {
            return this.get('grid');
        },

        /**
         * @return {Integer}
         */
        getGridProgressionCurrency: function() {
            return this.get('grid_progression');
        },

        getRotaTycheCoins: function() {
            return this.get('rota_tyche_coins');
        },

        /**
         * Listens on the currency change
         *
         * @deprecated
         */
        onCurrencyChange: function(currency, callback, context) {
            this.on('change:' + currency, callback, context);
        },

        onGoldChange: function(obj, callback) {
            obj.listenTo(this, 'change:gold', callback);
        },

        /**
         * Listens on the Coins of war an wisdom change
         *
         * @param obj Backbone.View
         * @param callback Function
         * @return void
         */
        onCoinsOfWarAndWisdomChange: function(obj, callback) {
            obj.listenTo(this, 'change:coins_of_wisdom change:coins_of_war', callback);
        },

        /**
         * Listens on the Battle tokens change
         *
         * @param obj Backbone.View
         * @param callback Function
         * @return void
         */
        onBattleTokensChange: function(obj, callback) {
            obj.listenTo(this, 'change:battle_tokens', callback);
        },

        onLaurelsChange: function(obj, callback) {
            obj.listenTo(this, 'change:laurels', callback);
        },

        onGridCurrencyChange: function(obj, callback) {
            obj.listenTo(this, 'change:grid', callback);
        },

        onGridProgressionCurrencyChange: function(obj, callback) {
            obj.listenTo(this, 'change:grid_progression', callback);
        },

        onRotaTycheCoinsChage: function(obj, callback) {
            obj.listenTo(this, 'change:rota_tyche_coins', callback);
        },

        /**
         * Obj stops listening to this
         *
         * @param obj Backbone.View
         * @return void
         */
        offCoinsOfWarAndWisdomChange: function(obj) {
            obj.stopListening(this, 'change:coins_of_wisdom change:coins_of_war');
        },

        /**
         * Listens to tradable gold changes
         *
         * @param obj Backbone.View
         * @return void
         */
        onUnblockedGoldChange: function(obj, callback) {
            obj.listenTo(this, 'change:gold_unblocked', callback);
        },

        /**
         * Unregister object to listen for tradable gold changes
         * @param obj object to unregister
         */
        offUnblockedGoldChange: function(obj) {
            obj.stopListening(this, 'change:gold_unblocked');
        }
    });

    window.GameModels.PlayerLedger = PlayerLedger;
}());