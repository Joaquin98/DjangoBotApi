/* global WM */
(function() {
    'use strict';

    //GPWindowMgr.getAllOpen()
    function CloseWindowManager(open_windows_mgr, open_windows_mgr_old) {
        this.open_windows_mgr = open_windows_mgr;
        this.open_windows_mgr_old = open_windows_mgr_old;
    }

    CloseWindowManager.prototype.getSortedOpenedWindows = function() {
        var new_windows = this.open_windows_mgr.getOpenedWindows(),
            old_windows = this.open_windows_mgr_old.getOpenedWindows();

        var window, sorted = [],
            windows = [].concat(new_windows, old_windows),
            i, l = windows.length;

        for (i = 0; i < l; i++) {
            window = windows[i];

            //Take only closable windows and not minimized
            if (window.isClosable() && !window.isMinimized()) {
                sorted.push(window);
            }
        }

        return sorted.sort(function(a, b) {
            return a.getZIndex() - b.getZIndex();
        });
    };

    /**
     * Closes window which is on the top of the window stack, it does not matter
     * if its old or new one
     */
    CloseWindowManager.prototype.closeFrontWindow = function() {
        var windows = this.getSortedOpenedWindows(),
            window = windows.pop(),
            is_old_window = window && !window.cid; // gpwindow

        //If there is any window, close it
        if (window && is_old_window) {
            window.close();
        } else {
            WM.closeWindow(window, {
                manual_close: true
            });
        }
    };

    window.CloseWindowManager = CloseWindowManager;
}());