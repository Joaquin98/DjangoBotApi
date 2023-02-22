/* globals DM, CM, WndHandlerDefault, _, BBCode, WMap, jQuery, Alliance, Layout, reservationTool, GameEvents, gpAjax,
GPWindowMgr, GameData, isNumber */
(function($) {
    'use strict';

    var HelperAlliance = require('helpers/alliance');

    // inheritance:
    function WndHandlerAlliance(wndhandle) {
        this.wnd = wndhandle;
        this.updateMap = false;

        this.reservationTool = null;
        this.action = 'index';
        this.auto = false;
    }

    WndHandlerAlliance.inherits(WndHandlerDefault);

    WndHandlerAlliance.prototype.getDefaultWindowOptions = function() {
        return {
            minHeight: 512,
            maxHeight: 512,
            width: 800,
            minimizable: true,
            title: _('Alliance')
        };
    };

    /**
     * Window Initialization
     *
     * @param title String  => window title
     * @param UIopts Object => Jquery UI Options for the window
     * @param town_id
     * variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerAlliance.prototype.onInit = function(title, UIopts, town_id, action, alliance_id) {
        var sub_content,
            params = {
                'town_id': town_id
            };
        UIopts = UIopts || {};

        if (action !== null && action !== undefined) {
            this.action = action;
        }
        if (alliance_id !== null) {
            this.alliance_id = alliance_id;
            params.alliance_id = alliance_id;
        }

        if (UIopts.auto !== null && UIopts.auto !== undefined) {
            this.auto = UIopts.auto;
        }

        if (UIopts.sub_content !== null && UIopts.sub_content !== undefined) {
            sub_content = UIopts.sub_content;
        } else {
            sub_content = this.action;
        }

        // Invoke town loading
        if (!UIopts.noInitRequest) {
            this.wnd.requestContentGet('alliance', sub_content, params);
        }

        return true;
    };

    WndHandlerAlliance.prototype.onRcvData = function(data, controller, action) {
        this.action = action;

        if (controller === 'alliance') {
            if (action !== 'world_wonders') {
                this.wnd.setContent(data.html);
            }

            var wrapper = this.wnd.getJQElement().find('div.bb_button_wrapper:not(.application_message_bb_button_wrapper)'),
                that = this;

            switch (action) {
                case 'index':
                case 'create':
                    this.bbcode = new BBCode(this.wnd, wrapper, '#ally_announce_textarea');
                    break;
                case 'properties':
                    this.bbcode = new BBCode(this.wnd, wrapper, '#ally_profile_textarea');

                    new BBCode(
                        this.wnd,
                        this.wnd.getJQElement().find('div.bb_button_wrapper.application_message_bb_button_wrapper'),
                        '#application_message_textarea'
                    );

                    $('#application_message_textarea').on('keyup change', function() {
                        var $this = $(this),
                            $character_counter = $this.siblings('.character_counter'),
                            message_length = $this.val().length,
                            characters_left = $this.attr('maxlength') - message_length;

                        $character_counter.find('.count').text(characters_left);
                        $character_counter.find('.singular').toggleClass('hidden', characters_left !== 1);
                        $character_counter.find('.plural').toggleClass('hidden', characters_left === 1);
                    });

                    break;
                case 'createNewOnRegisterInvitation': // intentional fall through
                case 'invitations':
                    $('#generate_new_link').on("click", function() {
                        that.createNewOnRegisterInvitation();
                    });
                    break;
                case 'alliance_pact':
                    if (this.auto) {
                        window.tabs.ally_pact_tabs.el.tabs('option', 'active', 1);
                        this.auto = false;
                    }
                    break;
                case 'world_wonders':
                    this.wnd.setContent(us.template(data.html));
                    this.registerWonderGracePeriodProgressBar();
                    break;
                case 'wonder_sites':
                    this.registerWonderSitesScroll();
                    this.registerWonderSitesFilter();
                    break;
                case 'create_application':
                    this.bbcode = new BBCode(this.wnd, wrapper, '#application_edit_message');
                    this.alliance_id = data.alliance_id;
                    break;
                case 'temple_overview':
                    this.registerTempleOverviewComponents();
            }
        } else if (controller === 'reservation') {
            if (this.reservationTool) {
                this.reservationTool.destroy();
                this.reservationTool = null;
            }

            if (action === 'index') {
                this.reservationTool = reservationTool.initialize(this.wnd, data);
            } else if (action === 'show_reservation_settings') {
                this.reservationTool = window.reservationToolSettings.initialize(this.wnd, data);
            }
        }

        //This part of the code probably should also go to controller === 'alliance' condition
        if (this.updateMap) {
            this.updateMap = false;
            WMap.pollForMapChunksUpdate();
        }

        this.registerComponents();
    };

    WndHandlerAlliance.prototype.registerTempleOverviewComponents = function() {
        var $el = $('.alliance_temple_overview'),
            $gods = $el.find('td.god .god_micro');

        $el.find('.expandable_list .olympus_purple_header').off().on('click', function(event) {
            var $target = $(event.currentTarget),
                list = $target.data('list'),
                $list = $el.find('.expandable_list[data-list="' + list + '"]'),
                is_closed = $list.hasClass('close');

            $list.toggleClass('close', !is_closed);
            $list.toggleClass('open', is_closed);
        });

        $gods.each(function(idx, el) {
            var $el = $(el),
                god_id = $el.data('id');

            $el.tooltip(GameData.gods[god_id].name);
        });
    };

    WndHandlerAlliance.prototype.registerWonderGracePeriodProgressBar = function() {
        var WonderHelper = require('helpers/wonder');
        WonderHelper.registerGracePeriodProgressBar(this.wnd);
    };

    WndHandlerAlliance.prototype.registerComponents = function() {
        var that = this,
            wnd = this.wnd,
            l10n = DM.getl10n('alliance', 'index'),
            root = this.wnd.getJQElement(),
            alliance_properties_wrapper = $('#alliance_properties_wrapper');

        var open_state_label = alliance_properties_wrapper.find('label[for="recruitment_state_0"]'),
            application_state_label = alliance_properties_wrapper.find('label[for="recruitment_state_1"]'),
            closed_state_label = alliance_properties_wrapper.find('label[for="recruitment_state_2"]');

        open_state_label.tooltip(l10n.tooltip_open_state);
        application_state_label.tooltip(l10n.tooltip_application_state);
        closed_state_label.tooltip(l10n.tooltip_closed_state);

        $('#recommended_star').tooltip(l10n.tooltip_recommended_star);

        var registerAllianceFinderComponents = function(index, element) {
            var $el = $(element),
                alliance_id = $el.data('alliance_id'),
                disabled = $el.data('disabled') === 1,
                min_points = $el.data('min_points'),
                recruit_state = $el.data('recruitment_state');

            if (recruit_state === 'open') {
                CM.register(that.wnd.getContext(), 'ally_join_button' + alliance_id, $el.button({
                    caption: l10n.button_join,
                    disabled: disabled
                }).on('btn:click', function() {
                    that.joinAlliance(alliance_id, true);
                }));
            } else {
                CM.register(that.wnd.getContext(), 'ally_application_button_' + alliance_id, $el.button({
                    caption: l10n.button_apply,
                    disabled: disabled
                }).on('btn:click', function() {
                    that.wnd.requestContentGet('alliance', 'create_application', {
                        alliance_id: alliance_id
                    });
                }));
            }

            if (disabled) {
                $el.tooltip(l10n.tooltip_disabled(min_points));
            }
        };
        $('#ally_finder_text').find('td.ally_application div').each(registerAllianceFinderComponents);

        var registerAcceptApplicationComponents = function(index, element) {
            var $el = $(element),
                application_id = $el.data('application_id'),
                is_full = $el.data('is_full') === 1,
                player_has_alliance = $el.data('player_alliance_id') > 0,
                disabled = is_full || player_has_alliance;

            var tooltip = is_full ? l10n.tooltip_full : l10n.tooltip_already_member;

            CM.register(wnd.getContext(), 'ally_application_accept_button_' + application_id, $el.button({
                caption: '',
                icon: true,
                icon_type: 'checkmark',
                disabled: disabled,
                state: disabled,
                tooltips: [{
                        title: l10n.tooltip_accept_application
                    },
                    {
                        title: tooltip
                    }
                ]
            }).on('btn:click', function() {
                HelperAlliance.acceptApplication(application_id, function() {
                    wnd.reloadContent();
                });
            }));
        };
        $('#ally_applications').find('.accept_application').each(registerAcceptApplicationComponents);

        var registerRejectApplicationComponents = function(index, element) {
            var $el = $(element),
                application_id = $el.data('application_id');

            CM.register(wnd.getContext(), 'ally_application_reject_button_' + application_id, $el.button({
                caption: '',
                icon: true,
                icon_type: 'cross',
                tooltips: [{
                    title: l10n.tooltip_reject_application
                }]
            }).on('btn:click', function() {
                HelperAlliance.rejectApplication(application_id, function() {
                    wnd.reloadContent();
                });
            }));
        };
        $('#ally_applications').find('.reject_application').each(registerRejectApplicationComponents);

        var registerWithdrawApplicationComponents = function(index, element) {
            var $el = $(element),
                application_id = $el.data('application_id');

            CM.register(wnd.getContext(), 'ally_application_withdraw_button_' + application_id, $el.button({
                caption: '',
                icon: true,
                icon_type: 'cross',
                tooltips: [{
                    title: l10n.tooltip_withdraw_application
                }]
            }).on('btn:click', function() {
                HelperAlliance.withdrawApplication(application_id, function() {
                    wnd.reloadContent();
                });
            }));
        };
        $('#ally_my_applications').find('.withdraw_application').each(registerWithdrawApplicationComponents);

        var sendButtonHandler = function() {
            HelperAlliance.applyToAlliance(that.alliance_id, $('#application_edit_message').val(), function() {
                that.wnd.requestContentGet('alliance', 'applications', {});
            });
        };

        CM.register(this.wnd.getContext(), 'btn_send_application', root.find('.btn_send_application').button({
            caption: l10n.button_send
        }).on('btn:click', sendButtonHandler));

        CM.register(this.wnd.getContext(), 'btn_send_preview_application', root.find('.btn_send_preview_application').button({
            caption: l10n.button_send
        }).on('btn:click', sendButtonHandler));

        CM.register(this.wnd.getContext(), 'btn_preview_application', root.find('.btn_preview_application').button({
            caption: l10n.button_preview
        }).on('btn:click', this.messagePreview));

        CM.register(this.wnd.getContext(), 'btn_edit_application', root.find('.btn_edit_application').button({
            caption: l10n.button_edit
        }).on('btn:click', function() {
            $('#application_edit').show();
            $('#application_preview').hide();
        }));
    };

    WndHandlerAlliance.prototype.onBeforeTabSwitch = function(switchTabFn) {
        return this.preventLosingData('switch', switchTabFn);
    };

    WndHandlerAlliance.prototype.onClose = function() {
        var _self = this;

        return this.preventLosingData('close', function() {
            if (_self.reservationTool) {
                _self.reservationTool.destroy();
                _self.reservationTool = null;
            }
        });
    };

    WndHandlerAlliance.prototype.preventLosingData = function(type, fn) {
        var _self = this,
            l10n = DM.getl10n('alliance', 'index');

        if (this.action === 'show_reservation_settings' && _self.reservationTool.hasUnsavedChanges()) {
            Layout.showConfirmDialog(
                l10n.unsaved_application_popup_title,
                l10n.unsaved_application_popup_text,
                function() {
                    if (type === 'close') {
                        _self.reservationTool.resetUnsavedChanges();
                        _self.wnd.close();
                    } else {
                        if (typeof fn === 'function') {
                            fn();
                        }
                    }
                }
            );

            return false;
        }

        if (this.action === 'create_application' && !_self.force_close) {
            Layout.showConfirmDialog(
                l10n.unsaved_application_popup_title,
                l10n.unsaved_application_popup_text,
                function() {
                    if (type === 'close') {
                        _self.force_close = true;
                        _self.wnd.close();
                    } else {
                        if (typeof fn === 'function') {
                            fn();
                        }
                    }
                }
            );

            return false;
        }

        if (typeof fn === 'function' && type !== 'switch') {
            fn();
        }

        return true;
    };

    WndHandlerAlliance.prototype.getPage = function() {
        return null;
    };

    WndHandlerAlliance.prototype.inviteIntoAlliance = function() {
        var player_name = $('#' + this.wnd.getName() + ' #invitation_form input[name=name]').val();
        this.wnd.requestContentPost('alliance', 'invite', {
            player_name: player_name
        });
    };

    WndHandlerAlliance.prototype.massInviteIntoAlliance = function() {
        var alliance_name = $('#' + this.wnd.getName() + ' #mass_invitation_form input[name=alliance_name]').val();
        this.wnd.requestContentPost('alliance', 'massInvite', {
            alliance_name: alliance_name
        });
    };

    WndHandlerAlliance.prototype.createNewOnRegisterInvitation = function() {
        this.wnd.requestContentPost('alliance', 'createNewOnRegisterInvitation');
    };

    WndHandlerAlliance.prototype.createAlliance = function(name) {
        this.wnd.clearMenu();
        this.updateMap = true;
        this.wnd.requestContentPost('alliance', 'create', {
            name: name
        }, function(objGPWnd, data) {
            $.Observer(GameEvents.alliance.join).publish({
                alliance_id: data.data.alliance_id
            });
            $.Observer(GameEvents.alliance.create).publish({
                alliance_name: name
            });
        });
    };

    WndHandlerAlliance.prototype.leaveAlliance = function() {
        this.updateMap = true;
        this.wnd.clearMenu();
        HelperAlliance.leaveAlliance(function() {
            $.Observer(GameEvents.alliance.leave).publish({
                type_of_leaving: 'leave_alliance'
            });
            this.wnd.requestContentGet('alliance', 'index', {});
        }.bind(this));
    };

    WndHandlerAlliance.prototype.withdrawAllianceApplication = function(application_id) {
        this.wnd.requestContentPost('alliance', 'withdraw_application', {
            id: application_id
        });
    };

    WndHandlerAlliance.prototype.rejectAllianceInvitation = function(invitation_id) {
        this.wnd.requestContentPost('alliance', 'reject_invitation', {
            id: invitation_id
        });
    };

    WndHandlerAlliance.prototype.rejectAllianceApplication = function(application_id) {
        this.wnd.requestContentPost('alliance', 'reject_application', {
            id: application_id
        });
    };

    WndHandlerAlliance.prototype.joinAlliance = function(alliance_id, is_joining_open_alliance) {
        HelperAlliance.joinAlliance(alliance_id, function() {
            this.wnd.reloadContent();
        }.bind(this), is_joining_open_alliance);
    };

    WndHandlerAlliance.prototype.acceptAllianceApplication = function(application_id) {
        this.wnd.requestContentPost('alliance', 'accept_application', {
            id: application_id
        });
    };

    WndHandlerAlliance.prototype.rejectMassInvitation = function(invitation_id) {
        this.wnd.requestContentPost('alliance', 'reject_mass_invitation', {
            id: invitation_id
        });
    };

    WndHandlerAlliance.prototype.acceptMassInvitation = function(invitation_id) {
        this.wnd.requestContentPost('alliance', 'accept_mass_invitation', {
            id: invitation_id
        });
    };

    WndHandlerAlliance.prototype.membersShow = function() {
        this.wnd.requestContentGet('alliance', 'members_show', {
            edit: true
        });
    };

    WndHandlerAlliance.prototype.members = function() {
        this.wnd.requestContentPost('alliance', 'members', {
            rights: Alliance.fetchMemberRights(),
            title: Alliance.fetchMemberTitle()
        });
    };

    WndHandlerAlliance.prototype.pactInvite = function() {
        this.wnd.requestContentPost('alliance', 'pact_invite', {
            name: $('#ally_pact_invitation_form_name').val()
        });
    };

    WndHandlerAlliance.prototype.updateEmblem = function() {
        this.wnd.requestContentPost('alliance', 'updateEmblem', {});
    };

    WndHandlerAlliance.prototype.sendApplication = function($alliance_id) {
        gpAjax.ajaxPost('alliance', 'get_application_recipients', {
            alliance_id: $alliance_id
        }, false, function(data) {
            Layout.newMessage.open(data);
        });
    };

    WndHandlerAlliance.prototype.deleteAlliance = function() {
        var wnd = this.wnd,
            self = this,
            l10n = DM.getl10n('alliance', 'index');

        Layout.showConfirmDialog(l10n.dissolve_popup_title, l10n.dissolve_application_popup_text, function() {
            wnd.clearMenu();
            self.wnd.requestContentPost('alliance', 'delete', {}, function(_wnd, data) {
                WMap.pollForMapChunksUpdate();
                Layout.allianceForum.close();

                $.Observer(GameEvents.alliance.leave).publish({
                    type_of_leaving: 'remove_alliance'
                });
                $.Observer(GameEvents.alliance.remove).publish({});
            });
        });
    };

    WndHandlerAlliance.prototype.messagePreview = function() {
        var params = {
            message: $('#application_edit_message').val()
        };

        gpAjax.ajaxPost('message', 'preview', params, true, function(data) {
            $('#application_preview_body').html(data.message);
            $('#application_edit').hide();
            $('#application_preview').show();
        });
    };

    WndHandlerAlliance.prototype.onFocus = function() {

    };

    WndHandlerAlliance.prototype.onBlur = function() {
        var $menu = CM.get(this.wnd.getContext(), 'menu_reserve_town');

        if ($menu) {
            $menu.hide();
        }
    };

    WndHandlerAlliance.prototype.registerWonderSitesScroll = function() {
        var context = this.wnd.getContext(),
            $viewport = this.wnd.getJQElement().find('.possible_wonder_sites');

        CM.unregister(context, 'wonder_sites_scroll');
        CM.register(context, 'wonder_sites_scroll', $viewport.skinableScrollbar({
            skin: 'blue',
            template: 'tpl_skinable_scrollbar',
            elements_to_scroll: $viewport.find('.content'),
            element_viewport: $viewport,
            scroll_position: 0,
            min_slider_size: 16,
            prepend: true,
            elements_to_scroll_position: 'relative'
        }));
    };

    WndHandlerAlliance.prototype.updateWonderSitesScrollbar = function() {
        var component = CM.get(this.wnd.getContext(), 'wonder_sites_scroll');

        if (component) {
            component.update();
        }
    };

    WndHandlerAlliance.prototype.getWonderSitesOptions = function($rows) {
        var l10n = DM.getl10n('alliance', 'index'),
            result = [];

        $rows.each(function(idx, el) {
            var value = parseInt($(el).data('sea'), 10);

            if (result.indexOf(value) === -1) {
                result.push(value);
            }
        });

        result = result.sort(function(a, b) {
            return a - b;
        }).map(function(value) {
            return {
                value: value,
                name: l10n.ocean(value)
            };
        });

        result.splice(0, 0, {
            value: 'all',
            name: l10n.all_oceans
        });

        return result;
    };

    WndHandlerAlliance.prototype.registerWonderSitesFilter = function() {
        var context = this.wnd.getContext(),
            $dropdown = this.wnd.getJQElement().find('#dd_filter_ocean'),
            $rows = this.wnd.getJQElement().find('.possible_wonder_sites tr[data-sea]'),
            options = this.getWonderSitesOptions($rows);

        CM.unregister(context, 'wonder_sites_filter');
        CM.register(context, 'wonder_sites_filter', $dropdown.dropdown({
            value: options[0].value,
            options: options
        }).on("dd:change:value", function(e, new_value) {
            var value = parseInt(new_value, 10);

            if (isNumber(value)) {
                $rows.not('[data-sea="' + value + '"]').hide();
                $rows.filter('[data-sea="' + value + '"]').show();
            } else {
                $rows.show();
            }

            this.updateWonderSitesScrollbar();
        }.bind(this)));
    };

    GPWindowMgr.addWndType('ALLIANCE', 'link_alliance', WndHandlerAlliance, 1);
}(jQuery));