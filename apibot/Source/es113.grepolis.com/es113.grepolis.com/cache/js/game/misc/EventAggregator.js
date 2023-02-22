/*global jQuery, GameEvents */
(function($, events) {
    "use strict";

    /**
     * @return void
     */
    function unsubscribeFromEvents() {
        //Unsubscribe all observed events
        $.Observer().unsubscribe(this.context);
    }

    /**
     *
     * @return boolean
     */
    function isAggregateComplete() {
        var i,
            complete = true,
            length_aggregate_parts = this.aggregate_parts.length;
        for (i = 0; i < length_aggregate_parts; i++) {
            if (!this.aggregate_parts[i].triggered) {
                complete = false;
                break;
            }
        }
        return complete;
    }

    /**
     * @return void
     */
    function checkAggregateStatus() {
        var aggregate;
        if (isAggregateComplete.call(this)) {
            if (this.options.build_aggregate_callback && typeof this.options.build_aggregate_callback === 'function') {
                aggregate = this.options.build_aggregate_callback(this.aggregate_parts);
            }
            triggerAggregateEvent.call(this, aggregate);
            if (this.options.auto_reset) {
                this.reset();
            } else {
                this.destroy();
            }
        }
    }

    /**
     *
     * @param object aggregate
     * @return void
     */
    function triggerAggregateEvent(aggregate) {
        if (this.options.debug) {
            debug('Trigger aggregate', this.aggregate_event, aggregate);
        }

        unsubscribeFromEvents.call(this);
        TM.once(this.context, 10, function() {
            $.Observer(this.aggregate_event).publish(aggregate);
        }.bind(this));
    }

    /**
     *
     * @param string event_name
     * @param object event_data
     * @return void
     */
    function eventTriggered(event_name, event_data) {
        var aggregate_part = findAggregatePart.call(this, event_name);

        if (aggregate_part !== false && (!this.options.ignore_multiple_events || aggregate_part.triggered === false)) {
            if (this.options.debug) {
                debug('Aggregate part received', event_name, event_data);
            }
            aggregate_part.triggered = true;
            aggregate_part.data = event_data;
            checkAggregateStatus.call(this);
        }
    }

    /**
     *
     * @param string event_name
     * @return object|boolean if nothing is found then false is returned, else the object found
     */
    function findAggregatePart(event_name) {
        var i,
            length_aggregate_parts = this.aggregate_parts.length;
        for (i = 0; i < length_aggregate_parts; i++) {
            if (this.aggregate_parts[i].event_name === event_name) {
                return this.aggregate_parts[i];
            }
        }
        return false;
    }

    /**
     *
     * @param string event_name
     * @return void
     */
    function addAggregatePart(event_name) {
        this.aggregate_parts.push({
            event_name: event_name,
            triggered: false,
            data: null
        });

        $.Observer(event_name).subscribe(this.context, function(event) {
            eventTriggered.call(this, event.type, event.data);
        }.bind(this));
    }

    /**
     *
     * @param string[] events
     * @return void
     */
    function addEvents(events) {
        var i,
            event_name,
            length_events = events.length;
        for (i = 0; i < length_events; i++) {
            event_name = events[i];

            if (typeof event_name !== 'string') {
                throw 'EventAggregator: Event must be a string';
            }

            if (findAggregatePart.call(this, event_name) === false) {
                addAggregatePart.call(this, event_name);
            }
        }
    }

    /**
     * The EventAggregator is useful if one thing as multiple not related dependencies to be met to be executed.
     * Example: The player must do N separate actions (order does not matter) and if he does so then an resulting action is triggered
     * This scenario would be implemented that each of the N actions trigger an event which the event aggregator is requiring and as a resulting action
     * is triggering a final event.
     *
     * @param string context  to identify the event context
     * @param string[] events this should be all the events the aggregator is listeneing for
     * @param string aggregate_event this is the event the aggregator will publish when all required events where received
     * @param object options e.g. {debug: <boolean> will verbose some stuff,
     * 								ignore_multiple_events: <boolean> will ignore multiple events of same type,
     * 								auto_reset: <boolean> will reset state of aggregator if one cycle is finished,
     * 								build_aggregate_callback: <function> possibility to define the data of the aggregate}
     * @constructor
     */
    window.EventAggregator = function(context, events, aggregate_event, options) {
        this.options = options || {};
        this.aggregate_parts = [];
        this.context = context;
        this.aggregate_event = aggregate_event;

        if (this.options.debug) {
            debug('Event Aggregator instanciated with', context, events, aggregate_event, options);
        }

        this.reset = function() {
            this.destroy();
            addEvents.call(this, events);
        };

        this.destroy = function() {
            this.aggregate_parts = [];
            unsubscribeFromEvents.call(this);
        };

        if (Object.prototype.toString.call(events) !== '[object Array]') {
            throw 'EventAggregator: Events must be an array containing strings';
        }

        if (typeof aggregate_event !== 'string') {
            throw 'EventAggregator: Aggregate event must be a string';
        }

        addEvents.call(this, events);
    };

}(jQuery, window.GameEvents));