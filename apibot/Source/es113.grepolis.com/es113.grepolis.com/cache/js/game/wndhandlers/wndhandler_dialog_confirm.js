/* globals gpAjax, Layout, GameData, GPWindowMgr */

(function() {
    'use strict';

    /**
     * window handler for confirmation windows.
     */
    function WndHandlerConfirmDialog(wndhandle) {
        this.wnd = wndhandle;
        var that = this,
            checked = false,
            f;

        this.clickHandler = function(e) {
            var target = e.target.tagName === 'A' ? $(e.target) : $(e.target).closest('a.button'),
                href = (target.attr('href') || '').split(/#/).reverse()[0];

            switch (href) {
                case 'confirm':
                    that.executeCallback('confirm');
                    that.wnd.close();
                    break;
                case 'cancel':
                    that.executeCallback('cancel');
                    that.wnd.close();
                    break;
                case 'checkbox':
                    that.executeCallback('check');
                    target.toggleClass('checked', (checked = !checked));
                    gpAjax.ajaxPost('player', 'toggle_confirmation_popups', {
                        'show': checked ? '0' : '1'
                    }, true, function() {
                        Layout.show_confirmation_popup = !checked;
                    });
                    break;
                case 'player_hint_checkbox':
                    that.executeCallback('check');
                    target.toggleClass('checked', (checked = !checked));
                    break;
            }
        };

        /**
         * Sets (overwrites) all callback functions.
         * @param _f Object {confirm: function, cancel: function, check: function}
         */
        this.setCallback = function(_f) {
            f = _f;
        };

        /**
         * Executes a callback function.
         * @param type String
         */
        this.executeCallback = function(type) {
            if (f[type] && typeof f[type] === 'function') {
                f[type]();
            }
        };
    }

    WndHandlerConfirmDialog.inherits(window.WndHandlerDefault);

    WndHandlerConfirmDialog.prototype.getDefaultWindowOptions = function() {
        return {
            width: 400,
            autoresize: true
        };
    };

    /**
     *
     * @param data Object
     *		{
     *			callback: {confirm: function, cancel: function, check: function},
     *			texts: {confirm: String, cancel: String, check: String, content: String}
     *		}
     */
    WndHandlerConfirmDialog.prototype.onRcvData = function(data) {
        var that = this,
            callback = data.callback || {};

        // onclick?
        if (typeof callback.confirm === String) {
            data.texts.onConfirm = callback.confirm;
        } else {
            data.texts.onConfirm = false;
        }

        data.texts.use_player_hint = false;
        if (data.use_player_hint) {
            data.texts.use_player_hint = true;
        }

        // set callback functions
        this.setCallback({
            'confirm': callback.confirm,
            'cancel': callback.cancel,
            'check': callback.check
        });

        // set html
        if (GameData.ConfirmDialogTemplate) {
            this.wnd.setContent(us.template(GameData.ConfirmDialogTemplate, data.texts));
            // bind click handler
            this.wnd.getJQElement().on("click", that.clickHandler);
        }
        //(template is not loaded for the full-screen forum)
        else {
            Layout.showAjaxLoader();
            gpAjax.ajaxGet('alliance_forum', 'confirm_window_template', {}, false, function(resp) {
                GameData.add({
                    'ConfirmDialogTemplate': resp.html
                });
                that.wnd.setContent(us.template(resp.html, data.texts));
                // bind click handler
                that.wnd.getJQElement().on("click", that.clickHandler);
                Layout.hideAjaxLoader();
            });
        }
    };

    WndHandlerConfirmDialog.prototype.onClose = function() {
        this.executeCallback('cancel');
        return true;
    };

    GPWindowMgr.addWndType('CONFIRM_DIALOG', null, WndHandlerConfirmDialog, 1, true);
}());