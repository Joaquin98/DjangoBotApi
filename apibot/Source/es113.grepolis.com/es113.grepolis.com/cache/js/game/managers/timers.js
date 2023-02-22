/*globals isNumber, Game, us */

define('managers/timers', function() {
    'use strict';

    var RBTree = require('misc/rbtree');
    var Timestamp = require('misc/timestamp');
    var Logger = require('misc/logger');
    var DateHelper = require('helpers/date');

    var logger = Logger.get('TM');
    var unique_id_generation_index = 0; //This variable is used to generate unique name for the timer

    // for all delta_properties (resources, orders, unit recruiting) tick in this interval
    var FIXED_RESOURCE_TICK = 10000; // ms

    /**
     * Whenever the tab goes in the BG, we switch from requestAnimationFrame(raf) to setTimeout
     * This allows web-notifications to still work, since raf is paused by browsers.
     *
     * @see listeners/common.js
     */
    var BACKGROUND_TICK_INTERVAL = 3000; // ms

    /**
     * Helper class (and thus private) to the timer manager. A Listener wraps the callback given to the timer manager and manages
     * all its meta data, like execution interval and next time of execution.
     *
     * @class Listener
     * @constructor
     *
     * @param {String} id Used to identify function
     * @param {Integer} interval Milliseconds between executions
     * @param {Function} fn The function to be executed
     * @param {Object} [props]
     *   @param {Integer} [props.max] Number of times the callback should be executed. undefined, -1 or Infinity for infinit times
     *   @param {Integer} [props.timestamp_end] Servertime in seconds until which the function should be executed.
     *                                          The last possible execution is at exactly this time, but does not have to be!
     *   @param {Function} [props.ended_callback] callback function will be executed when this timer will not be executed anymore
     *
     * @property {String} id
     * @property {Integer} interval In milliseconds, time between executions
     * @property {Integer} execution_timestamp Next execution timestamp in milliseconds
     * @property {Function} callback
     * @property {Integer} execute_until Servertime in seconds
     */
    function L(id, interval, callback, props) {
        this.id = id;
        this.interval = interval;
        this.execution_timestamp = $.now();
        this.callback = callback;

        if (props) {
            this.execute_until = props.timestamp_end;
            this.executions_left = (!props.max || props.max === -1 || props.max === Infinity) ? undefined : props.max;
            if (this.executions_left) {
                this.execution_timestamp += interval;
            }
            this.ended_callback = props.ended_callback;
        }
    }

    L.prototype.getId = function() {
        return this.id;
    };

    L.prototype.hasEnded = function() {
        return this.executions_left <= 0 || (this.execute_until && Timestamp.server() > this.execute_until);
    };

    /**
     * executes the wrapped callback and implements the change-interval feature of the timer manager:
     * A callback can return a number, that will be treated as the new interval for the listener afterwards. If the listener
     * was in his last execution and it still returns a number, it will be executed again (by choice of the implementor, this is a feature)
     */
    L.prototype.execute = function() {
        var new_interval = this.callback(this.executions_left);

        if (new_interval && isFinite(new_interval)) {
            if (this.executions_left <= 0) {
                // if executions left was zero, but the callback still returned a new interval, then we assume it want's to run once more!
                this.executions_left = 1;
            }
            this.interval = new_interval;
        }
    };

    L.prototype.executeEndedCallback = function() {
        if (typeof this.ended_callback === 'function') {
            this.ended_callback();
        }
    };

    L.prototype.tick = function(now) {
        if (this.executions_left) {
            --this.executions_left;
        }

        if (Game.dev) {
            this.execute();
        } else {
            try {
                this.execute();
            } catch (e) {
                logger.log(e);
            }
        }

        do {
            // this prevents the job from beeing executed in the same tick again
            this.execution_timestamp += this.interval;
        } while (this.execution_timestamp <= now && !this.hasEnded() && this.interval > 0);
    };

    /**
     * Set the interval of this listener to a new one. The difference in the old to the new interval will be
     * substract from the time-to-be-executed-the-next-time.
     *
     * do not call this method during object construction!
     */
    L.prototype.updateInterval = function(interval) {
        var diff = this.interval - interval;

        this.interval = interval;

        this.execution_timestamp -= diff;
    };

    L.prototype.toString = function() {
        return '"' + this.id + '"' + (this.executions_left > 0 ?
            (' (left execution count: ' + this.executions_left + ',') :
            (this.execute_until === undefined ?
                ' (Infinite loop, ' :
                ' (execute until ' + window.readableUnixTimestamp(parseInt(this.execute_until, 10)) +
                ', ends in ' + DateHelper.readableSeconds(this.execute_until - Timestamp.server()) + ','
            )
        ) + 'next time in ' + DateHelper.readableSeconds((this.execution_timestamp - $.now()) / 1000, false, false, true);
    };

    /**
     * used in the listener queue, to sort the listeners by next execution time
     */
    L.comparator = function(a, b) {
        var result,
            pos = 0;

        if ((result = (a.execution_timestamp - b.execution_timestamp)) === 0 && a.id !== b.id) {
            while ((result = (a.id.toString().charCodeAt(pos) - b.id.toString().charCodeAt(pos))) === 0) {
                ++pos;
            }
            if (isNaN(result)) {
                return isNaN(a.id.toString().charCodeAt(pos)) ? -1 : 1;
            }
        }

        return result;
    };

    /**
     * timer manager using the jquery animation ticks, which are bound to requestAnimationFrames (if supported)
     *
     * There are a few tricks it does offer in addition to just beeing a new setInterval and setTimeout:
     * - during listener execution there are two global variables set, window.animationFrameStartTimestamp and
     *   window.animationFrameStartServertime see jquery.requestAnimationFrame.js for more informatiosn about those
     * - callbacks can return integers which are then taken as new interval for that listener, making it possible
     *   to change the execution speed of one listener without unregister and registering it by hand.
     *
     * About the implementation. Because of the way the tick method works (taking from the queue, executing, putting
     * it back in the queue afterwards) it would normally not be possible to manipulate listeners that are 'active'
     * in the current tick. To make it possible the three operations register, unregister and update are stashed
     * while the tick is running and all executed in the order they were called afterwards.
     *
     * @class TimersManager
     * @constructor
     */
    function TM() {
        this.createQueue();
        this.lookup = {};
        this.operationStash = [];

        this._makeOperationsSync();

        this._tick = this._tick.bind(this);
        $.fx.timer(this._tick);

        // state variables used for the generic 10sec resource tick
        this.resource_timer_id = this.generateUniqueId('resource_tick');
        this.register(this.resource_timer_id, FIXED_RESOURCE_TICK, this._tickResourceCallbacks.bind(this));
        this.resourceCallbacks = {};
    }

    /**
     * Registers a function which will be executed every certain amount of time. Optionally there can be an amount of executions be given,
     * or a servertime at which the executions should end.
     * If no amount of executions is given, the callback will be executed the first time during the next tick. If there is there is one given
     * the execution will happen the first time in 'interval' milliseconds.
     *
     * CAUTION!! Be aware of the following shortcoming of the current implementation: Do not use
     * TM.register('my-timeout', 6000, myFunc, {execute_until: Timestamp.now() + 6000});
     * as a replacement for setTimeout(). The intent for something like the line above may be, that the callback should be executed exactly
     * at now + 6 seconds. But because Timestamp.now() is subjected to variation the callback may never be executed.
     * Example:
     * Above call is done at realtime: 104000 and timestamp 202000.
     * The listener will store, that it should execute the next time at realtime 110000, but only if timestamp 208000 hasn't passed yet.
     * In that scenario, if during TM.register call the timestamp was going late (eg. timestamp was 202000, but realtime on the server was 204000)
     * and later on the timestamps syncs up to the correct time, then in 6 real seconds 6.2 timestamp seconds would have passed and as a result the
     * callback would've never be called.
     *
     * The easiest, currently possibel way to implement a callback for that would be:
     * function doAtTime() {
     *     if (window.animationFrameStartServertime >= time_to_execute_at) {
     *         doStuff();
     *         return false;
     *     } else {
     *         return true;
     *     }
     * };
     * jQuery.fx.timer(doAtTime);
     *
     * @method register
     *
     * @param {String} id Used to identify function
     * @param {Integer} interval Milliseconds between executions
     * @param {Function} fn The function to be executed. Can return a number that is used as a new interval for further executions
     * @param {Object} [props]
     *   @param {Integer} [props.max] Number of times the callback should be executed. undefined, -1 or Infinity for infinit times
     *   @param {Integer} [props.timestamp_end] Servertime in seconds until which the function should be executed.
     *                                          The last possible execution is at exactly this time, but does not have to be!
     *   @param {Function} [props.ended_callback] callback function will be executed when this timer will not be executed anymore
     */
    TM.prototype._registerSync = function(id, interval, fn, props) {
        logger.log('TM.register(', id, interval, props, ')');

        this._validateTimer(id, interval, fn, props);

        var listener = new L(id, interval, fn, props);

        this.lookup[id] = listener;
        this.addListener(listener);
    };

    TM.prototype._registerAsync = function(id, interval, fn, props) {

        if (!isNumber(interval)) {
            if (Game.dev) {
                throw 'Timer registered with invalid interval';
            }
            // ignore timer requests with wrong interval
            return;
        }
        this._stashOperation(this._registerSync, arguments);
    };

    TM.prototype._validateTimer = function(id, interval, fn, props) {
        if (this.lookup[id] !== undefined) {
            throw 'Timer ID has to be unique';
        }

        if (typeof(fn) !== 'function') {
            throw 'Timer callback must be valid function';
        }

        if (!us.isNumber(interval) || us.isNaN(interval) || !us.isFinite(interval)) {
            throw 'Timer interval should be a sane, finite number, got ' + interval;
        }
    };

    /**
     * Like register but only fired once, does an automatic unregister
     *
     * @param {string} id
     * @param {number} timeout
     * @param {callback} fn
     * @return {void}
     */
    TM.prototype.once = function(id, timeout, fn) {
        this.unregister(id);
        this.register(id, timeout, fn, {
            max: 1
        });
    };

    /**
     * Unregisters function
     *
     * @param {String} id Timer identifier
     * @param {Integer} [interval] The interval the timer was registered with. Nothing will happen if this is given but the timer
     *                            matching the id does not have this exact interval
     */
    TM.prototype._unregisterSync = function(id) {
        var listener = this.lookup[id];

        if (listener) {
            logger.log('TM.unregister(', id, ')');
            delete this.lookup[id];
            this.removeListener(listener);
        } else {
            logger.log('TM.unregister(', id, ') tried, but was not registered!');
        }
    };

    TM.prototype._unregisterAsync = function(id) {
        this._stashOperation(this._unregisterSync, arguments);
    };

    /**
     * For an event changes the interval to the given amount
     *
     * @param {String} id
     * @param {int} interval
     */
    TM.prototype._updateSync = function(id, interval) {
        var listener = this.lookup[id];

        if (listener) {
            logger.log('TM.update(', id, interval, ')');
            this.removeListener(listener);
            listener.updateInterval(interval);
            this.addListener(listener);
        }
    };

    TM.prototype._updateAsync = function(id, interval) {
        this._stashOperation(this._updateSync, arguments);
    };

    /**
     * Checks if timer with given ID is already registered.
     *
     * @param {String} id   unique timer id
     *
     * @return {Object|Boolean}
     */
    TM.prototype.exists = function(id) {
        return this.lookup[id] !== undefined;
    };

    /**
     * Not needed anymore, is only here for legacy compatibility
     *
     * @deprecated
     * @method getMaxInterval
     * @return {Integer}
     */
    TM.prototype.getMaxInterval = function() {
        return Number.MAX_VALUE;
    };

    /**
     * Its a helper function which displays registered intervals and functions
     */
    TM.prototype.showStatus = function(filter) {
        var listeners = [],
            listener_idx, listeners_length, listener,
            listeners_with_same_interval,
            listeners_hash = {},
            interval,
            l, count = 0;

        this.queue.each(function(l) {
            listeners.push(l);
        });

        listeners.sort(function(a, b) {
            return a.interval - b.interval;
        });

        listeners_length = listeners.length;
        for (listener_idx = 0; listener_idx < listeners_length; ++listener_idx) {
            listener = listeners[listener_idx];
            listeners_with_same_interval = listeners_hash[listener.interval];
            if (listeners_with_same_interval === undefined) {
                listeners_with_same_interval = listeners_hash[listener.interval] = new RBTree(L.comparator);
            }
            listeners_with_same_interval.insert(listener);
        }

        console.group('TIMERS MANAGER (Currently running timers)');

        for (interval in listeners_hash) {
            if (listeners_hash.hasOwnProperty(interval)) {
                count++;

                listeners_with_same_interval = listeners_hash[interval];
                l = listeners_with_same_interval.size;

                console.group('Timer with interval ' + interval + ' (' + Math.round((interval / 1000) * 100) / 100 +
                    's = ' + DateHelper.readableSeconds(interval / 1000, true) + ') (' + l + '):');
                listeners_with_same_interval.each(function(l) {
                    if (filter) {
                        if ((l.getId() || '').indexOf(filter) > -1) {
                            console.log(l.toString());
                        }
                    } else {
                        console.log(l.toString());
                    }
                }); // jshint ignore:line

                console.groupEnd();
            }
        }

        if (count === 0) {
            console.log('None');
        }

        console.groupEnd();

        return false; // never run again
    };

    TM.prototype._tick = function() {
        var timestamp = $.now(),
            next_queued_listener,
            ticked_listeners = [],
            ticked_listener_idx, ticked_listeners_length, ticked_listener;

        this._makeOperationsAsync();

        while ((next_queued_listener = this.getFirstListener()) && next_queued_listener.execution_timestamp <= timestamp) {
            this.removeListener(next_queued_listener);
            next_queued_listener.tick(timestamp);
            if (!next_queued_listener.hasEnded()) {
                ticked_listeners.push(next_queued_listener);
            } else {
                next_queued_listener.executeEndedCallback();
                delete this.lookup[next_queued_listener.id];

                logger.log('TM listener ended:', next_queued_listener.id);
            }
        }

        ticked_listeners_length = ticked_listeners.length;
        for (ticked_listener_idx = 0; ticked_listener_idx < ticked_listeners_length; ++ticked_listener_idx) {
            ticked_listener = ticked_listeners[ticked_listener_idx];

            this.addListener(ticked_listener);
        }

        this._executeStashedOperations();
        this._makeOperationsSync();

        return true; // always run
    };

    TM.prototype._makeOperationsAsync = function() {
        this.register = this._registerAsync;
        this.unregister = this._unregisterAsync;
        this.update = this._updateAsync;
    };

    TM.prototype._stashOperation = function(operation, args) {
        var bind_args = [this];
        bind_args.push.apply(bind_args, args);

        this.operationStash.push(operation.bind.apply(operation, bind_args));
    };

    TM.prototype._executeStashedOperations = function() {
        var operation;

        while ((operation = this.operationStash.shift())) {
            operation();
        }
    };

    TM.prototype._makeOperationsSync = function() {
        this.register = this._registerSync;
        this.unregister = this._unregisterSync;
        this.update = this._updateSync;
        this.updateRuntime = this._updateRuntimeSync;
    };

    TM.prototype.createQueue = function() {
        this.queue = new RBTree(L.comparator);
    };

    TM.prototype.getFirstListener = function() {
        return this.queue.min();
    };

    TM.prototype.addListener = function(listener) {
        return this.queue.insert(listener);
    };

    TM.prototype.removeListener = function(listener) {
        return this.queue.remove(listener);
    };

    TM.prototype.size = function() {
        return this.queue.size;
    };

    TM.prototype.generateUniqueId = function(timer_name) {
        return timer_name + '_' + (unique_id_generation_index++);
    };

    /**
     * resource Timers are used from delta_properties to update
     * resources, units recruiting and other stuff every 10 secs (fixed)
     * This reduces workload on the TM to deal with hundreds of timers (for many towns)
     * every 10 seconds
     *
     * It registers 1 timer that uses as object {} as registry for callback
     */

    /**
     * add a resource timer callback to the resourceCallback {}
     * @param {string} uid
     * @param {function} callback
     */
    TM.prototype.addToResourceTimer = function(uid, callback) {
        this.resourceCallbacks[uid] = callback;
    };

    /**
     * ticks the resources which are registered
     * @param {number} executions_left see class 'L' in this file
     */
    TM.prototype._tickResourceCallbacks = function(executions_left) {
        us.each(this.resourceCallbacks, function(callback, uid) {
            callback(executions_left);
        });
    };

    /**
     * remove a registered timer
     * @param {string} uid
     */
    TM.prototype.removeFromResourceTimer = function(uid) {
        if (this.resourceCallbacks[uid]) {
            delete this.resourceCallbacks[uid];
        }
    };

    /**
     * true, if a uid has a registered callback (not undefined)
     * @param {string} uid
     */
    TM.prototype.hasResourceTimerId = function(uid) {
        return this.resourceCallbacks && typeof this.resourceCallbacks[uid] !== 'undefined';
    };

    TM.prototype.useSystemTimer = function(system_timer) {
        if (system_timer) {
            this.sytem_timer_id = window.setInterval(this._tick, BACKGROUND_TICK_INTERVAL);
        } else {
            window.clearInterval(this.sytem_timer_id);
        }
    };

    window.TimersManager = TM;

    return TM;
});