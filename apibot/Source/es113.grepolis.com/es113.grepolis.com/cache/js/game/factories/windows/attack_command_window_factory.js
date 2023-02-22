/*globals GPWindowMgr */

window.AttackCommandWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Attack Command' window which displayes
         * details about the command
         */
        openAttackCommandWindow: function(title, command_id) {
            var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_ATK_COMMAND);

            if (!wnd) {
                return GPWindowMgr.Create(GPWindowMgr.TYPE_ATK_COMMAND, title, {}, command_id);
            } else {
                wnd.requestContentGet('command_info', 'info', {
                    command_id: command_id
                });

                return wnd.setTitle(title);
            }
        }
    };
}());