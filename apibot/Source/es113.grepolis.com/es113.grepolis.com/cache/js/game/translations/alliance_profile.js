/*global DM, _*/

(function() {
    'use strict';

    DM.loadData({
        l10n: {
            alliance: {
                profile: {
                    tooltip_msg_founder: _('Message to the alliance founder'),
                    tooltip_msg_leader: _('Message to the alliance leader'),
                    tooltip_msg_no_recipients: _('The recipient list is empty.'),
                    tooltip_msg_yourself: _('You are the only recipient on this list.'),
                    tooltip_already_member: _('Already a member of this alliance'),
                    tooltip_member_of_another: _('You need to leave your current alliance before joining this alliance.'),
                    tooltip_insufficient_points: {
                        apply: _('You need at least %1 points to send an application to this alliance.'),
                        join: _('You need at least %1 points to join this alliance.'),
                        total: _('You have %1 points right now.')
                    },
                    tooltip_full: _('This alliance is full.'),
                    tooltip_closed: _('Players can only join the alliance after being invited.'),
                    apply: _('Apply'),
                    join: _('Join'),
                    closed: _('Closed'),
                    leave: _('Leave'),
                    error_profile_length: function(max_length) {
                        return s(_('The maximum length of the input field is %1 characters.'), max_length);
                    }
                }
            }
        }
    });
}());