define('data/features', function(require) {
    'use strict';

    var Game = require('game'),
        EndGameTypes = require('enums/end_game_types');

    return {
        isBuildCostReductionEnabled: function() {
            return Game.features.build_cost_reduction_enabled;
        },
        areHeroesEnabled: function() {
            return Game.features.heroes_enabled;
        },
        isInstantBuyEnabled: function() {
            return Game.features.instant_buy !== 'disabled';
        },
        isPremiumExchangeEnabled: function() {
            return Game.features.premium_exchange_active;
        },
        areExtendedWorldFeaturesEnabled: function() {
            return Game.features.extended_world_features;
        },
        isOldCommandVersion: function() {
            return Game.features.command_version === 'old';
        },
        mapChunkBackboneNotifications: function() {
            return Game.features.map_chunks_backbone;
        },
        battlepointVillagesEnabled: function() {
            return Game.features.battlepoint_villages;
        },
        isWorldWondersDonationScreenEnabled: function() {
            return Game.features.wonders_participation;
        },
        isDominationActive: function() {
            return Game.features.is_domination_active;
        },
        getEndGameType: function() {
            return Game.features.end_game_type;
        },
        isCasualWorld: function() {
            return Game.features.casual_world;
        },
        isOlympusEndgameActive: function() {
            return this.getEndGameType() === EndGameTypes.END_GAME_TYPE_OLYMPUS;
        },
        isArtifactLevelsEnabled: function() {
            return Game.features.artifact_levels;
        },
        isNewWorldWonderEndgameEnabled: function() {
            return Game.features.world_wonder_new_endgame;
        },
        isWorldWondersEndgameActive: function() {
            return Game.features.end_game_type === EndGameTypes.END_GAME_TYPE_WONDER;
        }
    };
});