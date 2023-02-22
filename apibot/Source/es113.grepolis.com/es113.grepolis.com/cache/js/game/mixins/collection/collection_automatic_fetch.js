/*globals TM, NotificationLoader */

(function() {
    'use strict';

    // the smallest time to wait until refetching (ms)
    var MINIMUM_TIMEOUT = 1000;
    // used for a quick third check of the queue state
    var EXTENDED_TIMEOUT = 5000;
    // maximum timeout between fetches if daemon is overdue
    var MAXIMUM_TIMEOUT = 30 * 1000;
    // factor taken to increase the refetch timeout each try when fetching fails
    var TIMEOUT_INCREASE_FACTOR = 1.5;

    var DAEMON_OVERDUE_TIMER_ID = 'Daemon_Overdue_Refetch';

    var fetchBackendData = function() {
        NotificationLoader.resetNotificationRequestTimeout(100);
    };

    window.GrepolisCollectionAutomaticFetch = {

        current_poll_timeout: MINIMUM_TIMEOUT,

        /**
         * Adds special functionality to the collection which cares about fetching new data when something changes in the collection.
         * It requires 'getTimeLeft' method on the models which are in the collection.
         * In this method, 'this' refers to the collection.
         *
         * @param {Array} event_names
         * @param {Function} getNextInterval
         */
        initializeNotificationRequestHandler: function(event_names, getNextInterval) {
            this._next_automatic_fetch_timer_name = null;

            /**
             * Function triggered when there is a change in the model
             *
             * @returns {void}
             */
            this.onChangeAutomaticFetchHandler = function() {
                var first_model = this.first();

                if (this._next_automatic_fetch_timer_name === null) {
                    this._next_automatic_fetch_timer_name = TM.generateUniqueId('next_automatic_fetch');
                    this._next_automatic_fetch_timer_name_1 = this._next_automatic_fetch_timer_name + '_1';
                    this._next_automatic_fetch_timer_name_5 = this._next_automatic_fetch_timer_name + '_5';
                }

                this.stopDaemonOverdueHandler();

                TM.unregister(this._next_automatic_fetch_timer_name);
                TM.unregister(this._next_automatic_fetch_timer_name_1);
                TM.unregister(this._next_automatic_fetch_timer_name_5);

                if (first_model) {
                    var next_finished_time = getNextInterval(this) * 1000;

                    if (next_finished_time <= 0) {
                        // overdue case
                        this.startDaemonOverdueHandler();
                    } else if (next_finished_time > 0) {
                        // normal case
                        TM.once(
                            this._next_automatic_fetch_timer_name,
                            Math.max(MINIMUM_TIMEOUT, next_finished_time),
                            fetchBackendData
                        );
                        TM.once(
                            this._next_automatic_fetch_timer_name_1,
                            Math.max(MINIMUM_TIMEOUT, next_finished_time) + MINIMUM_TIMEOUT,
                            fetchBackendData
                        );
                        TM.once(
                            this._next_automatic_fetch_timer_name_5,
                            Math.max(MINIMUM_TIMEOUT, next_finished_time) + EXTENDED_TIMEOUT,
                            fetchBackendData
                        );
                    }
                } else {}
            };

            this.on(event_names.join(' '), this.onChangeAutomaticFetchHandler, this);
        },

        stopDaemonOverdueHandler: function() {
            TM.unregister(DAEMON_OVERDUE_TIMER_ID);
            this.current_poll_timeout = MINIMUM_TIMEOUT;
        },

        startDaemonOverdueHandler: function() {
            TM.unregister(DAEMON_OVERDUE_TIMER_ID);
            var registerDaemonOverdueTimer = function() {
                TM.once(DAEMON_OVERDUE_TIMER_ID, this.current_poll_timeout, getNotificationsAndIncreaseTimeout);
            }.bind(this);

            var getNotificationsAndIncreaseTimeout = function() {
                fetchBackendData();
                this.current_poll_timeout = Math.min(
                    TIMEOUT_INCREASE_FACTOR * this.current_poll_timeout,
                    MAXIMUM_TIMEOUT
                );
                registerDaemonOverdueTimer();
            }.bind(this);

            registerDaemonOverdueTimer();
        },

        /**
         * overwrite fetchBackendData method with a custom
         * @param {function} callback
         */
        setFetchBackendData: function(callback) {
            fetchBackendData = callback;
        }
    };
}());