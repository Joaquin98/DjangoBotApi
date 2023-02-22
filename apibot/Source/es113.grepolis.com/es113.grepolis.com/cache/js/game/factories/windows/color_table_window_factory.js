/*globals GPWindowMgr, DM */

window.ColorTableWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens Color-Table window
         */
        openColorTableWindow: function() {
            var l10n = DM.getl10n('COMMON');

            return GPWindowMgr.Create(GPWindowMgr.TYPE_COLOR_TABLE, l10n.wnd_color_table.wnd_title, {});
        }
    };
}());