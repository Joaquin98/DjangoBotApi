/* global AbstractWndHandlerEmailValidation, Forum, BBCode, Layout, GPWindowMgr, Game */

(function() {
    'use strict';

    function WndHandlerAllianceForum(wndhandle) {
        this.currentTownID = -1;
        this.wnd = wndhandle;

        this.action = 'forum';
        //Used for workaround for the confirmation box for close button
        this.force_close = false;
    }
    WndHandlerAllianceForum.inherits(AbstractWndHandlerEmailValidation);

    WndHandlerAllianceForum.prototype.getDefaultWindowOptions = function() {
        return {
            maxHeight: 520,
            maxWidth: 780,
            height: 520,
            width: 780,
            resizable: false,
            minimizable: true,
            menuScroll: true,
            title: _('Alliance forum')
        };
    };

    /**
     * Window Initialization
     *
     * @param title String => window title
     * @param UIopts Object => Jquery UI Options for the window
     * variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerAllianceForum.prototype.onInit = function(title, UIopts) {
        this.wnd.sendMessage('openIndex', {}, function() {
            Forum.displayData();
        });
        $('#new_post.new_post').toggleClass('new_post no_new_post');
        //TODO: remove after A/B-test
        $('#link_alliance_forum').removeClass('new_post');
        return true;
    };

    WndHandlerAllianceForum.prototype.onBeforeTabSwitch = function(switchTabFn) {
        return this.preventLosingData('switch', switchTabFn);
    };

    WndHandlerAllianceForum.prototype.onClose = function() {
        return this.preventLosingData('close');
    };

    WndHandlerAllianceForum.prototype.preventLosingData = function(type, fn) {
        //Check if are there some unsaved messages
        var action = this.action,
            textarea = $('#forum_post_textarea'),
            that = this;

        if (action === 'forum' && textarea.length && textarea.val().length > 0 && !that.force_close) {
            Layout.showConfirmDialog(
                _('Close window'),
                _('Do you really want to close this window? The unsaved text will be lost.'),
                function() {
                    that.force_close = true;

                    if (type === 'close') {
                        that.wnd.close();
                    } else if (type === 'switch') {
                        fn();
                    }
                }
            );
            return false;
        } else {
            return true;
        }
    };

    WndHandlerAllianceForum.prototype.onRcvData = function(data, controller, action) {
        this.action = action;

        if (data.html) {
            var html = this.getTransformedHtml(data.html);
            this.wnd.setContent2(html);
            this.initializeBBCodes();

            Forum.initialize();
        }
    };

    WndHandlerAllianceForum.prototype.onSetContent = function(html) {
        return this.getTransformedHtml(html);
    };

    WndHandlerAllianceForum.prototype.parentOnMessage = WndHandlerAllianceForum.prototype.onMessage;
    WndHandlerAllianceForum.prototype.onMessage = function(type, data, callback) {
        var threads_per_page = Forum.getThreadsPerPage();
        var base_params = (threads_per_page !== undefined) ? {
            threads_per_page: threads_per_page
        } : {};
        base_params.type = type;
        base_params.separate = Forum.flag_separate_forum_tab;

        if (type === 'openIndex') {
            this.wnd.clearMenu();
            this.wnd.requestContentPost('alliance_forum', 'forum', base_params, callback);
        } else if (type === 'go') {
            this.wnd.clearMenu();
            this.wnd.requestContentPost('alliance_forum', 'forum', $.extend(base_params, data), callback);
        } else if (type === 'switchForum') {
            Forum.switchForum(data);
        } else {
            return this.parentOnMessage.apply(this, (arguments));
        }

    };

    WndHandlerAllianceForum.prototype.getTransformedHtml = function(html) {
        var transformed_html = '<div id="content" class="forum_content">' + html + '<script type="text/javascript">$.Observer(GameEvents.forum.content_set).publish({});</script></div>';

        if (!Game.isHybridApp()) {
            transformed_html += '<a href="/forum" target="_blank" class="separate_forum_tab_link">' + _('Maximize') + '</a>';
        }
        return transformed_html;
    };

    WndHandlerAllianceForum.prototype.initializeBBCodes = function() {
        var wrapper = this.wnd.getJQElement().find('div.bb_button_wrapper');
        this.bbcode = new BBCode(this.wnd, wrapper, '#forum_post_textarea');
    };

    WndHandlerAllianceForum.prototype.validateEmail = function() {
        var that = this;
        var params = {};
        params.code = that.wnd.getJQElement().find('#validate_form [name=code]').val();

        this.wnd.ajaxRequestPost('player', 'validate_email', params, function(window, data) {
            that.wnd.sendMessage('openIndex');
        });
    };

    GPWindowMgr.addWndType('ALLIANCE_FORUM', 'link_alliance_forum', WndHandlerAllianceForum, 1);

}());