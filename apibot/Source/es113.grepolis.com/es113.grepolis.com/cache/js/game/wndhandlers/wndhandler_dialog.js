/* global GPWindowMgr */

(function() {
    'use strict';

    function WndHandlerDialog(wndhandle) {
        this.wnd = wndhandle;
        this.onCloseFunction = null;
    }

    WndHandlerDialog.inherits(window.WndHandlerDefault);

    WndHandlerDialog.prototype.getDefaultWindowOptions = function() {
        return {
            //height: 'auto',
            width: 400,
            resizable: true,
            autoresize: true,
            title: '',
            yOverflowHidden: true
        };
    };

    WndHandlerDialog.prototype.onInit = function(title, options) {
        if (options && typeof options.onClose === 'function') {
            this.onCloseFunction = options.onClose;
        }
        return true;
    };

    WndHandlerDialog.prototype.onRcvData = function(data, controller, action) {
        this.wnd.setContent(data.html);
    };

    WndHandlerDialog.prototype.onMessage = function() {
        return null;
    };

    WndHandlerDialog.prototype.onClose = function() {
        if (typeof this.onCloseFunction === 'function') {
            return this.onCloseFunction();
        }

        return true;
    };

    GPWindowMgr.addWndType('DIALOG', null, WndHandlerDialog, 0, true);
}());