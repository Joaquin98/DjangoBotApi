/*globals DateHelper, day_hr_min_sec, readableUnixTimestamp, Timestamp, TM, MousePopup */

/**
 * IMPORTANT: Use .countdown2() instead of .countdown()
 *
 * This component allows to count down numbers, the output can be formated,
 * triggers multiple events
 *
 * @param params
 *     {Number} value         the number which will be counted down
 *     {Number} real_value
 *     {Function} condition   the function which defines if conditional event should be triggered or not
 *                            Example: this function will trigger an cd:condition event every tick:
 *                            function(value) { return true;}
 *     {String} display       string represents the way how returned value is formated
 *     Possible values:
 *         - 'readable_seconds'
 *         - 'day_hr_min_sec'
 *     {Object} parent        jQuery object of the component which uses Countdown component
 *     {String} cid           helps to determinate the button, its something like
 *                            vitrual id, or you can store there some informtaions
 *     {Number} [timestamp_end]     keeps real timestamps to calculate values more acurate
 *     {Boolean} only_non_zero		Set to true, to hide values that reached zero
 *     								If used with display set to 'day_hr_min_sec' it will shorten down to seconds
 *     								Example: 00h 02m 15s will be shortened to 02m 15s
 *     								If used with display set to or 'readable_seconds_with_days'
 *     								it will display "7 days 0:00:00" as "7 days"
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - cd:each       fired every tick
 * - cd:condition  fired when condition is true
 * - cd:finish     fired when countdown stops counting
 *
 * ------------------
 * Example 1 (Progressbar with Countdown):
 * ------------------
 *
 * CM.register(context, 'some_name', $pb.singleProgressbar({
 *     value : getTimeToEnd(end, Timestamp.now()), max : getTimeToEnd(end, start),
 *     type: 'time', countdown: true, template : 'tpl_pb_single_nomax'
 * }).on("pb:cd:finish", function(e, seconds, $parent) {
 *     //Do something when countdown will stop counting
 * }));
 *
 * ------------------
 * Example 2 (Standalone Countdown):
 * ------------------
 *
 * $("#easter_coutdown").countdown2({
 *     value : data.easter_ends_at - ts_now,
 *     display : 'day_hr_min_sec'
 * });
 *
 */
(function() {
    'use strict';

    var created_countdowns = 0, // used to create unique ids for the countdowns
        interval = 1000; // our gametime is only exact to the second, so this is basically a fix value

    /**
     * Converts value to some various strings
     *
     * @param {Number} value     value which will be converted
     * @param {String} display   determinates which function will be used
     *                                to convert the number
     */
    function convertSeconds(value, display, only_non_zero) {
        var sec_to_display = Math.max(value, 0);

        switch (display) {
            case 'day_hr_min_sec':
                return day_hr_min_sec(sec_to_display, only_non_zero);
            case 'day_hr_min':
                return day_hr_min_sec(sec_to_display, only_non_zero, {
                    with_seconds: false
                });
            case 'readable_seconds':
                return DateHelper.readableSeconds(sec_to_display, false);
            case 'readable_seconds_with_days':
                return DateHelper.readableSeconds(sec_to_display, true, only_non_zero);
            case 'readable_unix_timestamp':
                return readableUnixTimestamp(sec_to_display, 'player_timezone');
            case 'event':
                return DateHelper.seconds_in_last48_hours(sec_to_display);
            case 'seconds_in_last48_hours_with_left_word':
                return DateHelper.seconds_in_last48_hours(sec_to_display, true);
            default:
                return value;
        }
    }

    function bindTooltip(data, $el) {
        //Get tooltip
        var tooltip_data = data,
            tooltip = null;

        //If button is disabled, and if tooltip should be hidden
        if (tooltip_data && (tooltip_data.hide_when_disabled || !tooltip_data.title)) {
            return;
        }

        tooltip = new MousePopup(tooltip_data.title, tooltip_data.styles);
        $el.mousePopup(tooltip);
    }

    function CD($element, value_arg, real_value, condition, display, parent, timestamp_end, only_non_zero, tooltip, name) {
        var value = timestamp_end ? timestamp_end - Timestamp.now() : value_arg;

        this.uid = !name ? 'countdown3_' + (++created_countdowns) : name;

        this.$el = $element;
        this.setValue(value);
        this.real_value = real_value;
        this.setCondition(condition);
        this.display = display || 'readable_seconds';
        this.parent = parent;
        this.timestamp_end = timestamp_end || this.timestamp_end; // this.timestamp_end may already be set from this.setValue()
        this.only_non_zero = only_non_zero;
        this.tooltip = tooltip;
    }

    /**
     * Update the countdown to a specific value, and thus changing the end date of it
     */
    CD.prototype.setValue = function(value) {
        if (value >= 0) {
            this.timestamp_end = Timestamp.server() + value;
            this.value = value;

            TM.unregister(this.uid);
            TM.register(this.uid, interval, this.tick.bind(this.$el), {
                timestamp_end: this.timestamp_end
            });
        }
    };

    CD.prototype.tick = function() {
        var new_value = Math.max(0, this.timestamp_end - Timestamp.server());

        this.value = new_value;

        if (new_value >= 0) {
            //Update HTML node
            this.$el.html(convertSeconds(new_value, this.display, this.only_non_zero));

            //Trigger an event
            this.$el.trigger('cd:each', [new_value, this.parent]);

            //Event which is triggered every time when condition is true
            if (this.condition && this.condition(new_value)) {
                this.$el.trigger('cd:condition', [new_value, this.parent]);
            }

            //Correctly it should be (new_value === 0), but there can be strange situations where this value can be negative
            if (new_value <= 0) {
                this._onEnd();
            }
        }
    };

    CD.prototype._onEnd = function() {
        // in the past we did trigger this a second later, but that makes no sense. If something will happen in 0 seconds, it will happen now!
        this.$el.trigger('cd:finish', [-1, this.parent]);
        this.destroy();
    };

    CD.prototype.destroy = function() {
        TM.unregister(this.uid);
        this.$el.off();
    };

    CD.prototype.setCondition = function(condition) {
        if (typeof condition !== 'function' && condition !== undefined && condition !== null) {
            throw 'The condition of a countdown has to be undefined or a function!';
        }

        this.condition = (typeof condition === 'function' ? condition : undefined);
    };

    CD.prototype.getValue = function() {
        return this.value;
    };

    /**
     * Returns id specified on the root node of the component
     *
     * @return {String}
     */
    CD.prototype.getId = function() {
        return this.$el.attr('id');
    };

    $.fn.countdown2 = function(params) {
        var cd = new CD(
            this,
            params.value,
            params.real_value,
            params.condition,
            params.display,
            params.parent,
            params.timestamp_end,
            params.only_non_zero,
            params.tooltip,
            params.name
        );

        us.extend(this, cd);

        if (this.tooltip) {
            bindTooltip.call(this, this.tooltip, this.$el);
        }

        return this;
    };
}());