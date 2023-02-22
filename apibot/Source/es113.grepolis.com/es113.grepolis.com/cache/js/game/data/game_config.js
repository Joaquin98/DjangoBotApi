/* global Game */
define('data/game_config', function() {

    var game_config = Game.constants.game_config;

    return {
        getRevoltDurationInSeconds: function() {
            return game_config.revolt_duration_seconds;
        },

        getRevoltDelayInSeconds: function() {
            return game_config.revolt_delay_seconds;
        },

        getTownFoundationDurationInSeconds: function() {
            return game_config.town_foundation_seconds;
        },

        getConquestTimeInSecods: function() {
            var hours = game_config.conquest_time_hours;

            //@see admin tool: this is the default
            if (hours === 0) {
                hours = 24;
            }

            return hours * 60 * 60;
        },

        getKillPointMultiplierAllianceUnits: function() {
            return game_config.killpoint_multiplier_alliance_units;
        }
    };
});