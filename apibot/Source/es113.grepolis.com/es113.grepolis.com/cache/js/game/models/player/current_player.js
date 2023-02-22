/* globals GrepolisModel, Game */
(function() {
    "use strict";

    var CurrentPlayer = function() {};

    CurrentPlayer.initialize = function(options) {
        this.player_ranking_model = options.player_ranking_model;
        this.player_model = options.player_model;

        this.onChangeRank(function() {
            Game.player_rank = this.getCurrentRank();
        }, this);
    };

    CurrentPlayer.getCurrentRank = function() {
        return this.player_ranking_model.getRank();
    };

    CurrentPlayer.isInAlliance = function() {
        return (this.player_model.getAllianceId());
    };

    CurrentPlayer.onChangeAllianceMembership = function(obj, callback) {
        this.player_model.onChangeAllianceMembership(obj, callback);
    };

    CurrentPlayer.onChangeRank = function(callback, context) {
        this.player_ranking_model.onChangeRank(callback, context);
    };

    window.GameModels.CurrentPlayer = GrepolisModel.extend(CurrentPlayer);
}());