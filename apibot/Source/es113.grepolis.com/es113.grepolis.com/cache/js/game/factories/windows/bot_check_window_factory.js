/*globals _, jQuery, button */

window.BotCheckWindowFactory = (function() {
    'use strict';

    var is_blocked = false;

    return {
        /**
         * Returns information whether bot check window is opened
         *
         * @return {Boolean}
         */
        isBotCheckActive: function() {
            return is_blocked === true;
        },

        /**
         * Opens 'Bot Check' window
         */
        openBotCheckWindow: function() {
            if (this.isBotCheckActive()) {
                return;
            }

            is_blocked = true;

            return jQuery.blocker({
                html: $('<div><div style="text-align: center;"><b>' +
                        _('Security question') +
                        '</b></div>' +
                        '<div style="text-align: center; margin-top: 15px;">' +
                        _('Please switch to the open game window and answer the security question!') + '</div><br><br></div>')
                    .append(button(_('Ok'), {
                        style: 'float: right;',
                        onClick: 'jQuery.blocker.unblock();',
                        href: '#'
                    })),
                caching: false,
                callback: function() {
                    is_blocked = false;
                }
            });
        }
    };
}());