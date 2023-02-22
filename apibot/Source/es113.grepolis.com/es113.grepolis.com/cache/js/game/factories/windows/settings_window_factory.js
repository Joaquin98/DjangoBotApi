/*globals GPWindowMgr, SettingsWindowFactory, PlayerInfo, GPWindowMgr, _ */

window.SettingsWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens settings window
         *
         * @param {Function} [callback]
         * @return {Object}
         *
         */
        openSettingsWindow: function(params) {
            return GPWindowMgr.Create(GPWindowMgr.TYPE_PLAYER_SETTINGS, _('Settings'), params);
        },

        _openSettingsCategory: function(controller, action, sub) {
            var window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_PLAYER_SETTINGS),
                callback = function() {
                    if (sub) {
                        PlayerInfo.showSubCategory(sub);
                    }

                    PlayerInfo.highlightMenuOption(controller, action, sub);
                };

            if (!window) {
                window = SettingsWindowFactory.openSettingsWindow({
                    noInitRequest: true
                });
            }

            return window.requestContentGet(controller, action, {}, callback);
        },

        openSettingsQuickbar: function() {
            return this._openSettingsCategory('quickbar', 'index', null);
        },

        openSettingsEmailValidation: function() {
            return this._openSettingsCategory('player', 'email_validation', null);
        }
    };
}());