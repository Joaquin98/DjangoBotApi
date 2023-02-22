/* global Game */
/**
 * Timestamp functions to help with client and server time. Timestamps are UTC based, that means they are the seconds
 * since Unix epoch, which is 01.01.1970 00:00:00 @ Greenwich Mean Time (GMT).
 *
 * To fully work this requires to have an access to Game.server_time and
 * Game.server_gmt_offset in the html document like so:
 *
 * Game.server_time = '1256130141';
 * Game.server_gmt_offset = '3600';
 *
 * The Game.server_time value should be updated after each Ajax Request (@see data/js/common.js:
 * Timestamp.updateServerTime(...)), so freshly evaluated Responses that contain Javascript can access this fresh
 * timestamp (if they need to).
 */
define('misc/timestamp', function() {
    'use strict';

    var Timestamp = {
        last_servertime_update: 0,

        /**
         * Convert number of days to seconds
         *
         * @param {Number} days
         * @returns {Number}
         */
        fromDays: function(days) {
            return this.fromHours(days * 24);
        },

        /**
         * Convert number of hours to seconds
         *
         * @param {Number} hours
         * @returns {Number}
         */
        fromHours: function(hours) {
            return hours * 60 * 60;
        },

        /**
         * Returns the server timestamp in seconds since Unix Epoche 01.01.1970 00:00 GMT
         *
         * @return int seconds
         */
        server: function() {
            try {
                var diff = 0;
                if (this.last_servertime_update !== 0) {
                    diff = parseInt(this.client() - this.last_servertime_update, 10);
                }

                return (Game.server_time + diff);
            } catch (e) {}

        },

        /**
         * Returns the current client timestamp in seconds since Unix Epoche 01.01.1970 00:00 GMT
         *
         * @return int seconds
         */
        client: function() {
            return Timestamp.make();
        },

        /**
         * Returns time difference between client and server time
         *
         * @return int seconds
         */
        clientServerDiff: function() {
            return Timestamp.client() - Timestamp.server();
        },

        /**
         * Get current Timestamp of server or client. This is basically an alias
         * to Timestamp.server() and Timestamp.client. If now 'which' is provided
         * it returns the clients timestamp.
         *
         * @see Timestamp.client()
         * @see Timestamp.server()
         * @param {string} which (s|server|c|client)
         * @return int seconds
         */
        now: function(which) {
            switch (which) {
                case 'client':
                case 'c':
                    return Timestamp.client();
                case 'server':
                case 's':
                    return Timestamp.server();
                default:
                    return Timestamp.server();
            }
        },

        /**
         * get seconds timestamp of next midnight after given timestamp
         *
         * @param {integer} seconds
         * @return integer
         */
        nextMidnight: function(seconds) {
            var date = new Date(seconds * 1000);
            date.setUTCDate(date.getUTCDate() + 1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            return parseInt(date.getTime() / 1000, 10);
        },

        /**
         * get number of seconds left till next midnight
         */
        getSecondsToNextMidnight: function() {
            return Timestamp.nextMidnight(Timestamp.now()) - Timestamp.now();
        },

        /**
         * Returns the servers gmt offset in seconds as is set in player settings
         *
         */
        serverGMTOffset: function() {
            return parseInt(Game.server_gmt_offset, 10);
        },

        /**
         * Returns the servers lc_timezone offset
         *
         */
        localeGMTOffset: function() {
            return parseInt(Game.locale_gmt_offset, 10);
        },

        /**
         * Returns the local client gmt offset in seconds
         *
         */
        clientGMTOffset: function(ts) {
            var o = ts ? new Date(ts * 1000) : new Date();
            o = o.getTimezoneOffset() * 60;

            return o;
        },

        /**
         * Updates the server time information in the dom
         *
         * @param {Date} date Date object
         */
        updateServerTime: function(date) {
            try {
                var ts = Timestamp.make(date);
                // workaround for GP-3621 which couldn't be reproduced.
                Game.server_time = ts || Game.server_time;
                this.last_servertime_update = this.client();
            } catch (e) {}
        },

        /**
         * Updates the server time information in the dom
         *
         * @param unix timestamp
         */
        updateServerTimebyUnixTime: function(timestamp) {
            timestamp = parseInt(timestamp, 10);
            // workaround for GP-3621 which couldn't be reproduced.
            Game.server_time = timestamp || Game.server_time;
            this.last_servertime_update = this.client();
        },

        /**
         * Makes a timestamp from a Date and returns seconds since Unix epoche
         *
         * @param Mixed d
         * @return number
         */
        make: function(d) {
            d = (undefined === d) ? new Date() : new Date(d);
            return parseInt(d.getTime() / 1000, 10);
        },

        /**
         * Converts to a Date object
         *
         * @param {number} ts Timestamp
         * @return Date
         */
        toDate: function(ts) {
            return new Date(ts * 1000);
        },

        /**
         * Shifts a unix timestamp into by timezone offset
         * player_timezone := Timezone type is either for shifting by player timezone from settings (default)
         * lc_timezone := or for shifting by server lc_timezone
         *
         * @param {integer} unix_timestamp to shift
         * @param {string} timezone_type player for player timezon from settings or
         *
         */
        shiftUnixTimestampByTimezoneOffset: function(unix_timestamp, timezone_type) {
            return unix_timestamp + (timezone_type === 'lc_timezone' ? Timestamp.serverGMTOffset() : Timestamp.localeGMTOffset());
        },

        serverTime: function() {
            return Timestamp.toDate(Timestamp.server() + Timestamp.serverGMTOffset());
        },

        serverTimeToLocal: function() {
            return Timestamp.toDate(Timestamp.server() + Timestamp.localeGMTOffset());
        }
    };

    window.Timestamp = Timestamp;
    return window.Timestamp;
});