/*globals NotificationHandler, Logger, GrepoNotificationStack, debug, Timestamp, Game, TM, gpAjax */

(function() {
    'use strict';

    var logger = Logger.get('notifications');

    /**
     * Notification Loader, used to fetch notifiactions from backend
     */
    function notificationLoader() {
        var notification_next_fetch_at = 0,
            last_token_update = 0,
            //token restore rate per second (0.1 means max 6 notification fetches per minute)
            token_restore_rate = 0.1,
            //inverse token restore rate
            inv_token_restore_rate = 1 / token_restore_rate,
            token_bucket_capacity = parseInt(token_restore_rate * 60, 10),
            //one fetch equals one token
            token_bucket = token_bucket_capacity,
            nHandler = new NotificationHandler(),
            closed_notification_list = {};

        /**
         * Send request to server to query the notifiactions.
         * The result data is send to an handler function by gpajax.js
         *
         * @param {boolean} _no_sysmsg
         * @return void
         */
        this.requestNotifications = function(_no_sysmsg) {
            //Prevent unlimited notification fetch per time unit
            token_bucket = Math.min(token_bucket + parseInt(token_restore_rate * (Timestamp.now() - (last_token_update || Timestamp.now())), 10), token_bucket_capacity);
            if (token_bucket < 1) {
                this.resetNotificationRequestTimeout((parseInt(inv_token_restore_rate + last_token_update, 10) + 1) * 1E3);
                return;
            }
            last_token_update = Timestamp.now();
            token_bucket--;

            notification_next_fetch_at = 0;
            gpAjax.ajaxGet('notify', 'fetch', {
                'no_sysmsg': !!_no_sysmsg
            }, false, function() {});
        };

        /**
         * reset notification request timeout. this will lead to a reset
         * of the next fetch in timer
         *
         * @param {integer} next_fetch_in in ms
         * @return void
         */
        this.resetNotificationRequestTimeout = function(next_fetch_in) {
            var _self = this;

            next_fetch_in = next_fetch_in || 100; //default 100ms

            var now = Timestamp.now('c');

            var timer_name = 'notification_fetch';

            if (notification_next_fetch_at < now || (notification_next_fetch_at > now && notification_next_fetch_at > now + Math.ceil(next_fetch_in * 0.001))) {
                notification_next_fetch_at = now + Math.ceil(next_fetch_in * 0.001);

                TM.unregister(timer_name);
                TM.register(timer_name, next_fetch_in, function() {
                    _self.requestNotifications();
                }, {
                    max: 1
                });
            }
        };

        /**
         * Receives the notification data from server backend and processes it
         *
         * @param {object} data
         * @param game_initialization
         * @return void
         */
        this.recvNotifyData = function(data, game_initialization) {
            var notification,
                i = data.notifications.length,
                postponed_notifications = [];

            //Delete outdated notifications
            GrepoNotificationStack.deleteOutdated();

            //order the notifications, so that we handle the oldest one first
            data.notifications.sort(function(a, b) {
                var result;

                if (!a.time) {
                    // notifications without times are request bound notifications, and are always the newest
                    if (!b.time) {
                        return 0;
                    }
                    return -1;
                } else if (!b.time) {
                    return +1;
                } else {
                    if ((result = b.time - a.time) === 0) {
                        result = b.id - a.id || 0;
                    }

                    return result;
                }
            });

            logger.log(function() {
                return nHandler.logNotifications(data.notifications);
            });

            while (i--) {
                notification = data.notifications[i];

                if (notification.subject === 'TownGroupTown') {
                    postponed_notifications.push(notification);
                } else {
                    this.handleNotification(notification, game_initialization);
                }
            }

            us.each(postponed_notifications, function(notification) {
                this.handleNotification(notification, game_initialization);
            }.bind(this));

            // Prepare next timeout timer
            var next_fetch_in;
            if (data.next_fetch_in) {
                next_fetch_in = data.next_fetch_in * 1000;
            } else {
                next_fetch_in = 30000; // 30s
            }

            this.resetNotificationRequestTimeout(next_fetch_in);
        };

        /**
         * Handle notification
         *
         * @param {object} notification
         * @param game_initialization
         * @return void
         */
        this.handleNotification = function(notification, game_initialization) {
            var id;

            //Indicates if notification was received during game initialization
            notification.game_initialization = game_initialization;

            // On the fly notifications do not have an id but must be handled
            if (notification.id) {
                id = parseInt(notification.id, 10);

                // Check if notification was already handled
                if (notification.type !== 'backbone' && closed_notification_list.hasOwnProperty(id)) {
                    return;
                }
            }

            if (typeof notification._srvtime !== 'undefined') {
                // synchronize front- and backend
                Timestamp.updateServerTimebyUnixTime(notification._srvtime);
            }

            // Handle
            if (Game.dev) {
                nHandler.handleNotification(notification);
            } else {
                try {
                    nHandler.handleNotification(notification);
                } catch (e) {
                    debug(e);
                }
            }

            if (notification.type !== 'backbone' && notification.id) {
                // Mark notification as handled
                closed_notification_list[id] = 1;
            }
        };
    }

    window.notificationLoader = notificationLoader;
}());