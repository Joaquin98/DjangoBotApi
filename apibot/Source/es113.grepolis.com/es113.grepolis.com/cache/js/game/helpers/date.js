/* global s, _, __, ngettext, readableUnixTimestamp, getHumanReadableTimeDate */
define('helpers/date', function() {
    'use strict';

    var Timestamp = require('misc/timestamp'),
        SHORT_LABEL_TYPE = 'short',
        FULL_LABEL_TYPE = 'full';

    function decomposeDuration(seconds) {
        var days = Math.floor(seconds / 86400);
        seconds -= days * 86400;

        var hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;

        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }

    /**
     * Transforms duration of seconds into an object with labeled durations, for example:
     * SHORT_LABEL_TYPE = ['10 d', '5 h', '30 m', '45 s']
     * FULL_LABEL_TYPE = ['10 days', '5 hours', '30 minutes', '45 seconds']
     *
     * Only time units with a positive value are shown, for example an input of exactly 12 hours will return
     * only '12h', not including the 0 minute and 0 second values.
     *
     * If seconds <= 0, the return will be ['0s'] (short) or ['0seconds'] (full)
     *
     * @param seconds
     * @param label_type one of [DateHelper.FULL_LABEL_TYPE, DateHelper.SHORT_LABEL_TYPE]
     * @returns Array
     */
    function decomposeDurationWithLabels(seconds, label_type) {
        label_type = typeof label_type === 'undefined' ? FULL_LABEL_TYPE : label_type;

        var components = decomposeDuration(seconds),
            component_order = ['days', 'hours', 'minutes', 'seconds'],
            labels = {},
            formatted_components = [];

        if (label_type === FULL_LABEL_TYPE) {
            labels = {
                days: ' ' + ngettext('day', 'days', components.days),
                hours: ' ' + ngettext('hour', 'hours', components.hours),
                minutes: ' ' + ngettext('minute', 'minutes', components.minutes),
                seconds: ' ' + ngettext('second', 'seconds', components.seconds)
            };
        } else if (label_type === SHORT_LABEL_TYPE) {
            labels = {
                days: __('day|d'),
                hours: __('hour|h'),
                minutes: __('minute|m'),
                seconds: __('second|s')
            };
        }

        component_order.forEach(function(key) {
            if (components[key] >= 1) {
                formatted_components.push(components[key] + labels[key]);
            }
        });

        if (formatted_components.length === 0) {
            formatted_components.push('0' + labels.seconds);
        }

        return formatted_components;
    }

    function toLocaleDateStringSupportsLocales() {
        try {
            new Date().toLocaleDateString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }

        return false;
    }

    function toLocaleTimeStringSupportsLocales() {
        try {
            new Date().toLocaleTimeString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }
        return false;
    }

    var DateHelper = {
        FULL_LABEL_TYPE: FULL_LABEL_TYPE,
        SHORT_LABEL_TYPE: SHORT_LABEL_TYPE,

        /**
         * Transforms seconds to hours:minutes:seconds
         * @param seconds
         * @param display_days
         * @param only_non_zero_hours the part with time will be shown only if not empty (avoiding 7 Tage 0:00:00 case)
         * @param seconds_with_fraction
         *
         * @return String
         */
        readableSeconds: function(seconds, display_days, only_non_zero_hours, seconds_with_fraction) {
            var days,
                hours,
                minutes;

            // Calculate days only
            if (display_days) {
                days = parseInt(seconds / 86400, 10);
                seconds -= days * 86400;
            }

            hours = parseInt(seconds / 3600, 10);
            minutes = parseInt((seconds - (hours * 3600)) / 60, 10);
            if (seconds_with_fraction) {
                seconds = seconds % 60;
            } else {
                seconds = parseInt(seconds % 60, 10);
            }

            function zerofill(n, len) {
                if (typeof(len) === 'undefined') {
                    len = 2;
                }
                n = n + '';
                while (n.length < len) {
                    n = '0' + n;
                }

                return n;
            }

            return (display_days && days > 0 ? ngettext('%s day', '%s days', days).split('%s').join(days) + ' ' : '') +
                ((!only_non_zero_hours || hours !== 0 || minutes !== 0 || seconds !== 0) ?
                    (zerofill(hours) + ':' + zerofill(minutes) + ':' + zerofill(seconds)) : '');
        },

        /**
         * Returns the duration of seconds into formatted string with labels, for example:
         * SHORT_LABEL_TYPE = '10d 5h 30m 45s'
         * FULL_LABEL_TYPE = '10 days 5 hours 30 minutes 45 seconds'
         *
         * Only time units with a positive value are shown, for example an input of exactly 12 hours will return
         * only '12h', not including the 0 minute and 0 second values.
         *
         * @param seconds
         * @param label_type one of [DateHelper.FULL_LABEL_TYPE, DateHelper.SHORT_LABEL_TYPE]
         * @returns String
         */
        readableSecondsWithLabels: function(seconds, label_type) {
            var components = decomposeDurationWithLabels(seconds, label_type);

            return components.join(' ');
        },

        /**
         * Transforms a timestamp into a string with 'hours:minutes' (uses browser locale to determine 12h/24h mode).
         * This is the equivalent output to moment().format('LT')
         *
         * IE10 and lower will also include the seconds ('hh:mm:ss') due to lack of support for Date.toLocaleTimeString
         *
         * @param ts timestamp
         * @param with_seconds
         *
         * @returns String
         */
        timestampToLocaleTime: function(ts, with_seconds) {
            var date = Timestamp.toDate(Timestamp.shiftUnixTimestampByTimezoneOffset(ts)),
                options = {
                    timeZone: 'UTC',
                    hour12: false,
                    hour: 'numeric',
                    minute: '2-digit'
                };

            if (with_seconds) {
                options.second = '2-digit';
            }

            return toLocaleTimeStringSupportsLocales() ?
                date.toLocaleTimeString(undefined, options) :
                date.toLocaleTimeString();
        },

        /**
         * Transforms a timestamp into a date string, using browser locale to determine the order (dd.mm.yy, mm/dd/yy etc.)
         * This is the equivalent output to moment().format('L')
         * @param ts timestamp
         * @returns String
         */
        timestampToLocaleDate: function(ts) {
            var date = Timestamp.toDate(Timestamp.shiftUnixTimestampByTimezoneOffset(ts)),
                options = {
                    timeZone: 'UTC'
                };

            return toLocaleDateStringSupportsLocales() ?
                date.toLocaleDateString(undefined, options) :
                date.toLocaleDateString();
        },

        /**
         * Transforms timestamp to readable time and date format
         *
         * @param {integer} timestamp
         * @param {string} timezone - 'lc_timezone' if we want the server offset, can be undefined otherwise
         * @returns {string}
         *
         */
        timestampToDateTime: function(timestamp, timezone) {
            timestamp = Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp, timezone);

            return getHumanReadableTimeDate(Timestamp.toDate(timestamp));
        },

        /**
         * Transforms timestamp to nicely readable format
         *
         * @param {integer} timestamp
         * @param {boolean} with_seconds - flag if a date with seconds should be returned
         * @param {boolean} with_prefix - flag if the date should be prefixed with 'on'
         * @return String
         *
         * Example:
         * formatDateTimeNice(order.getCompletedAt(), true, true)
         */
        formatDateTimeNice: function(timestamp, with_seconds, with_prefix) {
            with_prefix = typeof with_prefix === 'undefined' ? true : with_prefix;

            var result;
            var cur = new Date(Timestamp.shiftUnixTimestampByTimezoneOffset(Timestamp.server()) * 1E3);
            var fut = new Date(Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp) * 1E3); //timestamp in future

            var curY = cur.getUTCFullYear();
            var curM = cur.getUTCMonth();
            var curD = cur.getUTCDate();
            var today = new Date(Date.UTC(curY, curM, curD, 23, 59, 59)).getTime();
            var yesterday = new Date(Date.UTC(curY, curM, curD - 1, 23, 59, 59)).getTime();
            var tomorrow = new Date(Date.UTC(curY, curM, curD + 1, 23, 59, 59)).getTime();

            //Get correct expression
            if (fut.getTime().between(yesterday, today)) {
                result = s(_('today at %1'), this.timestampToLocaleTime(timestamp, with_seconds));
            } else if (fut.getTime().between(today, tomorrow)) {
                result = s(_('tomorrow at %1'), this.timestampToLocaleTime(timestamp, with_seconds));
            } else {
                var date_local = this.timestampToLocaleDate(timestamp);
                var time_local = this.timestampToLocaleTime(timestamp, with_seconds);

                result = s((with_prefix ? _('on %1 at %2') : _('%1 at %2')), date_local, time_local);
            }

            return result;
        },

        /**
         * Transforms timestamp to nicely readable format
         *
         * @param {integer} timestamp
         * @param {string} timezone_type
         * @return String
         *
         * Example:
         * formatDateTimeNice(order.getCompletedAt(), true, 'player_timezone')
         */
        formatAdvisorExpiration: function(timestamp, timezone_type) {
            var ts = (timezone_type === 'no_offset' ? timestamp : Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp, timezone_type)),
                date = new Date(ts * 1E3),
                days = date.getUTCDate(),
                months = date.getUTCMonth() + 1,
                year = date.getUTCFullYear(),
                date_formatted;

            if (days < 10) {
                days = '0' + days;
            }

            if (months < 10) {
                months = '0' + months;
            }

            date_formatted = days + "." + months + "." + year;

            return s(_('%1 <br />at %2'), date_formatted, readableUnixTimestamp(timestamp, timezone_type, {
                with_seconds: true
            }));
        },

        /**
         * Transforms a given interval in seconds to a string.
         * This string shows days if more than 48 hours,
         * days and hh:mm:ss in the last 48h.
         *
         * @param {integer} duration in s
         * @param use_left
         *
         * @return {string}
         */
        seconds_in_last48_hours: function(duration, use_left) {
            var days,
                str = [];

            days = Math.floor(duration / 86400);

            if (days >= 2) {
                var time_left = days + ' ' + ngettext('day', 'days', days);
                if (use_left) {
                    str.push(s(ngettext('%1 left', '%1 left', days), time_left));
                } else {
                    str.push(s(_('%1 remaining'), time_left));
                }
            } else {
                str.push(this.readableSeconds(duration));
            }

            return str.join(' ');
        },

        /**
         * Transforms seconds into an approximate relative time in the past from now
         * Example: For 5412 seconds, which equals 90 minutes and 12 seconds, it will return only '90 minutes ago'
         *
         * @param {integer} seconds
         * @param {string} label_type one of [DateHelper.FULL_LABEL_TYPE, DateHelper.SHORT_LABEL_TYPE]
         * @return {string}
         */
        relativeTimeWithLabel: function(seconds, label_type) {
            var duration = Timestamp.now('s') - seconds,
                components = decomposeDurationWithLabels(duration, label_type);

            return s(_('%1 ago'), components[0]);
        },

        roundSecondsToNearestMinute: function(timestamp) {
            return Math.round(timestamp / 60) * 60;
        }
    };

    window.DateHelper = DateHelper;
    return DateHelper;
});