/*globals GameData */

define('data/additional_modifiers', function() {
    'use strict';

    var GameDataAdditionalModifiers = {
        getBonusLighthouseSpeed: function() {
            return GameData.additional_runtime_modifier.lighthouse_speed_bonus;
        },
        getDefaultUnitMovementBoost: function() {
            return GameData.additional_runtime_modifier.default_unit_movement_boost;
        }
    };

    window.GameDataAdditionalModifiers = GameDataAdditionalModifiers;
    return GameDataAdditionalModifiers;
});