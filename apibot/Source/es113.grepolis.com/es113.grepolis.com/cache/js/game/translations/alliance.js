/*global _, DM */

(function() {
    'use strict';

    DM.loadData({
        l10n: {
            alliance: {
                index: {
                    button_apply: _('Apply'),
                    button_join: _('Join'),
                    button_send: _('Send'),
                    button_preview: _('Preview'),
                    button_edit: _('Edit'),
                    tooltip_disabled: function(min_points) {
                        return s(_('You need at least %1 points to send an application to this alliance.<br />This threshold has been set by the leadership of this alliance.'), min_points);
                    },
                    tooltip_accept_application: _('Accept application'),
                    tooltip_reject_application: _('Reject application'),
                    tooltip_withdraw_application: _('Withdraw application'),
                    tooltip_full: _('This alliance is full.'),
                    tooltip_already_member: _('Player is already a member of an alliance.'),
                    tooltip_recommended_star: _('Best alliance in your area. You should join it!'),
                    tooltip_open_state: _('Every player can join the alliance without having to apply.'),
                    tooltip_application_state: _('Players can send applications which have to be accepted by the alliance.'),
                    tooltip_closed_state: _('Players can only join the alliance after being invited.'),
                    unsaved_application_popup_title: _('Close window'),
                    unsaved_application_popup_text: _('Do you really want to close this window? The unsaved text will be lost.'),
                    dissolve_popup_title: _('Dissolve alliance'),
                    dissolve_application_popup_text: _('Are you sure that you want to dissolve the alliance?'),
                    ocean: function(sea_id) {
                        return s(_("Ocean: %1"), sea_id);
                    },
                    all_oceans: _("All oceans")
                }
            }
        }
    });
}());