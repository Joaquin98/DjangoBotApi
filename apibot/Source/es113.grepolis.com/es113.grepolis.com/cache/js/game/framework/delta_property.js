/* global isNumber, TM */
(function() {
    'use strict';

    var Timestamp = require('misc/timestamp');

    /**
     * @param {String} propertyName The property that is being simulated, for example wood
     * @param {GrepolisModel} model The model containing the propertyBaseValue and the lastPropertyBaseValueUpdate
     * @param {Object} callbacks
     *   @param {Function} callbacks.rateMethod The rate of change of the propertyBaseValue over time, per second
     *   @param {Function} callbacks.lastPropertyBaseValueTimestampMethod The servertime for the point in time when the propertyBaseValue was equal
     *                     to the virtualProperty
     *   @param {Function} callbacks.nextChangeInMethod Amount of seconds it will take until the delta_property should be updated the next time
     *   @param {Function} [callbacks.basePropertyMethod] The properties value from the backend, that is taken as the base for the calculation of the
     *                     virtual property. Defaults to 0, if not given
     *   @param {Function} [callbacks.hasImmediateChangeMethod] Defaults to false, which means the virtualProperty will never change on model changes
     *   @param {Function} [callbacks.valuePostProcessor] This method gets the currentValue passed and can process it before it is passed out
     *   @param {Function} [callbacks.onStart] When the delta property starts ticking. Gets this as argument
     *   @param {Function} [callbacks.onStop] When delta property gets stopped. Gets this as well
     * @param {Object} options
     *   @param {Integer} [options.minInterval] The shortest duration in milliseconds between two triggered changes. Unlimited if not set
     */
    function DP(propertyName, model, callbacks, options) {
        this.propertyName = propertyName;
        this.model = model;
        this.minInterval = options && options.minInterval;
        this.callbacks = callbacks;
        this.uid = 'delta_' + model.url() + '_' + propertyName;

        this.lastTriggeredVirtualPropertyChangeTimestamp = 0;
        this.lastTriggeredVirtualPropertyValue = this.getPropertyBaseValue();

        this.setExternalTriggerIfNotSet();
        this.calculateAndTriggerVirtualPropertyImmediateBound = this.calculateAndTriggerVirtualProperty.bind(this, true);
    }

    DP.prototype.setExternalTriggerIfNotSet = function() {
        var deltaPropertyMethodName = this.propertyName.camelCase() + 'DeltaProperty';

        if (typeof this.model['bind' + deltaPropertyMethodName] !== 'function') {
            this.model['bind' + deltaPropertyMethodName] = this.bindModelsExternalTrigger.bind(this);
            this.model['remove' + deltaPropertyMethodName] = this.removeModelsExternalTrigger.bind(this);

        }

        if (!this.model.externalTrigger) {
            this.model.externalTrigger = {};
        }

        if (this.model.externalTrigger['change' + deltaPropertyMethodName]) {
            if (this.model.externalTrigger['change' + deltaPropertyMethodName].bind !== 'bind' + deltaPropertyMethodName ||
                this.model.externalTrigger['change' + deltaPropertyMethodName].remove !== 'remove' + deltaPropertyMethodName) {
                throw 'The models externalTrigger for the virtual property ' + deltaPropertyMethodName + ' is already set to something else!';
            }
        }

        this.model.externalTrigger['change' + deltaPropertyMethodName] = {
            bind: 'bind' + deltaPropertyMethodName,
            remove: 'remove' + deltaPropertyMethodName
        };
    };

    DP.prototype.bindModelsExternalTrigger = function() {
        this.callCallback('onStart', null, this);
        //this.calculateAndTriggerVirtualProperty(false);
        this.addTimeout();
    };

    DP.prototype.removeModelsExternalTrigger = function() {
        this.clearTimeout();
        this.callCallback('onStop', null, this);
    };

    DP.prototype.calculateAndTriggerVirtualProperty = function(timeoutTriggeredImmediateChange) {
        var propertyCalculationResults = this.calculateCurrentValue(),
            currentValue = propertyCalculationResults.currentValue,
            hasImmediateChange = timeoutTriggeredImmediateChange || this.hasImmediateChange(currentValue),
            nextChangeUnlimitedIn = this.getNextChangeUnlimitedIn(propertyCalculationResults) * 1000.0,
            milliSecondsSinceLastTriggeredVirtualPropertyChange,
            nextChangeIn,
            now = $.now();

        if (this.minInterval) {
            if (this.lastTriggeredVirtualPropertyChangeTimestamp && !timeoutTriggeredImmediateChange) {
                milliSecondsSinceLastTriggeredVirtualPropertyChange = (now - this.lastTriggeredVirtualPropertyChangeTimestamp);
                nextChangeIn = parseInt(Math.max(this.minInterval - milliSecondsSinceLastTriggeredVirtualPropertyChange, nextChangeUnlimitedIn), 10);
            } else {
                nextChangeIn = parseInt(Math.max(this.minInterval, nextChangeUnlimitedIn), 10);
            }
        } else {
            nextChangeIn = parseInt(nextChangeUnlimitedIn, 10);
        }

        if (!hasImmediateChange) {
            if (timeoutTriggeredImmediateChange) {
                this.lastTriggeredVirtualPropertyChangeTimestamp = now; // carefull, is in milliseconds
            } else {
                this.lastTriggeredVirtualPropertyChangeTimestamp = undefined;
            }
        }

        //if (this.propertyName === 'parts_done') {
        //	console.group('DeltaProperty.calculateAndTriggerVirtualProperty:', this.propertyName, this.model.urlRoot, this.model.id);
        //	console.log('propertyName', this.propertyName)
        //	console.log('model', this.model);
        //	console.log('minInterval', this.minInterval);
        //	console.log('propertyCalculationResults', propertyCalculationResults);
        //	console.log('hasImmediateChange', hasImmediateChange);
        //	console.log('nextChangeUnlimitedIn', nextChangeUnlimitedIn);
        //	console.log('milliSecondsSinceLastTriggeredVirtualPropertyChange', milliSecondsSinceLastTriggeredVirtualPropertyChange);
        //	console.log('nextChangeIn', nextChangeIn);
        //	console.log('timeoutTriggeredImmediateChange', timeoutTriggeredImmediateChange);
        //	console.groupEnd();
        //}

        this.triggerVirtualPropertyChange(currentValue, {
            silent: !hasImmediateChange
        });

        if (this.checkTimeout(this.uid)) {
            if (timeoutTriggeredImmediateChange) {
                // the case if we already are running with this property, and are called from the TM
                if (isNumber(nextChangeIn)) {
                    return nextChangeIn;
                } else {
                    this.clearTimeout();
                }
            } else {
                // this case will happen, if this property is not yet registered, or we are called from
                // outside the TM scope
                this.clearTimeout();
                this.addTimeout(nextChangeIn);
            }
        } else if (isNumber(nextChangeIn)) {
            // this case will happen, if this property is not yet registered
            this.addTimeout(nextChangeIn);
        } else {
            this.clearTimeout();
        }
    };

    DP.prototype.calculateCurrentValue = function() {
        var rate = this.getRate(),
            propertyBaseValue = this.getPropertyBaseValue(),
            lastPropertyBaseValueUpdate = this.getLastPropertyBaseValueTimestamp(),
            unprocessedCurrentValue = propertyBaseValue + (rate * (Timestamp.server() - lastPropertyBaseValueUpdate)),
            currentValue = this.postProcessValue(unprocessedCurrentValue);

        //if (this.propertyName === 'wood') {
        //	console.group('DeltaProperty.calculateCurrentValue:', this.propertyName, this.model.urlRoot, this.model.id);
        //	console.log('rate', rate);
        //	console.log('propertyBaseValue', propertyBaseValue);
        //	console.log('lastPropertyBaseValueUpdate', lastPropertyBaseValueUpdate);
        //	console.log('unprocessedCurrentValue', unprocessedCurrentValue);
        //	console.log('currentValue', currentValue);
        //	console.groupEnd();
        //}

        return {
            rate: rate,
            propertyBaseValue: propertyBaseValue,
            lastPropertyBaseValueUpdate: lastPropertyBaseValueUpdate,
            unprocessedCurrentValue: unprocessedCurrentValue,
            currentValue: currentValue
        };
    };

    DP.prototype.currentValue = function() {
        return this.calculateCurrentValue().currentValue;
    };

    DP.prototype.postProcessValue = function(value) {
        return this.callCallback('valuePostProcessor', value, value);
    };

    /**
     * @return {number} property change per second
     */
    DP.prototype.getRate = function() {
        if (this.getLastPropertyBaseValueTimestamp() > Timestamp.server()) {
            return 0;
        }

        return this.callCallback('rateMethod');
    };

    DP.prototype.getPropertyBaseValue = function() {
        return this.callCallback('basePropertyMethod', 0);
    };

    DP.prototype.getLastPropertyBaseValueTimestamp = function() {
        return this.callCallback('lastPropertyBaseValueTimestampMethod');
    };

    DP.prototype.hasImmediateChange = function(currentValue) {
        return this.callCallback('hasImmediateChangeMethod', false, this.lastTriggeredVirtualPropertyValue, currentValue);
    };

    /**
     * @param {Object} propertyCalculationResults
     *   @param {Number} propertyCalculationResults.rate
     *   @param {Number} propertyCalculationResults.propertyBaseValue
     *   @param {Number} propertyCalculationResults.lastPropertyBaseValueUpdate
     *   @param {Number} propertyCalculationResults.currentValue
     *
     * @return {integer} in seconds
     */
    DP.prototype.getNextChangeUnlimitedIn = function(propertyCalculationResults) {
        return this.callCallback('nextChangeInMethod', 'error', propertyCalculationResults);
    };

    /**
     * Calls one of the passed callbacks, id'ed by the name. The second argument can be used as a default return value, if the
     * callback doesn't exist. If the callback receives arguments, they can be passed as thrid, fourth, fifth etc. argument
     *
     * @private
     * @method callCallback
     *
     * @param {String} name
     * @param {ambiguous} value_if_not_existing
     */
    DP.prototype.callCallback = function(name, value_if_not_existing) {
        var callback = this.callbacks[name],
            callback_arguments = Array.prototype.slice.call(arguments, 2);

        if (typeof callback === 'string') {
            return this.model[callback].apply(this.model, callback_arguments);
        } else if (typeof callback === 'function') {
            return callback.apply(this.model, callback_arguments);
        } else {
            return value_if_not_existing;
        }
    };

    DP.prototype.triggerVirtualPropertyChange = function(currentValue, options) {
        this.lastTriggeredVirtualPropertyValue = currentValue;
        this.model.set(this.propertyName, currentValue, options);
    };

    DP.prototype.checkTimeout = function(uid) {
        // old usage with a single timer for every DP is kept for reference
        //return TM.exists(uid);
        return TM.hasResourceTimerId(uid);
    };

    DP.prototype.addTimeout = function(nextChangeIn) {
        //TM.register(this.uid, nextChangeIn, this.calculateAndTriggerVirtualPropertyImmediateBound, {max: 1});
        TM.addToResourceTimer(this.uid, this.calculateAndTriggerVirtualPropertyImmediateBound);
    };

    DP.prototype.clearTimeout = function() {
        //TM.unregister(this.uid);
        TM.removeFromResourceTimer(this.uid);
    };

    window.DeltaProperty = DP;
}());