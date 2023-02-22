/* globals GrepolisModel */
(function() {
    "use strict";

    var PlayerRanking = function() {};

    PlayerRanking.urlRoot = 'PlayerRanking';

    PlayerRanking.initialize = function( /*params*/ ) {};

    PlayerRanking.getRank = function() {
        return this.get('rank');
    };

    PlayerRanking.getPoints = function() {
        return this.get('points');
    };

    PlayerRanking.onChangeRank = function(callback, context) {
        this.on('change:rank', callback, context);
    };

    window.GameModels.PlayerRanking = GrepolisModel.extend(PlayerRanking);
}());