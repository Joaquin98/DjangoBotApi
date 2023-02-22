/* global Game */

(function() {
    "use strict";

    /**
     * Adds a postfix to event names so you can unregister them in a scoped manner via jQuery.
     * E.g. toNameSpace(['click', 'touchend'], 'myScope') // -> ''
     *
     * @param {Array<string>} events
     * @param {string} namespace
     * @returns {string}
     */
    var toNamespace = function(events, namespace) {
        events = namespace ? events.map(function(ev) {
            return ev + '.' + namespace;
        }) : events;
        return events.join(' ');
    };

    /**
     * You can use these methods to get scoped event names to register on DOM elements.
     * It will always return the mouse events and corresponding touch events.
     * 
     * usage: $el.on(HelperBrowserEvents.getOnStartEventName('myView'), myHandler);
     */
    var HelperBrowserEvents = {
        /**
         * Returns proper "mousedown" event name depends whether its mobile or browser
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnStartEventName: function(namespace) {
            if (Game.isHybridApp()) {
                return toNamespace(['touchstart'], namespace);
            } else {
                return toNamespace(['touchstart', 'mousedown'], namespace);
            }
        },

        /**
         * Returns proper "mousemove" event name depends whether its mobile or browser
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnMoveEventName: function(namespace) {
            if (Game.isHybridApp()) {
                return toNamespace(['touchmove'], namespace);
            } else {
                return toNamespace(['touchmove', 'mousemove'], namespace);
            }
        },

        /**
         * Returns proper "mouseup" event name depends whether its mobile or browser
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnStopEventName: function(namespace) {
            if (Game.isHybridApp()) {
                return toNamespace(['touchend', 'touchcancel'], namespace);
            } else {
                return toNamespace(['touchend', 'touchcancel', 'mouseup'], namespace);
            }
        },

        /**
         * Returns proper "click" event name depends whether its mobile or browser
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnClickEventName: function(namespace) {
            if (Game.isHybridApp()) {
                return toNamespace(['tap'], namespace);
            } else {
                return toNamespace(['tap', 'click'], namespace);
            }
        },

        /**
         * Returns proper "mouseleave" event name depends whether its mobile or browser
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnLeaveEventName: function(namespace) {
            if (Game.isHybridApp()) {
                return toNamespace(['touchleave'], namespace);
            } else {
                return toNamespace(['touchleave', 'mouseleave'], namespace);
            }
        },

        /**
         * Returns proper "mouseover" event name depends whether its mobile or browser
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnMouseOverEventName: function(namespace) {
            if (Game.isHybridApp()) {
                return toNamespace(['taphold'], namespace);
            } else {
                return toNamespace(['taphold', 'mouseover'], namespace);
            }
        },

        /**
         * Returns proper "mousewheel" event name, there is no easy touch equivalince
         *
         * @param {String} [namespace]
         * @returns {String}
         */
        getOnMouseWheelEventName: function(namespace) {
            return 'mousewheel' + (namespace ? '.' + namespace : '');
        }
    };

    window.HelperBrowserEvents = HelperBrowserEvents;
}());