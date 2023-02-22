/*globals notificationLoader */

define('notifications/notification_loader', function(require) {
    'use strict';

    var logger = window.Logger.get('notifications');

    /**
     * Notification Loader Proxy
     */
    var NotificationLoader = {
        notification_loader: new notificationLoader(),
        game_initialized: false,
        queue: [],

        /**
         * is game initialized?
         *
         * @return integer
         */
        isGameInitialized: function() {
            return this.game_initialized;
        },

        /**
         * Send request to server to query the notifiactions.
         * The result data is send to an handler function by gpajax.js
         *
         * @param {boolean} _no_sysmsg
         * @return void
         */
        requestNotifications: function(_no_sysmsg) {
            this.notification_loader.requestNotifications(_no_sysmsg);
        },

        /**
         * reset notification request timeout. this will lead to a reset
         * of the next fetch in timer
         *
         * @param {number} next_fetch_in
         * @return void
         */
        resetNotificationRequestTimeout: function(next_fetch_in) {
            this.notification_loader.resetNotificationRequestTimeout(next_fetch_in);
        },

        /**
         * Receives the notification data from server backend and processes it
         *
         * @param {object} data
         * @param game_initialization
         * @return void
         */
        recvNotifyData: function(data, game_initialization) {
            if (this.game_initialized) {
                logger.group(function() {
                    return 'recvNotifyData (proxy) -> recvNotifyData (impl)';
                });
                this.notification_loader.recvNotifyData(data, game_initialization);
            } else {
                logger.group(function() {
                    return 'recvNotifyData (proxy) -> queue (proxy)';
                });
                this.queue.push({
                    'data': $.extend({}, data),
                    'game_initialization': game_initialization
                });
            }

            logger.groupEnd();
        },

        setGameInitialized: function() {
            this.game_initialized = true;

            this.queue.forEach(function(elem, idx) {
                try {
                    this.recvNotifyData(elem.data, elem.game_initialization);
                } catch (e) {
                    window.debug('error upon setGameInitialized', this.queue, idx);
                }
            }.bind(this));

            this.queue.length = 0;
        }
    };

    window.NotificationLoader = NotificationLoader;

    return NotificationLoader;
});