/* global GPWindowMgr */
(function() {
    'use strict';

    function WndHandlerColorTable(wndhandle) {
        this.wnd = wndhandle;
    }

    WndHandlerColorTable.inherits(window.WndHandlerDefault);

    WndHandlerColorTable.prototype.getDefaultWindowOptions = function() {
        return {
            height: 380,
            width: 490,
            yOverflowHidden: true
        };
    };

    WndHandlerColorTable.prototype.onInit = function() {
        this.wnd.requestContentGet('map_data', 'get_custom_colors', {});
        return true;
    };

    WndHandlerColorTable.prototype.onRcvData = function(data) {
        if (data.list_html) {
            this.wnd.setContent2(data.list_html);
        }
    };

    GPWindowMgr.addWndType('COLOR_TABLE', null, WndHandlerColorTable, 1);
}());