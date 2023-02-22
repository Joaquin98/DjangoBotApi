/*global WndHandlerDefault */
(function() {
    "use strict";

    var MIN_ZINDEX = 1000,
        MAX_ZINDEX = 1999;

    /**
     * Manages which focusing windows
     *
     * @param {WindowManagerCollections.WindowsCollection} open_windows_mgr
     * @param {GPWindowMgr} open_windows_mgr_old
     *
     * @constructor
     */
    function FocusWindowManager(open_windows_mgr, open_windows_mgr_old) {
        //Zindex which is used to bringing window to the front
        this.curr_zindex = MIN_ZINDEX;

        this.open_windows_mgr = open_windows_mgr;
        this.open_windows_mgr_old = open_windows_mgr_old;
    }

    /**
     * Sets current zIndex
     *
     * @param {Integer} value
     */
    FocusWindowManager.prototype.setCurrentZIndex = function(value) {
        this.curr_zindex = value;
    };

    /**
     * Returns all opened windows old and new ones
     *
     * @return {Array}
     */
    FocusWindowManager.prototype._getOpenedWindows = function() {
        return [].concat(this.open_windows_mgr_old.getOpenedWindows(), this.open_windows_mgr.getOpenedWindows());
    };

    /**
     * Returns zIndex for the window which should be focused
     *
     * @return {Number}
     * @private
     */
    FocusWindowManager.prototype._getNextZIndex = function() {
        return this.curr_zindex + 1;
    };

    /**
     * Workaround to re-order the windows once we are at the limit of the z-index
     *
     * @private
     */
    FocusWindowManager.prototype._reassignZIndex = function() {
        var opened_windows = this._getOpenedWindows();
        opened_windows.sort(function(window_a, window_b) {
            return window_a.getZIndex() - window_b.getZIndex();
        }).forEach(function(window, idx) {
            window.setZIndex(MIN_ZINDEX + idx);
        });

        this.setCurrentZIndex(MIN_ZINDEX + opened_windows.length);
    };

    /**
     * Gives focus to the window (handles old and new windows)
     *
     * @param {WindowManagerModels.WindowModel|WndHandlerDefault} wnd
     */
    FocusWindowManager.prototype.focus = function(wnd) {
        //Handle old windows in some acceptable way
        if (wnd instanceof WndHandlerDefault) {
            wnd = wnd.wnd;
        }

        var _self = this,
            new_z_index = this._getNextZIndex(),
            opened_windows = this._getOpenedWindows();

        var identifier = wnd.getIdentifier();

        // hack to cap maximum z-index usage of windows.
        // if we would not reset the z-indexes, at some point they would become >= 2000 and overlap
        // other UI stuff
        // Here I reset the z-index to 1000 whenever there is only 1 window
        if (opened_windows.length === 1) {
            this.setCurrentZIndex(1000);
            new_z_index = this._getNextZIndex();
        }

        //Loop trough all opened windows
        us.each(opened_windows, function(window_obj) {
            var to_focus = window_obj.getIdentifier() === identifier;

            //There is special case when 'Modal' windows should be always over everything, even UI elements
            //That's why we are putting them out or normal way of applying z-index, and we are using 'is_modal_window' css class to set it fixed
            if (!window_obj.isModal()) {
                if (window_obj.getFocus() !== to_focus) {
                    //Update focus for each window
                    window_obj.setFocus(to_focus);
                }

                if (to_focus) {
                    window_obj.setZIndex(new_z_index);
                    _self.setCurrentZIndex(new_z_index);
                }
            }
        });

        if (new_z_index >= MAX_ZINDEX) {
            this._reassignZIndex();
        }
    };

    window.FocusWindowManager = FocusWindowManager;
}());