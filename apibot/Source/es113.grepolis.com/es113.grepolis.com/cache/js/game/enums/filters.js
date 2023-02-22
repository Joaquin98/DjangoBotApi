/**
 * enum represents all filters which are used for the strategic map filter
 */
define('enums/filters', function() {
    return {
        FILTER_TYPES: {
            ALLIANCE: 'alliance',
            PLAYER: 'player',
            CITYGROUP: 'citygroup'
        },

        ALLIANCE_TYPES: {
            OWN_ALLIANCE: 'own_alliance',
            PACT: 'pact',
            ENEMY: 'enemy'
        },

        PLAYER_TYPES: {
            OWN_CITIES: 'own_cities'
        },

        AUTOCOMPLETE_TYPES: {
            ALLIANCE: 'game_alliance',
            PLAYER: 'game_player'
        },

        PACT: {
            PEACE: 'peace',
            WAR: 'war'
        },

        OWN_PLAYER: 'current_player',
        DEFAULT_PLAYER: 'default_player'
    };
});