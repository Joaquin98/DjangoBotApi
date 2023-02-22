/*globals gpAjax, GPWindowMgr, WF */

window.NotesWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Notes' window
         */
        openOldNotesWindow: function() {
            gpAjax.ajaxGet('player_memo', 'load_memo_content', {}, false, function(data) {
                var wnd_memo = GPWindowMgr.Create(GPWindowMgr.TYPE_MEMO, '', {
                    data: data
                });

                if (wnd_memo) {
                    wnd_memo.sendMessage('setData', data);
                }
            });
        },

        openNotesWindow: function() {
            return WF.open('notes');
        }
    };
}());