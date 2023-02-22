/* global gpAjax, Layout, GPWindowMgr, Game */
define('helpers/alliance', function() {
    'use strict';

    var Features = require('data/features');

    return {
        joinAlliance: function(alliance_id, callback, is_joining_open_alliance) {
            gpAjax.ajaxPost('alliance', 'join', {
                alliance_id: alliance_id,
                is_joining_open_alliance: is_joining_open_alliance
            }, true, callback);
        },

        applyToAlliance: function(alliance_id, message, callback) {
            gpAjax.ajaxPost('alliance', 'send_application', {
                alliance_id: alliance_id,
                message: message
            }, true, callback);
        },

        acceptApplication: function(application_id, callback) {
            gpAjax.ajaxPost('alliance', 'accept_application', {
                id: application_id
            }, true, callback);
        },

        rejectApplication: function(application_id, callback) {
            gpAjax.ajaxPost('alliance', 'reject_application', {
                id: application_id
            }, true, callback);
        },

        withdrawApplication: function(application_id, callback) {
            gpAjax.ajaxPost('alliance', 'withdraw_application', {
                id: application_id
            }, true, callback);
        },

        leaveAlliance: function(callback) {
            var cleanUpWindows = function() {
                $('#chat_link').remove();

                var chat_w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_CHAT);

                if (chat_w) {
                    chat_w.close();
                }
                var forum_w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_ALLIANCE_FORUM);

                if (forum_w) {
                    forum_w.close();
                }

                Layout.allianceForum.close();

                callback();
            };

            var message = _("Do you really want to leave the alliance?");

            if (Features.isOlympusEndgameActive()) {
                message += '<br><br><b>';
                message += _("Leaving will dissolve any temple sieges you are currently leading!");
                message += '</b>';
            }

            if (Game.age_of_wonder_started_at && !Game.days_left_until_shutdown) {
                message += '<br><br><b>';
                message += _("The World Wonders era has started.") + '<br>';
                message += _("If you leave an alliance now, you will not be able to send resources to World Wonders for 72 hours after joining an alliance again.") + '<br>';
                message += _("If your cities are on an island with a World Wonder, it's level may decrease.");
                message += '</b>';
            }

            Layout.showConfirmDialog(_('Leave alliance'), message, function() {
                gpAjax.ajaxPost('alliance', 'leave', {}, false, cleanUpWindows);
            });
        },

        acceptInvitation: function(invitation_id, callback) {
            gpAjax.ajaxPost('alliance', 'join', {
                alliance_id: invitation_id
            }, true, callback);
        },

        rejectInvitation: function(invitation_id, callback) {
            gpAjax.ajaxPost('alliance', 'reject_invitation', {
                id: invitation_id
            }, true, callback);
        },

        withdrawInvitation: function(invitation_id, callback) {
            gpAjax.ajaxPost('alliance', 'cancel_invitation', {
                id: invitation_id
            }, true, callback);
        }
    };
});