/* global CM */

/**
 * Default Window Handler dummy
 *
 * used for Custom Windows;  should be left as it is - 'nullhandler' -
 */
define('wndhandlers/wndhandler_default', function() {
    'use strict';

    var HumanMessage = require('misc/humanmessage');

    function WndHandlerDefault(wndhandle) {
        WndHandlerDefault.prototype.wnd = wndhandle;

        /**
         * Default Settings for initialzation
         *
         * Parameters:
         *	void
         *
         * Returns:
         *	void
         **/
        this.getDefaultWindowOptions = function() {
            // JQuery UI Dialog Options Object.
            return {
                height: 300,
                width: 460,
                resizable: false,
                autoresize: false,
                minimizable: true,
                closable: true,
                title: 'Untitled Window'
            };
        };

        /**
         * Window Initialitation
         *
         * @param title String
         * @param UIOpts Object
         * @param variant the window parameters passed to the GPWindowMgr.new() function
         *
         * @return Boolean
         */
        this.onInit = function(title, UIopts) {
            return true;
        };

        this.getModel = function() {
            return this.wnd.getModel.apply(this.wnd, arguments);
        };

        this.getCollection = function() {
            return this.wnd.getCollection.apply(this.wnd, arguments);
        };

        this.getModels = function() {
            return this.wnd.getModels.apply(this.wnd, arguments);
        };

        this.getCollections = function() {
            return this.wnd.getCollections.apply(this.wnd, arguments);
        };

        /**
         * Window Focus Event
         */
        this.onFocus = function() {};

        /**
         * Window Set Content Event
         *
         * Parameters:
         *	html	=> content.
         *
         * Returns:
         *	void
         **/
        this.onSetContent = function(html) {
            return html;
        };

        /**
         * Recv Data (from window ajax request)
         *
         * Parameters:
         *	 data	=> object with data
         *
         * Returns:
         *	 void
         **/
        this.onRcvData = function(data) {};

        /**
         * Invoked when requestcontent recvs an error
         *
         * @return void
         */
        this.onRcvDataError = function(error_msg) {
            HumanMessage.error(error_msg);
        };

        this.registerComponents = function() {};

        this.unregisterComponents = function() {
            CM.unregister(this.wnd.getContext());
        };

        /**
         * Got Message Event
         *
         * Parameters:
         *  variant.
         *
         * Returns:
         *  value
         **/
        this.onMessage = function() {
            //turn the array-like arguments object into an real array
            var args = Array.prototype.slice.call(arguments);
            // take the arguments array, shift the first entry (which should be
            // the name of the function whe want to call and apply the remaining
            // arguments to this function.
            var func = args.shift();
            if (typeof this[func] !== 'function') {
                throw 'function does not exist:' + func;
            }
            return this[func].apply(this, (args));
        };
    }

    /**
     * Prototype attached methods, enabled to have a proper inheritance chain
     */

    /**
     * Window Close Button Action
     *
     * @return Boolean
     */
    WndHandlerDefault.prototype.onClose = function() {
        this.stopListening();
        this.unregisterComponents();
        return true;
    };

    /**
     * Backbone Event methods
     */
    us.extend(WndHandlerDefault.prototype, window.Backbone.Events);

    window.WndHandlerDefault = WndHandlerDefault;

    return window.WndHandlerDefault;
});