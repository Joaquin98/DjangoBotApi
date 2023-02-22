/*globals us, GameEvents, OnGameLoadWindow, WF */

(function() {
    'use strict';

    /**
     * Manages all windows which are opened on the game start
     *
     * @constructor
     */
    function WindowsQueueManager() {
        var priorities = require('game/windows/priorities');

        /**
         * @todo maybe use strategy instead of if else ?
         */
        this.SINGLE_WINDOW_MODE = true;
        this.highest_priority = priorities.getPriority('highest');

        //Keeps queued windows
        this.queue = [];
        this.event_listener_class = 'windows_queue';

        //Used in the single window mode
        this.last_opened_window = null;

        this.queueing_disabled = false;

        // flag keeping track if new windows can be created
        this.window_creation_play_state_active = true;
        //Stores windows during 'pause'
        this._window_pause_queue = [];
    }

    WindowsQueueManager.prototype.getQueue = function() {
        return this.queue;
    };

    WindowsQueueManager.prototype.getLastOpenedWindow = function() {
        return this.last_opened_window;
    };

    WindowsQueueManager.prototype.setLastOpenedWindow = function(wnd) {
        this.last_opened_window = wnd;
    };

    /**
     * Initializes events that module is listening on
     */
    WindowsQueueManager.prototype.initializeEventsListeners = function() {
        //Listen on window close event to know when to open another window
        $.Observer(GameEvents.window.close).subscribe(this.event_listener_class, function(e, data) {
            this._checkClosedWindow(data.window_obj);
        }.bind(this));

        //Listen on window minimize event to know when to open another window
        $.Observer(GameEvents.window.minimize).subscribe(this.event_listener_class, function(e, data) {
            this._checkMinimizedWindow(data.window_obj);
        }.bind(this));
    };

    /**
     * Determines whether 'single window mode' is enabled
     *
     * @return {Boolean}
     */
    WindowsQueueManager.prototype.isSingleWindowMode = function() {
        return this.SINGLE_WINDOW_MODE === true;
    };

    /**
     * Determines whether there is any window in the queue which should be displayed
     *
     * @return {Boolean}
     */
    WindowsQueueManager.prototype.hasAnyWindowInTheQueue = function() {
        return this.getQueue().length > 0;
    };

    WindowsQueueManager.prototype.isWindowInTheQueue = function(wnd) {
        var queue = this.getQueue();

        for (var i = 0, l = queue.length; i < l; i++) {
            if (queue[i].getType() === wnd.getType()) {
                return true;
            }
        }

        return false;
    };

    WindowsQueueManager.prototype._replaceWindowInQueueOfTheSameType = function(wnd) {
        var queue = this.getQueue();

        for (var i = 0, l = queue.length; i < l; i++) {
            if (queue[i].getType() === wnd.getType()) {
                queue[i] = wnd;
                return wnd;
            }
        }

        return false;
    };

    /**
     * Returns window which is next to open
     *
     * @return {OnGameLoadWindow}
     */
    WindowsQueueManager.prototype.getNextQueuedWindow = function() {
        var priority_method = this.isSingleWindowMode() ? 'max' : 'min';

        //Get window with the highest priority
        return us[priority_method](this.getQueue(), function(wnd) {
            return wnd.getPriority();
        });
    };

    /**
     * Removes window from queue
     *
     * @param {OnGameLoadWindow} wnd
     */
    WindowsQueueManager.prototype.removeWindowFromQueue = function(wnd) {
        //Find position in the array where it was placed
        var position = us.indexOf(this.getQueue(), wnd);

        //Remove it from the array
        this.queue.splice(position, 1);
    };

    /**
     * Opens next window to open
     */
    WindowsQueueManager.prototype.openWindow = function(window_to_open) {
        if (!(window_to_open instanceof OnGameLoadWindow)) {
            return;
        }

        this.removeWindowFromQueue(window_to_open);
        this.setLastOpenedWindow(window_to_open);

        window_to_open.open();
    };

    /**
     * Open next window in Queue, if the system is in 'paused' state, the call is saved and executed later
     */
    WindowsQueueManager.prototype.openNextWindow = function() {
        if (this.window_creation_play_state_active) {
            this.openWindow(this.getNextQueuedWindow());
        } else {
            this._window_pause_queue.push(this.getNextQueuedWindow());
        }
    };

    /**
     * Checks closed window (windows from entire game) against conditions and determines whether react on this action or
     * not
     *
     * @param {Object} closed_wnd
     */
    WindowsQueueManager.prototype._checkClosedWindow = function(closed_wnd) {
        var last_opened_window = this.getLastOpenedWindow();

        if (this.isSingleWindowMode() && last_opened_window && (last_opened_window.window_obj === closed_wnd || last_opened_window.window_obj === closed_wnd.wnd) && last_opened_window.isReadyToRemove()) {
            this.openNextWindow();
        }
    };

    WindowsQueueManager.prototype._checkMinimizedWindow = function(minimized_wnd) {
        var last_opened_window = this.getLastOpenedWindow();

        if (this.isSingleWindowMode() && last_opened_window && (last_opened_window.window_obj === minimized_wnd || last_opened_window.window_obj === minimized_wnd.wnd) && last_opened_window.isReadyToRemove()) {
            this.openNextWindow();
        }
    };

    /**
     * Windows like 'conquest' should not be queued because they should be displayed to user immediately. That's why we have to sort out all
     * this kind of windows and additionally one window which should be queued and display them at the beginning in the correct order.
     */
    WindowsQueueManager.prototype.initializeOpeningWindows = function() {
        var _self = this,
            wnd, windows_queue = [].concat(this.getQueue()),
            i, l = windows_queue.length,
            queued_window_found = false;
        var virtual_queue = [];

        //I placed it here to keep it together
        function openNotQueuedWindows(windows_queue) {
            var wnd, l = windows_queue.length;

            while (l--) {
                wnd = windows_queue[l];

                if (wnd.isQueued()) {
                    _self.openWindow(wnd);
                } else {
                    wnd.open();
                    _self.removeWindowFromQueue(wnd);
                }
            }
        }

        //Sort windows DESC (higher priority first)
        windows_queue.sort(function(a, b) {
            return a.getPriority() < b.getPriority();
        });

        for (i = 0; i < l; i++) {
            wnd = windows_queue[i];

            //Find all windows which are not queued and max one which is queued
            if (wnd.isQueued() && !queued_window_found) {
                virtual_queue.push(wnd);

                queued_window_found = true;
            } else if (!wnd.isQueued()) {
                virtual_queue.push(wnd);
            }
        }

        openNotQueuedWindows(virtual_queue);
    };

    /**
     * Returns information whether script can continue opening next windows
     *
     * @return {Boolean}
     */
    WindowsQueueManager.prototype.canProceedWithOpeningWindows = function() {
        if (!this.hasAnyWindowInTheQueue()) {
            return false;
        }

        if (this.isSingleWindowMode() && this.isWindowOpened()) {
            return false;
        }

        return true;
    };

    /**
     * Determines whether any window (from the queue) is currently opened
     *
     * @return {Boolean}
     */
    WindowsQueueManager.prototype.isWindowOpened = function() {
        return this.getLastOpenedWindow() !== null;
    };

    /**
     * Determines whether collecting windows to open on the start of the game has been finished.
     *
     * @return {Boolean}
     */
    WindowsQueueManager.prototype.isQueueingDisabled = function() {
        return this.queueing_disabled === true;
    };

    /**
     * Disables queueing new windows
     */
    WindowsQueueManager.prototype.disableQueueing = function() {
        this.queueing_disabled = true;
    };

    WindowsQueueManager.prototype.initialize = function() {
        this.disableQueueing();

        //Listen on events
        this.initializeEventsListeners();

        if (this.isSingleWindowMode()) {
            if (this.canProceedWithOpeningWindows()) {
                this.initializeOpeningWindows();
            }
        } else {
            while (this.canProceedWithOpeningWindows()) {
                this.openWindow(this.getNextQueuedWindow());
            }
        }
    };

    /**
     * Adds window on the queue of windows to open. Position in this queue does not mean an order to be open.
     * Decision to open is made based on the 'priority'
     * @see window_type/settings -> max_settings
     *
     * @protected
     * @param {Object} data
     *     @param {String|Number} type                  window type, string for new windows, and number for old windows
     *     @param {Function} [end_condition_function]   condition which determines whether process can continue
     *     @param {Function} open_function              callback which keeps all necessary data to open the window
     *     @param {Number} priority                     priority
     * @param {Boolean} queued                          determines whether the window should wait in the queue to be opened+
     * @param {Boolean} force_queueing                  if true, force queueing, even is queueing is already closed
     */
    WindowsQueueManager.prototype._addWindow = function(data, queued, force_queueing) {
        var wnd = new OnGameLoadWindow({
                type: data.type,
                priority: data.priority,
                open_function: data.open_function,
                queued: queued
            }),
            settings = (typeof data.type === 'string') ? WF.getSettings(data.type) : {
                max_instances: 1
            };

        //If the window is already in the queue and window_type/settings/max_instances only allows 1
        if (this.isWindowInTheQueue(wnd) && settings.max_instances === 1) {
            //replace it with the new one
            this._replaceWindowInQueueOfTheSameType(wnd);
        } else if (this.isQueueingDisabled() && !force_queueing) {
            //When queue is already disabled, open windows straight away
            this.openWindow(wnd);
        } else {
            //Just add it
            this.queue.push(wnd);
        }
    };

    /**
     * @see addWindow params
     *
     * Adds window to the queue only if queueing is still opened
     */
    WindowsQueueManager.prototype.addQueuedWindow = function(data) {
        this._addWindow(data, true, false);
    };

    /**
     * @see addWindow params
     *
     * forces the use of the queue, even if queueing is already closed
     */
    WindowsQueueManager.prototype.forceAddQueuedWindow = function(data) {
        this._addWindow(data, true, true);
    };

    /**
     * @see addWindow params
     *
     * Windows added by this method will skip waiting for closing previous windows and will be opened immediately
     * (only in SINGLE_WINDOW_MODE) right now only 'Conquest' window
     */
    WindowsQueueManager.prototype.addNotQueuedWindow = function(data) {
        this._addWindow(data, false, false);
    };

    /**
     * Checks whether window of the given type is already register
     *
     * @param {String|Number} window_type
     * @return {Boolean}
     */
    WindowsQueueManager.prototype.isRegistered = function(window_type) {
        var wnd = this.getWindow(window_type);

        return typeof wnd !== 'undefined';
    };

    /**
     * Returns window object if registered otherwise underfined
     *
     * @param {String|Number} window_type
     * @return {OnGameLoadWindow|undefined}
     */
    WindowsQueueManager.prototype.getWindow = function(window_type) {
        return us.find(this.getQueue(), function(wnd) {
            return wnd.getType() === window_type;
        });
    };

    /**
     * Clears windows queue (prepared for QA Automation tests)
     */
    WindowsQueueManager.prototype.clearQueue = function() {
        this.queue = [];
    };

    /**
     * Destroys module when its not used anymore
     */
    WindowsQueueManager.prototype.destroy = function() {
        $.Observer().unsubscribe(this.event_listener_class);
    };

    /**
     * return the highest priority any window can have
     *
     * @returns {Number}
     */
    WindowsQueueManager.prototype.getHighestPriority = function() {
        return this.highest_priority;
    };

    /**
     * pause creation of new windows
     */
    WindowsQueueManager.prototype.pause = function() {
        this.window_creation_play_state_active = false;
        this._window_pause_queue = [];
    };

    /**
     * resume creation of new windows, opens all windows during paused state
     */
    WindowsQueueManager.prototype.resume = function() {
        this.window_creation_play_state_active = true;

        for (var i = 0, j = this._window_pause_queue.length; i < j; i++) {
            var win = this._window_pause_queue[i];
            this.openNextWindow(win);
        }

        this._window_pause_queue = [];
    };

    window.WQM = new WindowsQueueManager();
}());