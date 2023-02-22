/*globals GPWindowMgr */

window.ColonizationCommandWindowFactory = (function() {
    'use strict';

    return {
        openColonizationCommandWindow: function(title, command_id) {
            var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_COLONIZATION_COMMAND);

            if (!wnd) {
                return GPWindowMgr.Create(GPWindowMgr.TYPE_COLONIZATION_COMMAND, title, {}, command_id);
            } else {
                wnd.requestContentGet('command_info', 'colonization_info', {
                    'command_id': command_id
                });

                return wnd.setTitle(title);
            }
        }
    };
}());