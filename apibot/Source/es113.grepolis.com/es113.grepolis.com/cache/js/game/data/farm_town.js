/*globals Game */
define('data/farm_town', function() {
    return {
        getTradeRatioDefault: function() {
            return Game.constants.farm_towns.trade_ratio_default;
        },

        getTradeRatioBonus: function() {
            return Game.constants.farm_towns.trade_ratio_bonus;
        }
    };
});