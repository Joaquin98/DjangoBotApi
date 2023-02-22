/*globals Game, MM, gpAjax */

define('helpers/player_hints', function(require) {
    'use strict';

    var HelperPlayerHints = {

        /**
         * test if hint is enabled for player
         *
         * @param {String} player_hint_type
         * @returns {Boolean}
         */
        isHintEnabled: function(player_hint_type) {
            var player_hints = this.getPlayerHintsCollection();
            var player_hint = player_hints.getForType(player_hint_type);
            var is_hidden = player_hint.isHidden();

            if (typeof is_hidden === 'boolean') {
                return !player_hint.isHidden();
            } else {
                //Fallback
                return Game.player_hint_settings[player_hint_type + '_hint'] || true;
            }
        },

        /**
         * Trigger ajax call, disable hint and update Game.player_hint_settings
         *
         * @param {String} player_hint
         * @param {function} callback
         * @param {boolean} silent_arg if true no green flash message is shown after disabling hint
         * @returns {void}
         */
        disable: function(player_hint, callback, silent_arg) {
            var silent = silent_arg || false;

            gpAjax.ajaxPost('player_hint', 'disable', {
                player_hint: player_hint,
                silent: silent
            }, true, function(data) {
                Game.player_hint_settings[player_hint + '_hint'] = false;

                if (typeof callback === 'function') {
                    callback(data);
                }
            });
        },

        /**
         * Get the player hints collection and repopulate it.
         *
         * @returns {window.GameCollections.PlayerHints}
         */
        getPlayerHintsCollection: function() {
            return MM.getOnlyCollectionByName('PlayerHint');
        }
    };

    window.HelperPlayerHints = HelperPlayerHints;

    return HelperPlayerHints;
});