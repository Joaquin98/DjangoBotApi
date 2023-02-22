/* global WndHandlerDefault, DM, CM, Layout, GPWindowMgr */
(function() {
    'use strict';

    var HelperAlliance = require('helpers/alliance');

    function WndHandlerAllianceProfile(wndhandle) {
        this.wnd = wndhandle;
    }
    WndHandlerAllianceProfile.inherits(WndHandlerDefault);

    WndHandlerAllianceProfile.prototype.getDefaultWindowOptions = function() {
        return {
            maxHeight: 570,
            maxWidth: 1200,
            height: 570,
            width: 740,
            resizable: true,
            title: 'Alliance'
        };
    };

    /**
     * Window Initialization
     *
     * @param title String  => window title
     * @param UIopts Object => Jquery UI Options for the window
     * variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerAllianceProfile.prototype.onInit = function(title, UIopts) {
        this.wnd.requestContentGet('alliance', 'profile', {
            'alliance_id': UIopts.alliance_id
        });

        return true;
    };

    WndHandlerAllianceProfile.prototype.onClose = function() {
        return true;
    };

    WndHandlerAllianceProfile.prototype.onRcvData = function(data) {
        var l10n = DM.getl10n('alliance', 'profile'),
            leaders_list = data.recipients_list.leaders,
            founder_list = data.recipients_list.founder,
            context = this.wnd.getContext(),
            root = this.wnd.getJQElement(),
            wnd = this.wnd,
            join_tooltip, apply_tooltip;

        var is_recruitment_disabled = data.player_is_alliance_member || data.insufficient_points || data.is_full;

        if (data.player_is_alliance_member) {
            join_tooltip = l10n.tooltip_already_member;
            apply_tooltip = l10n.tooltip_already_member;
        } else if (data.insufficient_points) {
            join_tooltip = s(l10n.tooltip_insufficient_points.join, data.required_points) +
                '</br>' + s(l10n.tooltip_insufficient_points.total, data.player_points);
            apply_tooltip = s(l10n.tooltip_insufficient_points.apply, data.required_points) +
                '</br>' + s(l10n.tooltip_insufficient_points.total, data.player_points);
        } else if (data.is_full) {
            join_tooltip = l10n.tooltip_full;
            apply_tooltip = l10n.tooltip_full;
        } else if (data.player_is_in_any_alliance) {
            join_tooltip = l10n.tooltip_member_of_another;
        }

        this.wnd.setContent2(data.html);

        $('#ally_towns').on("click", function(e) {
            var target = $(e.target);

            if (target.hasClass('header') || target.hasClass('sub_header')) {
                target.next('li').toggle();
            }
        });

        //Initialize buttons to sent messages to leader and founder
        CM.register(context, 'btn_ally_msg_founder', root.find('.btn_ally_msg_founder').button({
            disabled: founder_list === '',
            state: founder_list === '',
            tooltips: [{
                    title: l10n.tooltip_msg_founder,
                    hide_when_disabled: true
                },
                {
                    title: data.player_is_alliance_founder ? l10n.tooltip_msg_yourself : l10n.tooltip_msg_no_recipients
                }
            ]
        }).on('btn:click', function() {
            Layout.newMessage.open({
                recipients: founder_list
            });
        }));

        CM.register(context, 'btn_ally_msg_leader', root.find('.btn_ally_msg_leader').button({
            disabled: leaders_list === '',
            state: leaders_list === '',
            tooltips: [{
                    title: l10n.tooltip_msg_leader,
                    styles: {
                        width: 400
                    },
                    hide_when_disabled: true
                },
                {
                    title: data.player_is_alliance_leader ? l10n.tooltip_msg_yourself : l10n.tooltip_msg_no_recipients
                }
            ]
        }).on('btn:click', function() {
            Layout.newMessage.open({
                recipients: leaders_list
            });
        }));

        CM.register(context, 'btn_join_alliance', root.find('.btn_join_alliance').button({
            caption: l10n.join,
            disabled: is_recruitment_disabled || data.player_is_in_any_alliance,
            state: is_recruitment_disabled || data.player_is_in_any_alliance,
            tooltips: [{
                    hide_when_disabled: true
                },
                {
                    title: join_tooltip
                }
            ]
        }).on('btn:click', function() {
            HelperAlliance.joinAlliance(data.alliance_id, function() {
                wnd.reloadContent();
            });
        }));

        CM.register(context, 'btn_apply_to_alliance', root.find('.btn_apply_to_alliance').button({
            caption: l10n.apply,
            disabled: is_recruitment_disabled,
            state: is_recruitment_disabled,
            tooltips: [{
                    hide_when_disabled: true
                },
                {
                    title: apply_tooltip
                }
            ]
        }).on('btn:click', function() {
            Layout.createApplication.open(data.alliance_id);
        }));

        CM.register(context, 'btn_alliance_closed', root.find('.btn_alliance_closed').button({
            caption: l10n.closed,
            disabled: true,
            state: true,
            tooltips: [{
                    hide_when_disabled: true
                },
                {
                    title: data.player_is_in_alliance ? l10n.tooltip_already_member : l10n.tooltip_closed
                }
            ]
        }));

        CM.register(context, 'btn_leave_alliance', root.find('.btn_leave_alliance').button({
            caption: l10n.leave,
            tooltips: []
        }).on('btn:click', function() {
            HelperAlliance.leaveAlliance(function() {
                wnd.reloadContent();
            });
        }));
    };

    WndHandlerAllianceProfile.prototype.pactInvite = function(alliance) {
        this.wnd.ajaxRequestPost('alliance', 'pact_invite', {
            name: alliance
        }, function(_wnd, data) {

        });
    };

    GPWindowMgr.addWndType('ALLIANCE_PROFILE', null, WndHandlerAllianceProfile, 1);
}());