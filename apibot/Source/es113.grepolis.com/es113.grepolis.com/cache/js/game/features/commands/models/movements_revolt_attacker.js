define('features/commands/models/movements_revolt_attacker', function() {
    'use strict';

    var MovementsRevolt = require('features/commands/models/movements_revolt');

    window.GameModels.MovementsRevoltAttacker = MovementsRevolt.extend({
        urlRoot: 'MovementsRevoltAttacker'
    });

    return window.GameModels.MovementsRevoltAttacker;
});