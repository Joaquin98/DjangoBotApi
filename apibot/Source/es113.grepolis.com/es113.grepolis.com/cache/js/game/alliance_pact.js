/* global gpAjax */

(function() {
    'use strict';

    var AlliancePact = {
        pageHistory: [],

        init: function() {
            $('a.confirm').tooltip(_('Confirm the invitation to the pact'));
            $('#ally_pact_list a.cancel').tooltip(_('Dissolve the pact'));
            $('#ally_pact_invitations a.cancel').tooltip(_('Delete the invitation to the pact'));
            $('#ally_pact_list input.pact_visibility').tooltip(_('Show this fellow pact member in your profile'));
            $('#tab_ally_enemies a.cancel').tooltip(_('Dissolve the feud'));
        },

        saveLocation: function(data) {
            this.pageHistory[this.pageHistory.length] = data;
        },

        getLastLocation: function() {
            return this.pageHistory.pop();
        },

        showGoBackButton: function(current_aliance_id) {
            var l = this.pageHistory.length,
                last_row = this.pageHistory[l - 1];
            return l > 0 || (last_row && last_row.id !== current_aliance_id);
        },

        joinPact: function(inv) {
            gpAjax.ajaxPost('alliance', 'join_pact', {
                invitation_id: inv
            }, true, function(data) {
                $('#invitation_' + data.invitation_id).remove();

                var invitation_list = $('#tab_ally_pact_invitations ul.game_list');
                if (invitation_list.children().length === 0) {
                    invitation_list.append('<li class="odd" style="clear:both;">' + _('No pact requests are available.') + '</li>');
                }

                if (data.end_enmity) {
                    $('#enemy_' + data.enmity_id).remove();

                    var enemy_list = $('#tab_ally_enemies ul.game_list');
                    if (enemy_list.children().length === 0) {
                        enemy_list.append('<li class="odd" style="clear:both;">' + _('No enemies were entered.') + '</li>');
                    }
                }

                // put new pact into pact list
                if ($('#tab_ally_pact_list li.no_entry').length === 1) {
                    $('#tab_ally_pact_list ul.game_list').html(data.pact_html);
                } else {
                    $('#tab_ally_pact_list ul.game_list').append(data.pact_html);
                }

                // reinit tooltips
                $('#ally_pact_list a.cancel').tooltip(_('Dissolve the pact'));
                $('#ally_pact_list input.pact_visibility').tooltip(_('Show this fellow pact member in your profile'));
            });
        },

        cancelInvitation: function(inv) {
            gpAjax.ajaxPost('alliance', 'cancel_pact_invitation', {
                invitation_id: inv
            }, true, function(data) {
                $('#invitation_' + data.invitation_id).remove();
            });
        },

        cancelPact: function(id) {
            gpAjax.ajaxPost('alliance', 'cancel_pact', {
                pact_id: id
            }, true, function(data) {
                $('#pact_' + data.pact_id).remove();

                var pact_list = $('#tab_ally_pact_list ul.game_list');
                if (pact_list.children().length === 0) {
                    pact_list.append('<li class="odd" style="clear:both;">' + _('No pacts are available.') + '</li>');
                }
            });
        },

        set_pact_visibility: function(pact_id, player_alliance_id, partner_id) {
            var visibility = $('input:checkbox[name=show_partner_' + partner_id + ']:checked').val() === 'on' ? true : false;
            gpAjax.ajaxPost('alliance', 'update_pact_partner_visibility', {
                pact_id: pact_id,
                alliance_id: player_alliance_id,
                partner_id: partner_id,
                visibility: visibility
            }, true, function() {});
        },

        mark_enemy: function() {
            var name = $('#ally_enemy_form input').val();
            gpAjax.ajaxPost('alliance', 'mark_enemy', {
                name: name
            }, true, function(data) {
                // put new enemy into enemy list
                if ($('#tab_ally_enemies li.no_entry').length === 1) {
                    $('#tab_ally_enemies ul.game_list').html(data.enemy_html);
                } else {
                    $('#tab_ally_enemies ul.game_list').append(data.enemy_html);
                }

                // reinit tooltip
                $('#tab_ally_enemies a.cancel').tooltip(_('Dissolve the feud'));
            });
        },

        end_enmity: function(enmity_id) {
            gpAjax.ajaxPost('alliance', 'end_enmity', {
                enmity_id: enmity_id
            }, true, function(data) {
                $('#enemy_' + enmity_id).remove();

                var enemy_list = $('#tab_ally_enemies ul.game_list');
                if (enemy_list.children().length === 0) {
                    enemy_list.append('<li class="odd no_entry" style="clear:both;">' + _('No enemies were entered.') + '</li>');
                }
            });
        }
    };

    window.AlliancePact = AlliancePact;
}());