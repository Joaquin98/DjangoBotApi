/* global GameData */
define('data/gods', function() {
    'use strict';

    return {
        /**
         * get all gods in game
         *
         * @todo replace static data by backend response
         * @returns {Array}
         */
        getAllGods: function() {
            return ['athena', 'hades', 'hera', 'poseidon', 'zeus', 'artemis', 'aphrodite', 'ares'];
        },

        /**
         * @param god_id string
         * @returns {Array }
         */
        getPassivePowerNamesForGod: function(god_id) {
            var god_powers = GameData.gods[god_id].powers,
                passive_names = [];
            for (var i = 0; i < god_powers.length; i++) {
                var power = GameData.powers[god_powers[i]];
                if (power.passive && power.favor === 0) {
                    passive_names.push(power.name);
                }
            }

            return passive_names;
        }
    };
});