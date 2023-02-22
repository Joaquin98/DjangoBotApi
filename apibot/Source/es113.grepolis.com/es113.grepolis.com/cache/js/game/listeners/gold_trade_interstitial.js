/* globals GoldTradeInterstitialWindowFactory, Backbone, GameListeners */

(function() {
    'use strict';

    var GoldTradeInterstitial = {
        _current_town_model: null,

        initialize: function(models, collections) {
            var GameDataFeatureFlags = require('data/features');

            if (GameDataFeatureFlags.isPremiumExchangeEnabled()) {
                collections.player_hints.onShowHintInterstitialWindow('premium_trade_market_interstitial', this, function() {
                    GoldTradeInterstitialWindowFactory.openUnlockedWindow();
                });
            }
        },

        // Don't remove otherwise everything breaks
        destroy: function() {

        }
    };

    us.extend(GoldTradeInterstitial, Backbone.Events);

    GameListeners.GoldTradeInterstitial = GoldTradeInterstitial;
}());