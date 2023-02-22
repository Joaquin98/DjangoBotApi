/*global GrepolisModel */
(function() {

    var InstantBuyData = function() {};

    InstantBuyData.urlRoot = 'InstantBuyData';

    InstantBuyData.getPrices = function() {
        return this.get('prices');
    };

    InstantBuyData.getPriceTableForType = function(instant_buy_type) {
        var prices = this.getPrices();

        return prices[instant_buy_type];
    };

    window.GameModels.InstantBuyData = GrepolisModel.extend(InstantBuyData);
}());