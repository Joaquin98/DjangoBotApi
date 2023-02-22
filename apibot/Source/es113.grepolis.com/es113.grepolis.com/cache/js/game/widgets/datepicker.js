/*globals jQuery, Timestamp */

/**
 * How to initialize:
 *
 * Create any HTML you want, but think in mind that there have to be place for 4 spinners.
 * Put js-spinner-x class names on the nodes which will became spinners
 *
 * <div class="time">
 *		<div class="clock"></div>
 *		<div class="sp_attack_day spinner js-spinner-day"></div>
 *		<div class="dot">.</div>
 *		<div class="sp_attack_month spinner js-spinner-month"></div>
 *		<div class="dot">.</div>
 *		<div class="sp_attack_year spinner js-spinner-year"></div>
 *		<div class="comma">,</div>
 *		<div class="sp_attack_time spinner js-spinner-time"></div>
 *
 *		<div class="rb_attack_type radiobutton attack_types"></div>
 *	</div>
 */

(function($) {
    'use strict';

    $.fn.datepicker = function(params) {
        var settings = $.extend({
            steps: {
                day: 1,
                month: 1,
                year: 1,
                time: '00:10:00'
            },
            timestamp: null,
            disabled: false
        }, params);

        var $el = $(this),
            $sp_day, $sp_month, $sp_year, $sp_time;

        function bindEvents() {

        }

        function unbindEvents() {

        }

        /**
         * @param utc    we have to use UTC only to determinate start date, next calculations should use normal functions
         */
        function recalculateDateValues(objDate, utc) {
            if (!objDate) {
                objDate = new Date($sp_year.getValue(), parseInt($sp_month.getValue(), 10) - 1, $sp_day.getValue());
            }

            return {
                day: objDate[utc ? 'getUTCDate' : 'getDate'](),
                month: objDate[utc ? 'getUTCMonth' : 'getMonth']() + 1, //+1 because months are counted from 0
                year: objDate[utc ? 'getUTCFullYear' : 'getFullYear']()
            };
        }

        function getTimeValue(objDate) {
            var hours = objDate.getUTCHours(),
                minutes = objDate.getUTCMinutes(),
                seconds = objDate.getUTCSeconds(),
                time = (hours < 9 ? '0' + hours : hours) + ':' + (minutes < 9 ? '0' + minutes : minutes) + ':' + (seconds < 9 ? '0' + seconds : seconds);

            return time;
        }

        function getTimeValues(objDate) {
            var sp_time;

            if (!objDate) {
                sp_time = $sp_time.getTimeValues();
                objDate = new Date(null, null, 1, sp_time.hours, sp_time.minutes, sp_time.seconds);
            }

            var hours = objDate.getHours(),
                minutes = objDate.getMinutes(),
                seconds = objDate.getSeconds(),
                time = (hours < 9 ? '0' + hours : hours) + ':' + (minutes < 9 ? '0' + minutes : minutes) + ':' + (seconds < 9 ? '0' + seconds : seconds);

            return {
                seconds: seconds,
                minutes: minutes,
                hours: hours,
                time: time
            };
        }

        function updateComponentsValues(time_values) {
            $sp_day.setValue(time_values.day, {
                silent: true
            });
            $sp_month.setValue(time_values.month, {
                silent: true
            });
            $sp_year.setValue(time_values.year, {
                silent: true
            });
        }

        /**
         * Disables radiobutton
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            $sp_day.disable();
            $sp_month.disable();
            $sp_year.disable();
            $sp_time.disable();

            return this;
        };

        /**
         * Enables radiobutton
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            $sp_day.enable();
            $sp_month.enable();
            $sp_year.enable();
            $sp_time.enable();

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            $sp_day.destroy();
            $sp_month.destroy();
            $sp_year.destroy();
            $sp_time.destroy();

            unbindEvents();
        };

        this.getDay = function() {
            return $sp_day.getValue();
        };

        this.getMonth = function() {
            return $sp_month.getValue();
        };

        this.getYear = function() {
            return $sp_year.getValue();
        };

        this.getTime = function() {
            return getTimeValues();
        };

        //Initialization
        (function() {
            //Initialize time spinners
            var objDate = Timestamp.toDate(Timestamp.shiftUnixTimestampByTimezoneOffset(settings.timestamp)),
                date_values = recalculateDateValues(objDate, true),
                steps = settings.steps;

            $sp_day = $el.find('.js-spinner-day').spinner({
                min: 1,
                max: 31,
                value: date_values.day,
                step: steps.day,
                tabindex: 1
            }).on('sp:change:value', function(e, new_val, old_val, _sp) {
                var time_values = recalculateDateValues();
                updateComponentsValues(time_values);
            });

            $sp_month = $el.find('.js-spinner-month').spinner({
                min: 1,
                max: 12,
                value: date_values.month,
                step: steps.month,
                tabindex: 2
            }).on('sp:change:value', function(e, new_val, old_val, _sp) {
                var time_values = recalculateDateValues();
                updateComponentsValues(time_values);
            });

            $sp_year = $el.find('.js-spinner-year').spinner({
                min: 2012,
                max: 2200,
                value: date_values.year,
                step: steps.year,
                tabindex: 3
            }).on('sp:change:value', function(e, new_val, old_val, _sp) {
                var time_values = recalculateDateValues();
                updateComponentsValues(time_values);
            });

            $sp_time = $el.find('.js-spinner-time').spinner({
                min: '00:00:00',
                max: '24:00:00',
                value: getTimeValue(objDate),
                step: steps.time,
                type: 'time',
                tabindex: 4
            });

            bindEvents();
        }());

        return this;
    };
}(jQuery));