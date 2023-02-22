/* global us, Backbone */

define('listeners/daily_bonus', function(require) {
    'use strict';

    var DailyBonusListener = {

        initialize: function(models, collections) {
            // requiring window factory delayed until initialize because it is declared after this in dependencies.json
            var DailyLoginWindowFactory = require('features/daily_login/factories/daily_login');

            if (models.daily_login.getAcceptedAt() === null) {
                DailyLoginWindowFactory.openWindow();
            }

            models.daily_login.onNewBonusReceived(function() {
                DailyLoginWindowFactory.openWindow();
            });
        },

        destroy: function() {

        }
    };

    us.extend(DailyBonusListener, Backbone.Events);

    window.GameListeners.DailyBonusListener = DailyBonusListener;
    return DailyBonusListener;
});