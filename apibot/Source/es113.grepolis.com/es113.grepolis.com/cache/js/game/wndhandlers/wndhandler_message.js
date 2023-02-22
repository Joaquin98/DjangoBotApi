/* globals Layout, Message, BBCode, MousePopup, GPWindowMgr, gpAjax, GrepoNotificationStack, NotificationType, MM,
GameDataPremium, Game */

(function() {
    'use strict';

    function WndHandlerMessage(wndhandle) {
        this.wnd = wndhandle;
        this.recipients = null;
        this.bbcode = null;
        this.last_folder_id = 0;
        this.last_messages_ids = null;

        this.action = "index";
        //Used for workaround for the confirmation box for close button
        this.force_close = false;
    }
    WndHandlerMessage.inherits(window.AbstractWndHandlerEmailValidation);

    WndHandlerMessage.prototype.getDefaultWindowOptions = function() {
        return {
            height: 570,
            width: 800,
            resizable: false,
            minimizable: true,
            title: _('Messages')
        };
    };

    WndHandlerMessage.prototype.onBeforeTabSwitch = function(switchTabFn) {
        return this.preventLosingData('switch', switchTabFn);
    };

    WndHandlerMessage.prototype.onClose = function() {
        return this.preventLosingData('close');
    };

    WndHandlerMessage.prototype.preventLosingData = function(type, fn) {
        //Check if are there some unsaved messages
        var action = this.action,
            textarea = (action === "new" ? $('#message_new_message') : $("#message_reply_message")),
            that = this;

        if ($("#message_report_affront_dialog").css("display") === "block") {
            textarea = $("#message_report_affront");
        }

        if ((action === "new" || action === "view") && textarea.length && textarea.val().length > 0 && !that.force_close) {
            Layout.showConfirmDialog(
                _('Close window'),
                _('Do you really want to close this window? The unsaved text will be lost.'),
                function() {
                    that.force_close = true;
                    // replace the set data with null
                    that.setMessageData({
                        recipients: null,
                        subject: null,
                        body: null
                    });

                    if (type === 'close') {
                        that.wnd.close();
                    } else if (type !== 'close' && typeof fn === "function") {
                        fn();
                    }
                }
            );
            return false;
        } else {
            if (type === 'messageView') {
                fn();
            }
        }

        return true;
    };

    /**
     * Window Initialitation
     *
     * Parameters:
     *  title   => window title
     *  UIopts  => Jquery UI Options for the window
     *  variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * Returns:
     *  boolean, false would abort window creation.
     **/
    WndHandlerMessage.prototype.onInit = function(title, UIopts, action, data, id) {
        var params = {};
        this.setMessageData(data);

        if (!action) {
            action = 'default';
        }
        if (id !== undefined) {
            params = {
                id: id
            };
        }
        this.wnd.requestContentGet('message', action, params);
        return true;
    };

    WndHandlerMessage.prototype.setMessageData = function(data) {
        if (!data) {
            return;
        }

        this.recipients = data.recipients || null;
        this.subject = data.subject || null;
        this.body = data.message || null;
    };

    WndHandlerMessage.prototype.onRcvData = function(data, controller, action) {
        var html = document.createElement('div'),
            wrapper;
        html.innerHTML = data.html;
        wrapper = $(html).find('div.bb_button_wrapper');

        this.wnd.clearMenu();
        this.wnd.setContent2(html);

        this.action = action;

        switch (action) {
            case 'forward':
                this.bbcode = new BBCode(this.wnd, wrapper, '#message_message');
                break;
            case 'new':
                this.bbcode = new BBCode(this.wnd, wrapper, '#message_new_message');
                break;
            case 'view':
                this.bbcode = new BBCode(this.wnd, wrapper, '#message_reply_message');
                $('#message-index').addClass('active');
                $('.tooltip-button').each(function() {
                    var $el = $(this),
                        title = $el.attr('title'),
                        popup = new MousePopup(title);

                    $el.mousePopup(popup);
                    $el.removeAttr('title');
                });
                break;
            case 'create':
                break;
        }

        if (data.has_new_announcements) {
            $('#announcement_list .announcement_content:first').show();
        }

        this.setMessageDataToHtml();

        //Initiate drag and drop (I had to move it to message.js file, because 'we'
        //reload entire content of the message window, and d&d have to be reinitiated..)
        if ((action == "index" || action == "move" || action == "delete" || action == "create" || action == 'reply' || action == 'send_forward') && GameDataPremium.hasCurator()) {
            if (action == "move") {
                Message.toggleMenu();
            }

            Message.initiateDragAndDrop();
        }

        var additional_descriptive_text = this.wnd.getJQElement().find('div.player_settings h4.additional_descriptive_text');
        if ((action == "new" || action == "resend_validation_email") && additional_descriptive_text.length) {
            additional_descriptive_text.html(_('You have to activate your email to send messages!'));
            additional_descriptive_text.show();
        }

        var player_report_status = MM.checkAndPublishRawModel('PlayerReportStatus', {
            id: Game.player_id
        });
        var has_new_announcements = player_report_status.hasNewAnnouncements();

        if (has_new_announcements) {
            this.hightlightAnnouncementTab();
        } else {
            this.unsetAnnouncementTab();
        }

        if (action == "new") {
            Message.registerEvents();
        }
    };

    WndHandlerMessage.prototype.messageNew = function(data) {
        this.setMessageData(data);
        this.wnd.requestContentGet('message', 'new', {});
    };


    WndHandlerMessage.prototype.messageView = function(message_id, action) {
        var _self = this;

        return this.preventLosingData('messageView', function() {
            GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.NEWMESSAGE, message_id);
            GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.AWMESSAGE, message_id);

            _self.wnd.requestContentGet('message', action, {
                id: message_id
            });
        });
    };

    WndHandlerMessage.prototype.messageForward = function(message_id) {
        this.wnd.requestContentGet('message', 'forward', {
            id: message_id
        });
    };

    WndHandlerMessage.prototype.messageDeleteOne = function(message_id, action) {
        GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.NEWMESSAGE, message_id);
        GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.AWMESSAGE, message_id);

        this.wnd.requestContentPost('message', action, {
            id: message_id
        });
    };

    WndHandlerMessage.prototype.messageChangeFolder = function(folder_id) {
        this.last_folder_id = folder_id;
        this.wnd.requestContentGet('message', 'index', {
            es_args: folder_id
        });
    };

    WndHandlerMessage.prototype.messageFilter = function(folder_id, status) {
        this.wnd.requestContentGet('message', 'index', {
            folder_id: folder_id,
            status: status
        });
    };

    WndHandlerMessage.prototype.messageMarkAsReadMany = function(form_id) {
        var params = {};
        params.message_ids = [];
        $('#' + form_id + ' input:checkbox:checked').each(function() {
            //Check if we have a valid numeric id
            if (parseInt(this.value, 10) > 0) {
                params.message_ids.push(this.value);
            }
        });
        this.wnd.requestContentPost('message', 'mark_as_read_many', params, function() {
            params.message_ids.forEach(function(id) {
                GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.NEWMESSAGE, id);
                GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.AWMESSAGE, id);
            });
        });
    };

    WndHandlerMessage.prototype.messageFolderAsRead = function(form_id) {
        var folder_id = this.last_folder_id;

        this.wnd.requestContentPost('message', 'mark_folder_as_read', {
            folder_id: folder_id
        });
    };

    WndHandlerMessage.prototype.setMessageDataToHtml = function() {
        var that = this;

        if (this.recipients) {
            that.wnd.getJQElement().find('#message_recipients').val(this.recipients);
        }
        if (this.subject) {
            that.wnd.getJQElement().find('#message_subject').val(this.subject);
        }
        if (this.body) {
            that.wnd.getJQElement().find('#message_new_message').val(this.body);
        }
    };

    WndHandlerMessage.prototype.submitForm = function(form_id, action) {
        var params = {},
            actions = ['delete', 'delete_massmail'];

        if (actions.indexOf(action) !== -1) {
            params.message_ids = [];
            $('#' + form_id + ' input:checkbox:checked').each(function() {
                var value = parseInt(this.value, 10);
                if (value > 0) {
                    params.message_ids.push(value);

                    GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.NEWMESSAGE, value, true);
                    GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.AWMESSAGE, value, true);
                }
            });
        } else if (action === 'delete_all_of_folder') {
            $('#' + form_id + ' input:checkbox').each(function(idx, el) {
                var $el = $(el),
                    value = $el.attr('value');

                if (value > 0) {
                    GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.NEWMESSAGE, value, true);
                    GrepoNotificationStack.deleteByTypeAndParamID(NotificationType.AWMESSAGE, value, true);
                }
            });
            $('#' + form_id + ' input').each(function() {
                params[this.name] = this.value;
            });
        } else {
            $('#' + form_id + ' input').each(function() {
                params[this.name] = this.value;
            });
            $('#' + form_id + ' textarea').each(function() {
                params[this.name] = this.value;
            });
        }
        this.wnd.requestContentPost('message', action, params);
    };

    WndHandlerMessage.prototype.messageMove = function(form_id, folder_id, last_folder_id) {
        var params = {
            folder_id: folder_id,
            message_ids: []
        };

        if (typeof last_folder_id != 'undefined') {
            params.last_folder_id = last_folder_id;
        }

        $('#' + form_id + ' input:checkbox:checked').each(function() {
            params.message_ids.push(this.value);
        });

        this.wnd.requestContentPost('message', 'move', params);
    };

    WndHandlerMessage.prototype.messageMoveOne = function(message_id, folder_id) {
        gpAjax.ajaxPost('message', 'move_message', {
            message_id: message_id,
            folder_id: folder_id
        }, true, function() {});
    };

    WndHandlerMessage.prototype.messageDoReportAffront = function(message_id) {
        var params = {
            message_id: message_id,
            post_id: Message.post_id,
            reason: $('#message_report_affront_dialog textarea').val()
        };

        gpAjax.ajaxPost('message', 'reportAffront', params, true, function(data) {
            if (data.success) {
                Message.closeReportAffrontDialog();
            }
        });
    };

    WndHandlerMessage.prototype.messagePreview = function(part) {
        var params = {
            message: $('#message_' + part + '_message').val()
        };

        gpAjax.ajaxPost('message', 'preview', params, true, function(data) {
            $('#message_' + part + '_preview_body').html(data.message);
            $('#message_' + part + '_create').hide();
            $('#message_' + part + '_preview').show();
        });
        Message.registerEvents();
    };

    WndHandlerMessage.prototype.validateEmail = function() {
        var that = this;
        var params = {};
        params.code = that.wnd.getJQElement().find('#validate_form [name=code]').val();

        this.wnd.ajaxRequestPost('player', 'validate_email', params, function(window, data) {
            that.wnd.requestContentGet('message', 'new', {});
        });
    };

    WndHandlerMessage.prototype.hightlightAnnouncementTab = function() {
        var tab = $('#message-announcements.unread');

        if (tab.length == 0) {
            $('#message-announcements').addClass('unread');
        }
    };

    WndHandlerMessage.prototype.unsetAnnouncementTab = function() {
        var tab = $('#message-announcements.unread');

        if (tab.length > 0) {
            tab.removeClass('unread');
        }
    };

    GPWindowMgr.addWndType('MESSAGE', 'link_messages', WndHandlerMessage, 1);
}());