define('features/commands/models/movements_revolt_defender', function() {
    'use strict';

    var MovementsRevolt = require('features/commands/models/movements_revolt');

    window.GameModels.MovementsRevoltDefender = MovementsRevolt.extend({
        urlRoot: 'MovementsRevoltDefender'
    });

    return window.GameModels.MovementsRevoltDefender;
});