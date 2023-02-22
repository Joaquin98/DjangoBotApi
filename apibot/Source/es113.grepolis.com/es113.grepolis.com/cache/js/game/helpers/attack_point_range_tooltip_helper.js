/* global Game, MM */
define('helpers/attack_point_range_tooltip_helper', function() {
    'use strict';

    return {
        getAttackPointThreshold: function() {
            return 0.2;
        },

        getAttackPointRange: function(town) {
            if (MM.getOnlyCollectionByName('Town').isMyOwnTown(town.id)) {
                return false;
            }

            var threshold = this.getAttackPointThreshold(),
                attacker_points = MM.getModels().PlayerRanking[Game.player_id].getPoints(),
                defender_points = town.player_points,
                minimum_attacker_points = attacker_points - (threshold * attacker_points),
                maximum_attacker_points = attacker_points + (threshold * attacker_points),
                minimum_defender_points = defender_points - (threshold * defender_points),
                maximum_defender_points = defender_points + (threshold * defender_points);

            return (defender_points > minimum_attacker_points && defender_points < maximum_attacker_points) &&
                (attacker_points > minimum_defender_points && attacker_points < maximum_defender_points);
        }
    };
});