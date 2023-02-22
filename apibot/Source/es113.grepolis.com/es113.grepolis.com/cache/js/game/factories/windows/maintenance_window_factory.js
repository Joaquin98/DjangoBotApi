/*globals _, button */

window.MaintenanceWindowFactory = (function() {
    'use strict';

    var is_blocked = false;

    return {
        /**
         * Returns information whether is the maintenance time
         *
         * @return {Boolean}
         */
        isMaintenanceTime: function() {
            return is_blocked === true;
        },

        /**
         * Opens 'Maintenance' window
         */
        openMaintenanceWindow: function(url) {
            if (this.isMaintenanceTime()) {
                return;
            }

            is_blocked = true;

            return jQuery.blocker({
                'html': $('<div><div style="text-align: center;"><b>' +
                        _('Maintenance mode') +
                        '</b></div>' +
                        '<div style="text-align: center; margin-top: 15px;">' +
                        _("Sorry, we're currently doing maintenance. You were automatically logged out!") +
                        '</div><br><br></div>')
                    .append(button(_('Back to the login'), {
                        style: 'float: right;',
                        onClick: 'jQuery.blocker.unblock();',
                        href: '#'
                    })),
                'caching': false,
                'callback': function() {
                    window.location = url;
                }
            });
        }
    };
}());