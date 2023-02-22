/* global Game */
define('data/map', function() {
    return {

        getUseableTownSpotsOnIsland: function() {
            return Game.constants.maps.usable_game_town_spot_count_on_inhabitable_islands;
        }

    };
});