/*global window, Timestamp */
(function(window) {
    "use strict";

    window.gtime = {
        /**
         * Calculates time difference in seconds between two dates, returns zero
         * for negative results.
         *
         * @param {Number} timestamp_end
         * @param {Number} timestamp_start
         *
         */
        getTimeDifference: function(timestamp_end, timestamp_start) {
            timestamp_start = timestamp_start || Timestamp.now();

            return timestamp_end > timestamp_start ? timestamp_end - timestamp_start : 0;
        }
    };
}(window));