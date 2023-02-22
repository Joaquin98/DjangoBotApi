/* global GameDataAlliance, DM, HumanMessage, WMap, hCommon, hOpenWindow, gpAjax, Layout, GPWindowMgr, GameEvents, Game */

window.Alliance = (function() {
    'use strict';

    var Alliance = {
        rights: {},
        title: {},

        action: function(action, params, callback) {
            var fn = function(data) {
                    if (typeof callback === 'function') {
                        callback(data);
                    }
                },
                post_actions = [
                    'save',
                    'updateName',
                    'updateFurtherSettings',
                    'updateApplicationMessage',
                    'resetApplicationMessage',
                    'kick',
                    'cancel_invitation',
                    'cancel_mass_invitation',
                    'choose_flag'
                ];

            if (post_actions.indexOf(action) !== -1) {
                gpAjax.ajaxPost('alliance', action, params, true, fn);
            } else {
                gpAjax.ajaxGet('alliance', action, params, true, fn);
            }
        },

        save: function(target, callback) {
            var textarea = $('#ally_' + target + '_textarea'),
                max_length = GameDataAlliance.getMaxLengthForProfileFields(),
                l10n = DM.getl10n('alliance', 'profile');

            // do nothing, when element not found
            // without this condition sometimes controller get something like: [json] => {"field": "profile", "value": undefined}
            if (textarea.length === 0) {
                return;
            }

            if (textarea.val().length > max_length) {
                return HumanMessage.error(l10n.error_profile_length(max_length));
            }

            var params = {
                field: target,
                value: textarea.val()
            };

            Alliance.action('save', params, callback);
        },

        editAnnounce: function() {
            var callback = function(data) {
                $('#ally_announce_body_content').append('<textarea id="ally_announce_textarea" style="padding:5px 3px;"></textarea>');

                $('#ally_announce_edit').hide();
                $('#ally_announce_bbcodes').show();
                $('#ally_announce_save').show();
                $('#ally_announce_textarea').text(data.value).show();
                $('#ally_announce_body_content .content').hide();
                $('#ally_announce_body_content').find('.bb_chooser').remove();
                $('#ally_announce_body_content').find('.bb_sizes').remove();
                $('#ally_announce_body_content').find('.bb_table_popup').remove();
            };
            var params = {
                field: 'announce'
            };

            Alliance.action('get', params, callback);
        },

        saveAnnounce: function() {
            var callback = function(data) {
                $('#ally_announce_edit').show();
                $('#ally_announce_bbcodes').hide();
                $('#ally_announce_save').hide();
                $('#ally_announce_textarea').detach();
                $('#ally_announce_body_content .content').html(data.value).show();
                $('#ally_announce').parent().next('.bb_color_picker').remove();
            };
            this.save('announce', callback);
        },

        editImage: function() {
            $('#ally_image').hide();
            $('#ally_image_edit').show();
            $('#ally_profile_save_image').show();
        },

        editProfile: function() {
            var callback = function(data) {
                $('#ally_profile_body_content').append('<textarea id="ally_profile_textarea" style="padding:5px 3px;"></textarea>');

                $('#ally_profile_descr').hide();
                $('#profile_bbcodes').show();
                $('#ally_profile_save_desc').show();
                $('#ally_profile_textarea').val(data.value).show();

                $('#ally_profile_body').removeClass('editable');
            };

            var params = {
                field: 'profile'
            };

            Alliance.action('get', params, callback);
        },

        saveProfile: function() {
            var callback = function(data) {
                $('#ally_profile_descr').show();
                $('#profile_bbcodes').hide();
                $('#ally_profile_save_desc').hide();
                $('#ally_profile_textarea').detach();
                $('#ally_profile_body').addClass('editable').find('.ally_profile_content').html(data.value);
                $('#ally_profile_descr').parents(".gpwindow_content").next(".bb_color_picker").remove();
            };

            if ($('#image').val() || $('#delete_image:checked').val()) {
                hCommon.submit_form('alliance_emblem_form', 'alliance', 'updateEmblem');
                //wnd_handle.call('updateEmblem');

                $('#ally_image').show();
                $('#ally_image_edit').hide();
                $('#ally_profile_save_image').hide();
            }

            this.save('profile', callback);
        },

        updateName: function() {
            var alliance_name = $('#alliance_name').val();

            var params = {
                name: alliance_name
            };

            Alliance.action('updateName', params, function() {
                WMap.pollForMapChunksUpdate();
            });

            return false;
        },

        toggleApplicationMessageEditor: function() {
            $('#player_settings').toggleClass('hidden');
            $('#alliance_application_message_editor').toggleClass('hidden');
        },

        saveApplicationMessage: function() {
            var self = this;

            Alliance.action(
                'updateApplicationMessage', {
                    application_message: $('#application_message_textarea').val()
                },
                function() {
                    self.toggleApplicationMessageEditor();
                }
            );
        },

        resetApplicationMessage: function() {
            hOpenWindow.showConfirmDialog(
                _('Are you sure?'),
                _('Do you really want to reset the application message?'),
                function() {
                    Alliance.action('resetApplicationMessage', {}, function(response) {
                        $('#application_message_textarea').val(response.application_message).trigger('change');
                    });
                }
            );
        },

        updateFurtherSettings: function() {
            var params = {
                minimum_points_alliance_finder: $('input:text[name=minimum_points_alliance_finder]').val(),
                show_contact: $('input:checkbox[name=show_contact_buttons]:checked').val(),
                show_founder_icon: $('input:checkbox[name=show_founder_icon]:checked').val(),
                show_pact_member: $('input:checkbox[name=show_pact_member]:checked').val(),
                block_pact_invitations: $('input:checkbox[name=block_pact_invitations]:checked').val(),
                show_members_online_status: $('input:checkbox[name=show_members_online_status]:checked').val(),
                recruitment_state: $('input:radio[name=recruitment_state]:checked').val()
            };

            Alliance.action('updateFurtherSettings', params, function(data) {
                var $label = $('[data-label="alliance-full"]'),
                    is_full = data.is_full;

                $label.toggleClass('hidden', !is_full);
            });

            return false;
        },

        doKickPlayer: function(player_id) {
            Alliance.action('kick', {
                'player_id': player_id
            }, function(data) {
                $('#alliance_player_' + player_id).fadeOut();
                WMap.pollForMapChunksUpdate();
            }.bind(player_id));
        },

        kick_player: function(player_id) {
            var onConfirmationFunction = function() {
                Alliance.doKickPlayer(player_id);
            };

            Layout.showConfirmDialog(_('Kick out player'), _('Are you sure that you want to kick out this player?'), onConfirmationFunction);
        },

        cancel_invitation: function(id) {
            Alliance.action('cancel_invitation', {
                id: id
            }, function(data) {
                $('#invitation_' + id).fadeOut();
                // we do not have the context of the Window, so we fake a reload to fix the UI
                $('a#alliance-invitations').trigger("click");
            }.bind(id));
        },

        cancel_mass_invitation: function(id) {
            Alliance.action('cancel_mass_invitation', {
                id: id
            }, function(data) {
                $('#mass_invitation_' + id).fadeOut();
                // we do not have the context of the Window, so we fake a reload to fix the UI
                $('a#alliance-invitations').trigger("click");
            }.bind(id));
        },

        chooseFlag: function(params, callback) {
            Alliance.action('choose_flag', params, function(data) {
                WMap.pollForMapChunksUpdate();
                callback(data);
            });
        },

        fetchMemberRights: function() {
            var id,
                right;
            for (id in Alliance.rights) {
                if (Alliance.rights.hasOwnProperty(id)) {
                    for (right in Alliance.rights[id]) {
                        if (Alliance.rights[id].hasOwnProperty(right)) {
                            Alliance.rights[id][right] = $('input[name="rights[' + id.toString() + '][' + right.toString() + ']"]').prop('checked') ? 1 : 0;
                        }
                    }
                }
            }

            return Alliance.rights;
        },

        fetchMemberTitle: function() {
            var id;
            for (id in Alliance.rights) {
                if (Alliance.rights.hasOwnProperty(id)) {
                    Alliance.title[id] = $('input[name="title[' + id.toString() + ']"]').val();
                }
            }

            return Alliance.title;
        },

        inviteFriends: function() {
            GPWindowMgr.Create(GPWindowMgr.TYPE_INVITE_FRIENDS, _('Invite friends'));
            Game.invitation_path = {
                src: 'alliance'
            };
            $.Observer(GameEvents.window.alliance.invite_friends).publish();
        }
    };

    return Alliance;
}());