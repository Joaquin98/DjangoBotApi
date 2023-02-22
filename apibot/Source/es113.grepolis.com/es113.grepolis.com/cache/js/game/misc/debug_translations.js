/* global gpAjax, LocalStore */

/**
 * Helper class for enabling/disabling highlighting for translated strings. Will clear the local cache and
 * reload the page after enabling/disabling.
 */
window.DebugTranslations = (function() {
    'use strict';

    var cached_debug_translations = null;

    /**
     * Will do the ajax call and reload the page.
     *
     * @param {Number} state 0 or 1
     */
    function callAction(state) {
        gpAjax.ajaxGet('debug', 'debug_translations', {
            state: state
        }, false, function() {
            LocalStore.gclear();
            location.reload();
        });
    }

    return {
        enable: function() {
            cached_debug_translations = true;
            callAction(1);
        },

        disable: function() {
            cached_debug_translations = false;
            callAction(0);
        },

        /**
         * Checks if the cookie value is set for showing debugging translations
         *
         * @returns {Boolean}
         */
        isEnabled: function() {
            if (cached_debug_translations !== null) {
                return cached_debug_translations
            } else {
                var cookie = $.cookie('DEBUG_TRANSLATIONS');
                cached_debug_translations = !!parseInt(cookie);
                return cached_debug_translations;
            }
        },

        toggle: function() {
            if (this.isEnabled()) {
                this.disable();
            } else {
                this.enable();
            }
        },

        /**
         * @param {String} string
         * @returns {String}
         */
        markString: function(string) {
            return '***' + string + '***';
        }
    };
})();