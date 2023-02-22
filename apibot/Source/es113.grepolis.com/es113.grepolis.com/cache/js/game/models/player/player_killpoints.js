/* global GrepolisModel, us */
(function() {
    'use strict';

    var PlayerKillpoints = function() {};

    PlayerKillpoints.urlRoot = 'PlayerKillpoints';

    GrepolisModel.addAttributeReader(PlayerKillpoints,
        'player_id',
        'att',
        'def',
        'used'
    );

    PlayerKillpoints.initialize = function( /*params*/ ) {};

    /**
     * Returns the number of battle points available to spend.
     * Sums attack and defense points and subtracts used points.
     *
     * @return {number}
     */
    PlayerKillpoints.getUnusedPoints = function() {
        return this.getAtt() + this.getDef() - this.getUsed();
    };

    PlayerKillpoints.onPointsChange = function(obj, cb) {
        obj.listenTo(this, 'change:att change:def change:used', cb);
    };

    window.GameModels.PlayerKillpoints = GrepolisModel.extend(PlayerKillpoints);
}());