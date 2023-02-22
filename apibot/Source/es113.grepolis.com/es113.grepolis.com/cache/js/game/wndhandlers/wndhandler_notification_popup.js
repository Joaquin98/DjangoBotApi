/* global GPWindowMgr */

(function() {
    'use strict';

    function WndHandlerNotificationPopup(wndhandle) {
        this.wnd = wndhandle;
        this.onCloseFunction = null;
    }

    WndHandlerNotificationPopup.inherits(window.WndHandlerDefault);

    WndHandlerNotificationPopup.prototype.getDefaultWindowOptions = function() {
        return {
            height: 220,
            width: 400,
            resizable: false,
            autoresize: true,
            title: _('Info')
        };
    };

    WndHandlerNotificationPopup.prototype.onInit = function(title, options) {
        this.wnd.setContent(options.html);

        if (options && typeof options.onClose === 'function') {
            this.onCloseFunction = options.onClose;
        }
        return true;
    };

    WndHandlerNotificationPopup.prototype.onRcvData = function(data, controller, action) {

    };

    WndHandlerNotificationPopup.prototype.onMessage = function() {

    };

    WndHandlerNotificationPopup.prototype.onClose = function() {
        if (typeof this.onCloseFunction === 'function') {
            return this.onCloseFunction();
        }

        return true;
    };

    GPWindowMgr.addWndType('NOTIFICATION_POPUP', null, WndHandlerNotificationPopup, 0, true);
}());