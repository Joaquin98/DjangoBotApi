/*globals WM */

(function() {
    'use strict';

    /**
     * Object which represent window to open on the game load
     *
     * @param {Object} data
     *     {String|Number} data.type                window type (@see getIdentifier())
     *     {Function} data.open_functions
     *     {Function} [data.end_condition_function]
     *     {Int} priority
     *     {Boolean} queued
     */
    function OnGameLoadWindow(data) {
        var priorities = require('game/windows/priorities');

        this.window_obj = null; //Set after 'open function' execution, keeps real id of the window
        this.data = data;
        this.type = this.getType(); //Used for easy object read in console
        this.priority = data.priority || priorities.getPriority(this.getType() || 'neutral');
    }

    /**
     * Returns window object. Keep in mind that the 'object' is available only after has been opened. Before function returns 'null'
     *
     * @return {Object|null}
     */
    OnGameLoadWindow.prototype.getWindowObject = function() {
        return this.window_obj;
    };

    /**
     * Sets window object
     *
     * @param {Object} obj
     * @private
     */
    OnGameLoadWindow.prototype._setWindowObject = function(obj) {
        this.window_obj = obj;
    };

    /**
     * Returns type of the window
     *
     * @return {String|Number}
     */
    OnGameLoadWindow.prototype.getType = function() {
        return this.data.type;
    };

    OnGameLoadWindow.prototype.isQueued = function() {
        return this.data.queued === true;
    };

    /**
     * Determines whether window has been already opened or not (trough windows queue manager)
     *
     * @return {Boolean}
     */
    OnGameLoadWindow.prototype.hasBeenOpened = function() {
        return this.window_obj !== null;
    };

    /**
     * Returns function which should contain code which will open the window
     *
     * @return {Function}
     */
    OnGameLoadWindow.prototype.getOpenFunction = function() {
        return this.data.open_function;
    };

    /**
     * Returns function which is used to check final condition which allows script to close window
     *
     * @return {Function}
     */
    OnGameLoadWindow.prototype.getEndConditionFunction = function() {
        return this.data.end_condition_function;
    };

    /**
     * Returns priority of the window
     *
     * @return {Number}
     */
    OnGameLoadWindow.prototype.getPriority = function() {
        return this.priority;
    };

    /**
     * Opens the window
     */
    OnGameLoadWindow.prototype.open = function() {
        var open_function = this.getOpenFunction();

        this._setWindowObject(open_function());
    };

    /**
     * Closes the window
     * @returns {Boolean} false if no windows_obj was set
     */
    OnGameLoadWindow.prototype.close = function() {
        if (!this.window_obj) {
            // CRM is complicated and wired and playing not nice with the window queue.
            // This fixes a bug where a OnGameLoadWindow gets created and never gets a window_object
            // TODO remove hack
            if (WM.getWindowByType(this.type).length > 0) {
                WM.getWindowByType(this.type).forEach(function(wnd) {
                    wnd.close();
                });
                return true;
            }
            return false;
        }
        this.window_obj.close();
        return true;
    };

    /**
     * Checks whether the window is ready to close
     *
     * @return {Boolean}
     */
    OnGameLoadWindow.prototype.isReadyToRemove = function() {
        var end_condition_function = this.getEndConditionFunction();

        return typeof end_condition_function === 'function' ? end_condition_function(this.getWindowObject()) : true;
    };

    window.OnGameLoadWindow = OnGameLoadWindow;
}());