/* global Game, MobileMessages, CM, GPWindowMgr, HumanMessage, DM */

(function() {
    'use strict';

    var InternalMarketsHelper = require('helpers/internal_markets');

    function WndHandlerInviteFriends(wndhandle) {
        this.wnd = wndhandle;
        this.selectedSpot = null;
        this.spotData = {};
        this.originalWidth = null;
        this.originalPosition = null;
        this.inviteType = null;
        this.selectionType = null;
        this.controller = 'invite_friends';
        this.referer = {};
        var that = this;

        /**
         * Event handler for click events.
         *
         * @param e Event
         */
        this.clickHandler = function(e) {
            var target = $(e.target).closest('a.button, a.button_link'),
                href = target.attr('href') || '',
                type,
                name;

            if (!href) {
                return true;
            }

            href = href.split('#').reverse()[0].split('.');
            name = href[1] || null;

            target.parents('li').removeClass('transparent').siblings().addClass('transparent');

            if (href[0] === 'invite') {
                Game.invitation_path.type = name;
            } else if (href[0] === 'banners') {
                Game.invitation_path.type = 'banners';
            }

            switch ((type = href[0])) {
                case 'getReward':
                    that.wnd.requestContentPost(that.controller, 'reward', {
                        mentee_id: parseInt(href[1], 10)
                    });
                    break;
                case 'accept':
                    type = $('form#invite_friend input:checked').val();
                    if (type === 'fixed_island') {
                        var selection = $('form#invite_friend select').val();
                        that.selectedSpot = that.spotData[selection];
                    }
                    that.acceptSpot(type, that.selectedSpot);
                    break;
                case 'send_invitation':
                    that.sendInvitation();
                    break;
                default:
                    return true;
            }
            return false;
        };
    }
    WndHandlerInviteFriends.inherits(window.WndHandlerDefault);

    WndHandlerInviteFriends.prototype.getDefaultWindowOptions = function() {
        return {
            height: 550,
            width: 800,
            resizable: false,
            minimizable: true,
            yOverflowHidden: true,
            title: _('Invite players')
        };
    };

    WndHandlerInviteFriends.prototype.onInit = function(title, UIopts, action) {
        var args = UIopts || {};
        args.player_town_id && (this.selectedSpot = args);
        if (!args.prevent_default_request) {
            var use_action = action || 'index';
            this.wnd.requestContentGet(this.controller, use_action, args);
            this.restoreWindow();
        }

        return true;
    };

    WndHandlerInviteFriends.prototype.registerComponents = function() {
        var context = this.wnd.getContext(),
            root = this.wnd.getJQElement(),
            l10n = DM.getl10n('invite_friends', 'invite_friends'),
            _self = this;

        CM.register(context, 'btn_invite_mail', root.find(".btn_invite_mail").button({
            caption: l10n.buttons.mail.caption,
            disabled: !Game.player_email_validated,
            state: !Game.player_email_validated,
            tooltips: [{
                    title: ''
                },
                {
                    title: l10n.buttons.mail.tooltips.disabled
                }
            ],
            icon: true,
            icon_position: 'left',
            icon_type: 'envelope'
        }).on("btn:click", function() {
            _self.inviteBy('mail');
        }));

        CM.register(context, 'btn_invite_url', root.find(".btn_invite_url").button({
            caption: l10n.buttons.url.caption,
            icon: true,
            icon_position: 'left',
            icon_type: 'url'
        }).on("btn:click", function() {
            _self.inviteBy('url');
        }));

        CM.register(context, 'btn_invite_banner', root.find(".btn_invite_banner").button({
            caption: l10n.buttons.banner.caption,
            icon: true,
            icon_position: 'left',
            icon_type: 'banner'
        }).on("btn:click", function() {
            _self.inviteByBanner();
        }));

        CM.register(context, 'btn_invite_facebook', root.find(".btn_invite_facebook").button({
            caption: l10n.buttons.facebook.caption,
            icon: true,
            icon_position: 'left',
            icon_type: 'facebook'
        }).on("btn:click", function() {
            _self.inviteBy('facebook');
        }));
    };

    WndHandlerInviteFriends.prototype.inviteByBanner = function() {
        var path = Game.invitation_path.src + '_banners';
        this.wnd.requestContentGet(this.controller, 'banners', {
            path: path
        });
    };

    WndHandlerInviteFriends.prototype.inviteBy = function(type) {
        this.inviteType = type;

        if (this.selectedSpot) {
            this.acceptSpot('fixed_spot', this.selectedSpot);
        } else {
            this.wnd.requestContentGet(this.controller, 'invite', null);
        }
    };

    WndHandlerInviteFriends.prototype.playerIsAbleToSendMails = function() {
        return true;
    };

    WndHandlerInviteFriends.prototype.onRcvData = function(data, controller, action) {
        var that = this,
            context = this.wnd.getContext(),
            mail_credentials = {},
            msg_too_long_err,
            cbx_agree_caption;

        this.restoreWindow();

        if (data.json) {
            if (data.json.clearSelection) {
                this.selectedSpot = null;
            }

            // set selected
            if (data.json.selectedSpot) {
                this.selectedSpot = data.json.selectedSpot;
            }
            // set other
            if (data.json.spotData) {
                this.spotData = data.json.spotData;
            }
        }
        this.wnd.setContent2(data.html);

        this.wnd.getJQElement().children('div.gpwindow_content').off().on("click", function(e) {
            return that.clickHandler(e);
        });

        if (this.wnd.getJQElement().find('#txt_invitee_email').length) {
            mail_credentials.invitee_email = this.wnd.getJQElement().find('#txt_invitee_email');
            mail_credentials.invitee_username = this.wnd.getJQElement().find('#txt_invitee_username');
            mail_credentials.real_invitor_name = this.wnd.getJQElement().find('#txt_real_invitor_name');
            mail_credentials.real_invitee_name = this.wnd.getJQElement().find('#txt_real_invitee_name');
            mail_credentials.message = this.wnd.getJQElement().find('#txta_message');
            mail_credentials.checkbox = this.wnd.getJQElement().find('#cbx_agree');
            msg_too_long_err = DM.getl10n('COMMON', 'error').msg_too_long;
            cbx_agree_caption = DM.getl10n('invite_friends', 'invite_friends').cbx_agree_caption;

            CM.register(context, 'txt_invitee_email', mail_credentials.invitee_email.textbox({
                value: mail_credentials.invitee_email.attr('value')
            }).removeAttr('value'));
            CM.register(context, 'txt_invitee_username', mail_credentials.invitee_username.textbox({
                value: mail_credentials.invitee_username.attr('value')
            }).removeAttr('value'));
            CM.register(context, 'txt_real_invitor_name', mail_credentials.real_invitor_name.textbox({
                value: mail_credentials.real_invitor_name.attr('value'),
                type: 'custom',
                live: true,
                regexp: /^.{0,40}$/,
                invalidmsg: msg_too_long_err.replace('%n', '40')
            }).removeAttr('value'));
            CM.register(context, 'txt_real_invitee_name', mail_credentials.real_invitee_name.textbox({
                value: mail_credentials.real_invitee_name.attr('value'),
                type: 'custom',
                live: true,
                regexp: /^.{0,40}$/,
                invalidmsg: msg_too_long_err.replace('%n', '40')
            }).removeAttr('value'));
            CM.register(context, 'txta_message', mail_credentials.message.textarea({
                value: mail_credentials.message.attr('value'),
                maxlength: 160,
                invalidmsg: msg_too_long_err.replace('%n', '160')
            }).removeAttr('value'));
            CM.register(context, 'cbx_agree', mail_credentials.checkbox.checkbox({
                caption: cbx_agree_caption,
                checked: true
            }));
        }

        this.registerComponents();

        $('div#invite_data select#isle_selector').on('focus', function() {
            $('div#invite_data input').prop('checked', false);
            $('div#invite_data input#fixed_island').prop('checked', true);
        });
    };

    WndHandlerInviteFriends.prototype.acceptSpot = function(selectionType, spot) {
        this.selectionType = selectionType;
        Game.invitation_path.selection_type = selectionType;
        var path = Game.invitation_path.src + '_' + Game.invitation_path.type + '_' + Game.invitation_path.selection_type;

        if (this.inviteType === 'facebook') {
            // Get the facebook invitation share url
            // Hybrid app will open this with built-in browser
            // Computer browser will open this via popup
            this.wnd.ajaxRequestGet(
                'invite_friends',
                'fbinvite', {
                    type: this.inviteType,
                    selection: this.selectionType,
                    path: path,
                    spot: spot
                },
                function(_wnd, data) {
                    if (!data || !data.facebook_share_url) {
                        return;
                    }

                    if (Game.isHybridApp()) {
                        MobileMessages.openExternalLink(data.facebook_share_url);
                    } else {
                        window.open(data.facebook_share_url,
                            'facebookInvite',
                            'toolbar=0,status=0,width=626,height=636');
                    }
                }
            );
        } else {
            // Display the result page
            this.wnd.requestContentGet(this.controller, 'get_credentials', {
                type: this.inviteType,
                spot: spot,
                selection: this.selectionType,
                path: path
            });
        }
    };

    /**
     * helper method to open the invite a friend window, or continue the selection process, if already open
     *
     * @param data the selected spot
     */
    WndHandlerInviteFriends.selectSpotOnMap = function(data) {
        var spot = {
            'x': data.ix,
            'y': data.iy,
            'player_town_id': data.player_town_id,
            'number_on_island': data.number_on_island
        };
        GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_INVITE_FRIENDS);

        GPWindowMgr.Create(
            GPWindowMgr.TYPE_INVITE_FRIENDS,
            _('Invite players'),
            spot
        );

        Game.invitation_path = {
            src: 'map'
        };
    };

    WndHandlerInviteFriends.prototype.sendInvitation = function() {
        var context = this.wnd.getContext(),

            email = CM.get(context, 'txt_invitee_email').getValue(),
            master = CM.get(context, 'txt_invitee_username').getValue(),
            invitor_name = CM.get(context, 'txt_real_invitor_name').getValue(),
            invitee_name = CM.get(context, 'txt_real_invitee_name').getValue(),
            message = CM.get(context, 'txta_message').getValue(),
            agree = CM.get(context, 'cbx_agree').isChecked(),
            that = this;

        var path = Game.invitation_path.src + '_' + Game.invitation_path.type + '_' + Game.invitation_path.selection_type + (email.length > 0 ? '_email' : '_name');

        this.wnd.requestContentPost(this.controller, 'send_invitation', {
            real_invitee_name: invitee_name,
            real_invitor_name: invitor_name,
            email: email,
            master: master,
            message: message,
            agree: agree,
            spot: this.selectedSpot,
            type: this.inviteType,
            selection: this.selectionType,
            path: path
        }, function() {
            that.wnd.close();
        });
    };

    /**
     * end the procedure for the auto selected spot
     */
    WndHandlerInviteFriends.prototype.restoreWindow = function() {
        if (this.originalWidth && this.originalPosition) {
            // make window smaller & move it to the left border
            this.wnd.setWidth(this.originalWidth);
            this.wnd.setPosition(this.originalPosition);

            this.originalWidth = null;
            this.originalPosition = null;
        }
    };

    WndHandlerInviteFriends.prototype.clearSelection = function() {
        this.selectedSpot = null;
    };

    WndHandlerInviteFriends.prototype.showBanner = function(banner_type) {
        banner_type = banner_type.toString(); // in IE7 this is a 1-element array
        if (!banner_type.match(/^\d{2,3}x\d{2,3}$/)) {
            HumanMessage.error(_('An internal error has occurred!'));
        } else {
            var market_id = InternalMarketsHelper.isInternalMarket(Game.market_id) ? 'en' : Game.market_id;
            var img_url = Game.img() + '/game/banners/' + market_id + '/' + banner_type + '.jpg';
            var dims = banner_type.split('x'),
                width = parseInt(dims[0], 10),
                height = parseInt(dims[1], 10),
                max_height = 250,
                input_width = 720;

            if (height > max_height) {
                var scale = max_height / height,
                    scaled_height = max_height,
                    scaled_width = width * scale;
                $('#resized').find('#height').html(height.toString());
                $('#resized').find('#width').html(width.toString());
                $('#resized').show();
            } else {
                $('#resized').hide();
            }

            var real_height = (height > max_height) ? scaled_height : height,
                real_width = (height > max_height) ? scaled_width : width;

            $('#banner_preview').attr('src', img_url).height(real_height).width(real_width);
            if (height > 125) {
                $('#banner_preview').css('float', 'left');
                $('#banner_info').css({
                    'float': 'left',
                    'margin-left': '20px'
                });
                input_width = input_width - real_width - 20;
            } else {
                $('#banner_preview').css('float', 'none');
                $('#banner_info').css({
                    'float': 'none',
                    'margin-left': '0'
                });
            }

            $('#banner_bbcode')
                .val('[url=' + this.referer.bbcode + '][img]' + img_url + '[/img][/url]')
                .width(input_width);
            $('#banner_html')
                .val('<a href="' + this.referer.html + '"><img src="' + img_url + '" alt="' + _('Grepolis banner') + '"></a>')
                .width(input_width);
        }
    };

    WndHandlerInviteFriends.prototype.setReferer = function(referer) {
        this.referer = referer;
    };

    window.WndHandlerInviteFriends = WndHandlerInviteFriends;

    GPWindowMgr.addWndType('INVITE_FRIENDS', null, WndHandlerInviteFriends, 1);
}());