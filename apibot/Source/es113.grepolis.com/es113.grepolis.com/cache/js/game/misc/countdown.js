/* global GPLayout, Timestamp, DateHelper, day_hr_min_sec, readableUnixTimestamp, Layout */

(function() {
    'use strict';

    function extendLayoutWithCountdown() {
        GPLayout.prototype.Countdown = (function() {
            var timer = null,
                interval = 250,
                queue = []; // elem queue

            /**
             * Starts the Timer.
             */
            function start() {
                timer = window.setInterval(tick, interval);
            }
            /**
             * Stops the Timer.
             */
            function stop() {
                window.clearInterval(timer = null);
            }

            // tick function
            function tick() {
                var i = queue.length,
                    item, up, elm, until, diff, seconds, disp_func,
                    time_server = Timestamp.server(),
                    $elm;
                if (time_server === 0) {
                    return;
                }

                while (i--) {
                    item = queue[i];
                    elm = item[0];
                    until = item[1]; // increasing counter (up) -> until = base time
                    up = item[2];
                    disp_func = item[3];

                    $elm = $(elm);

                    diff = (up ? until + time_server : until - time_server);
                    seconds = Math.round(diff);

                    //if referenced element is still there and has time left, tick it ...
                    if (elm && seconds >= 0) {
                        if (!$elm.is(':visible')) {
                            continue;
                        }

                        switch (up) {
                            case false:
                                //normal countdown
                                switch (disp_func) {
                                    case 'day_hr_min_sec':
                                        elm.innerHTML = day_hr_min_sec(Math.max(seconds, 0));
                                        break;
                                    case 'readable_seconds_with_days':
                                        elm.innerHTML = DateHelper.readableSeconds(Math.max(seconds, 0), true);
                                        break;
                                    default:
                                        elm.innerHTML = DateHelper.readableSeconds(Math.max(seconds, 0));
                                        break;
                                }

                                break;
                            case true:
                                // update time, Date() takes ms instead of s
                                elm.innerHTML = '~' + readableUnixTimestamp(seconds, 'player_timezone');
                                break;
                        }
                    } else {
                        // ... otherwise dispatch finish-event if necessary, ...
                        if (seconds < 0 && elm) {
                            //@todo use namespace for this event
                            $elm.trigger('finish');
                        }
                        // call callback:
                        if (typeof item[3] === 'function') {
                            item[3]();
                        }

                        // .. remove it from queue...
                        queue.remove(i);
                        // ... and check the remaining elements & stop timer if necessary
                        if (!queue.length) {
                            stop();
                        }
                    }
                }
            }

            this.autoClean = function() {
                var i = queue.length,
                    elem;
                while (i--) {
                    elem = queue[i][0];
                    // find out if node is still inside document
                    while (elem !== document && (elem = elem.parentNode)) {}

                    if (elem !== document) {
                        queue.remove(i);
                    }
                }
            };

            /**
             * Adds an element to the countdown queue
             *
             * @param elm HTMLElement where the countdown should be displayed
             * @param ts Number Timestamp when countdown should be finished
             * @param up Boolean count up instead of down
             * @param callback Function optional callback function, called upon finish
             *
             */
            this.addElem = function(elm, ts, up, callback, options) {
                if (!timer) {
                    start();
                }
                // check if element is already in queue (only for updateTime-elements
                // element is probably at the end of the queue, so we start at the end:
                if (up) {
                    var i = queue.length;
                    while (i--) {
                        // if elm is there -> update time
                        if (queue[i][0] === elm) {
                            return (queue[i][1] = ts);
                        }
                    }
                }
                // push element, timestamp and maybe callback function into array
                var array = [elm, ts, up, options];
                queue.push(callback ? array.push(callback) : array);
            };

            this.removeElem = function(elm) {
                var i = queue.length;

                while (i--) {
                    // if elm is there -> update time
                    if (queue[i][0] === elm) {
                        //Its imporant to make a reversed loop
                        queue.splice(i, 1);
                    }
                }
            };

            this.tick = function() {
                tick();
            };

            return this;
        }.call({}));
    }

    /**
     * Creates a countdown timer from a jQuery object.
     *
     * $(<selector>).countdown({params});
     *
     * @param until Timestamp when countdown should be finished (if not set, content of element is parsed and used as Timestamp)
     * @param options Object
     */
    jQuery.fn.countdown = function(until, options) {
        options = options || {};

        //check if GPLayout has Countdown object
        if (!Layout.Countdown) {
            extendLayoutWithCountdown();
        }

        var f = (options.callback && typeof options.callback === 'function') ? options.callback : null;

        if (!options.use_external_timer) {
            this.each(function() {
                // If timestamp was not given, extract timestamp from innerHTML
                if (!until) {
                    until = parseInt(this.innerHTML, 10);
                }

                // register this element to countdown element queue
                Layout.Countdown.addElem(this, until, false, f, options.display_function);
            });
        }

        this.destroy = function() {
            Layout.Countdown.removeElem(this[0]);
        };

        return this;
    };

    /**
     * updates duration time displays etc.
     * @param offset Number
     */
    jQuery.fn.updateTime = function(offset) {
        var length = this.length;
        //check if GPLayout has Countdown object
        if (!Layout.Countdown) {
            extendLayoutWithCountdown();
        }

        this.each(function() {
            if (length > 1 || !offset) {
                offset = parseInt(this.innerHTML, 10);
            }

            // register this element to countdown element queue
            Layout.Countdown.addElem(this, offset, true);
        });
        return this;
    };
}());