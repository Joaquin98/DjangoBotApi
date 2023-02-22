/* global GrepolisModel, DeltaProperty, Timestamp */
(function() {
    'use strict';

    /**
     * Parent class for all orders, e.g. Unit, Building and Research order
     *
     * @class Order
     * @constructor
     */
    var Order = function() {};

    Order.defaults = {
        parts_done: 0
    };

    GrepolisModel.addAttributeReader(Order, 'units_left');

    function hasImmediateChangeMethod(lastTriggeredVirtualPropertyValue, currentValue) {
        return Math.abs((Math.round(lastTriggeredVirtualPropertyValue) - Math.round(currentValue))) >= 1.0;
    }

    /**
     * @param {Object} propertyCalculationResults
     *   @param {Number} propertyCalculationResults.rate
     *   @param {Number} propertyCalculationResults.propertyBaseValue Will be 0 zero every time here
     *   @param {Number} propertyCalculationResults.lastPropertyBaseValueUpdate Will be started_at every time here
     *   @param {Number} propertyCalculationResults.currentValue
     *
     * @return {integer} in seconds
     */
    function nextChangeIn(propertyCalculationResults) {
        var missing_of_current_part = 1 - (propertyCalculationResults.unprocessedCurrentValue % 1);

        return missing_of_current_part / propertyCalculationResults.rate;
    }

    function roundDownPartFractions(parts) {
        return parseInt(parts, 10);
    }

    Order.initialize = function() {
        this.parts_done_delta_property = new DeltaProperty(
            'parts_done',
            this, {
                rateMethod: 'getPartBuildPerSecond',
                lastPropertyBaseValueTimestampMethod: 'getStartedAt',
                nextChangeInMethod: nextChangeIn,
                hasImmediateChangeMethod: hasImmediateChangeMethod,
                valuePostProcessor: roundDownPartFractions
            }
        );

        this.on('change:units:left change:created_at change:to_be_completed_at', this.parts_done_delta_property.calculateAndTriggerVirtualProperty.bind(this.parts_done_delta_property, false));
    };

    Order.isDone = function() {
        return this.countPartsLeft() === 0;
    };

    /**
     * The amount of parts this order should produce. Default implementation returns 1, so that it
     * can be used easily for orders which only ever build one thing.
     *
     * @method countParts
     * @return {Integer}
     */
    Order.countParts = function() {
        return 1;
    };

    Order.countPartsLeft = function() {
        //Limit it to 0 because of: GP-13171
        return Math.max(0, this.countParts() - this.countPartsDone());
    };

    Order.isDemonDisabled = function() {
        //If deamon does not work properly then number is negative: GP-13171
        return this.countParts() - this.countPartsDone() < 0;
    };

    Order.countPartsDone = function() {
        // sometimes the delta_property can be undefined or even null, this is was sentry tells us GP-17557
        // in this case, return at least gracefully
        // The reason seems to be this code is still run after den model got deleted, and will vanish as soon
        // as somebody gets rid of delta_properties
        if (!this.parts_done_delta_property) {
            return 0;
        }
        return parseInt(Math.floor(this.parts_done_delta_property.currentValue()), 10);
    };

    Order.getStartedAt = function() {
        return this.get('created_at');
    };

    Order.getTimeLeft = function() {
        return this.getCompletedAt() - Math.max(Timestamp.server(), this.getStartedAt());
    };

    Order.getRealTimeLeft = function() {
        return this.getTimeLeft();
    };

    Order.getCompletedAt = function() {
        return this.get('to_be_completed_at');
    };

    Order.getBuildTime = function() {
        return this.getCompletedAt() - this.getStartedAt();
    };

    Order.getBuildTimePerPart = function() {
        return this.getBuildTime() / this.countParts();
    };

    Order.getPartBuildPerSecond = function() {
        var build_time_per_part = this.getBuildTimePerPart();

        //When order is instantly bought, the build time is 0, which leads to use Infinity in calculations (1/0 -> Infinity) which breaks timers
        if (build_time_per_part === 0) {
            return 1;
        }

        return 1 / build_time_per_part;
    };

    /**
     * Cancels the order
     */
    Order.cancelOrder = function(callbacks) {
        this.execute('cancel', {
            id: this.id
        }, callbacks);
    };

    /**
     * Uses premium feature to reduct time of the order
     */
    Order.buildTimeReduct = function(callbacks) {
        this.execute('speedUpForGold', {
            id: this.id
        }, callbacks);
    };

    Order.onPartsDoneChange = function(callback, context) {
        this.on('change:parts_done', callback, context);
    };

    Order.offPartsDoneChange = function(callback, context) {
        this.off('change:parts_done', callback, context);
    };

    Order.onDone = function(callback, context) {
        this.on('change:order_done', callback, context);
    };

    Order.bindPartsDone = function() {
        this.onPartsDoneChange(this._triggerOrderDoneIfDone, this);
    };

    Order.removePartsDone = function() {
        this.offPartsDoneChange(this._triggerOrderDoneIfDone, this);
    };

    Order._getType = function() {
        var order_type_matches = /(\w+)Order/.exec(this.urlRoot),
            order_type = order_type_matches && order_type_matches[1].snakeCase();

        return this.get(order_type + '_type');
    };

    Order._triggerOrderDoneIfDone = function(model, value, options) {
        if (this.isDone()) {
            model.changed = {
                order_done: true
            };
            this.trigger('change:order_done', model, true);
        }
    };

    Order.externalTrigger = {
        'change:order_done': {
            bind: 'bindPartsDone',
            remove: 'removePartsDone'
        }
    };

    Order.finalize = function() {
        this.off();
        this.parts_done_delta_property.clearTimeout();
        this.parts_done_delta_property = null;
    };

    window.GameModels.Order = GrepolisModel.extend(Order);
}());