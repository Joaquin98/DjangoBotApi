/*global MM, us, TM, gpAjax, NotificationLoader, Timestamp, GrepoApiHelper */

(function() {
    'use strict';

    var BaseModel = window.Backbone.Model;
    var BaseEvents = window.Backbone.Events;

    // Helper function to get a value from a Backbone object as a property
    // or as a function.
    function getValue(object, prop) {
        if (!(object && object[prop])) {
            return null;
        }
        return us.isFunction(object[prop]) ? object[prop]() : object[prop];
    }

    var running_timers = {};

    var GrepolisModel = BaseModel.extend({
        constructor: function(attributes, options) {
            this.update_emergence_time = 0;
            // if the model was created for a window that was called with arguments for the backend, those arguments are stored here for later
            if (options && options.creation_arguments) {
                this.creationArguments = options.creation_arguments;
                delete options.creation_arguments;
            }

            BaseModel.prototype.constructor.call(this, attributes, options);

            if (this.timestamp_timers) {
                var i, l = this.timestamp_timers.length,
                    timestamp_timer;

                for (i = 0; i < l; i++) {
                    timestamp_timer = this.timestamp_timers[i];

                    this.initializeTimestampTimer(timestamp_timer.attribute_name, timestamp_timer.reset_notifications);
                }
            }
        },

        execute: function(action_name, props, callback_arg) {
            return GrepoApiHelper.execute.call(this, this.url(), action_name, props, callback_arg);
        },

        /**
         * the standard backbone behavior is to fire a "DELETE" http request to the server on destroy
         * We do not want this, instead just stopListening and trigger a "destroy" event on the model
         */
        destroy: function(options) {
            options = options ? _.clone(options) : {};

            this.stopListening();
            this.trigger('destroy', this, this.collection, options);
        },

        /**
         * override of the model.set method to enhance it with security against updates from old
         * notifications (may it be fake notification, node or game_notifications). This is achieved by
         * storing the time of the creation of the last change event (not the time the event is to be applied)
         *
         * The method accepts the same arguments as the normal model.set and searches for the additional
         * field update_emergence_time in the options (works only for complete updates, not single field updates)
         *
         * @method set
         */
        set: function(key, value, options) {
            // Handle both
            if (us.isObject(key) && value && value.update_emergence_time && this.update_emergence_time > value.update_emergence_time) {
                // if this model got updated already by a newer message, then don't do it again!
                return;
            }

            if (value && value.update_emergence_time) {
                this.update_emergence_time = value.update_emergence_time;
            }

            return BaseModel.prototype.set.apply(this, arguments);
        },

        /**
         * Keeps multi events data
         */
        multi_events_data: [],

        /**
         * Checks whether an event is registered or not
         *
         * @param {String} multi_event_name   custom event name
         * @param {Object} obj                listener object
         *
         * @return {Boolean}
         */
        isMultiEventRegistered: function(multi_event_name, obj) {
            return us.find(this.multi_events_data, function(item) {
                return item.obj === obj && item.multi_event_name === multi_event_name;
            }) !== undefined;
        },

        /**
         * Removes multi event data for specific event and controller which listens to it
         *
         * @param {String} multi_event_name   custom event name
         * @param {Object} obj                listener object
         *
         * @private
         */
        _removeMultiEventsData: function(multi_event_name, obj) {
            var i, l = this.multi_events_data.length,
                data;

            for (i = 0; i < l; i++) {
                data = this.multi_events_data[i];

                if (data.obj === obj && data.multi_event_name === multi_event_name) {
                    this.multi_events_data.splice(i, 1);
                }
            }
        },

        /**
         * Adds multi events data which is used to determinate whether an event
         * is already registered or not
         *
         * @param {String} multi_event_name   custom event name
         * @param {Object} obj                listener object
         *
         * @private
         */
        _addMultiEventsData: function(multi_event_name, obj) {
            this.multi_events_data.push({
                obj: obj,
                multi_event_name: multi_event_name
            });

            TM.unregister('multi_listener:' + multi_event_name + ':' + obj.getSubContext());
            TM.register('multi_listener:' + multi_event_name + ':' + obj.getSubContext(), 1000, function(multi_event_name, obj) {
                //Remove events data so another timer can be registered
                this._removeMultiEventsData(multi_event_name, obj);
                //Trigger event on the model
                this.trigger(multi_event_name);
            }.bind(this, multi_event_name, obj), {
                max: 1
            });
        },

        /**
         * Creates listener which listens on multiple events but triggers only one which is delayed by 1s to the first
         * triggered event from this group
         *
         * @param {String} multi_event_name   custom event name
         * @param {Array} events              array with Backbone event names
         * @param {Object} obj                listener object
         * @param {Function} callback         callback
         */
        listenToMultiEvents: function(multi_event_name, events, obj, callback) {
            var i, l = events.length;

            if (typeof obj.getSubContext !== 'function') {
                throw '"listenToMultiEvents" can be used only with controllers.';
            }

            var multi_events_callback = function(multi_event_name, obj /*, model, value*/ ) {
                if (!this.isMultiEventRegistered(multi_event_name, obj)) {
                    this._addMultiEventsData(multi_event_name, obj);
                }
            };

            for (i = 0; i < l; i++) {
                obj.listenTo(this, events[i], multi_events_callback.bind(this, multi_event_name, obj));
            }

            obj.listenTo(this, multi_event_name, callback);
        },

        on: function( /*name, callback, context*/ ) {
            var triggerThatWillBeTriggered, callbacks,
                unboundTriggers = [],
                unboundTrigger_idx, unboundTriggers_length, unboundTrigger,
                result;

            if (!this.onMethodCurrentlyRunning) {
                for (triggerThatWillBeTriggered in this.externalTrigger) {
                    if (this.externalTrigger.hasOwnProperty(triggerThatWillBeTriggered)) {
                        if (!this.hasListenerFor(triggerThatWillBeTriggered)) {
                            unboundTriggers.push(triggerThatWillBeTriggered);
                        }
                    }
                }
            }

            this.onMethodCurrentlyRunning = true;
            result = BaseEvents.on.apply(this, arguments);
            delete this.onMethodCurrentlyRunning;

            unboundTriggers_length = unboundTriggers.length;
            for (unboundTrigger_idx = 0; unboundTrigger_idx < unboundTriggers_length; ++unboundTrigger_idx) {
                unboundTrigger = unboundTriggers[unboundTrigger_idx];

                if (this.hasListenerFor(unboundTrigger)) {
                    callbacks = this.externalTrigger[unboundTrigger];
                    if (typeof callbacks.bind === 'string') {
                        this[callbacks.bind].apply(this);
                    } else {
                        callbacks.bind.apply(this);
                    }
                }
            }

            return result;
        },

        off: function( /*name, callback, context*/ ) {
            var triggerThatWillBeTriggered, callbacks,
                boundTriggers = [],
                boundTrigger_idx, boundTriggers_length, boundTrigger,
                result;

            if (!this.offMethodCurrentlyRunning) {
                for (triggerThatWillBeTriggered in this.externalTrigger) {
                    if (this.externalTrigger.hasOwnProperty(triggerThatWillBeTriggered)) {
                        if (this.hasListenerFor(triggerThatWillBeTriggered)) {
                            boundTriggers.push(triggerThatWillBeTriggered);
                        }
                    }
                }
            }

            this.offMethodCurrentlyRunning = true;
            result = BaseEvents.off.apply(this, arguments);
            delete this.offMethodCurrentlyRunning;

            boundTriggers_length = boundTriggers.length;
            for (boundTrigger_idx = 0; boundTrigger_idx < boundTriggers_length; ++boundTrigger_idx) {
                boundTrigger = boundTriggers[boundTrigger_idx];

                if (!this.hasListenerFor(boundTrigger)) {
                    callbacks = this.externalTrigger[boundTrigger];
                    if (typeof callbacks.remove === 'string') {
                        this[callbacks.remove].apply(this);
                    } else {
                        callbacks.remove.apply(this);
                    }
                }
            }

            return result;
        },

        /**
         * Checks if the model currently has someone who listens to the given trigger
         *
         * @param {string} trigger_arg
         * @return {Boolean}
         */
        hasListenerFor: function(trigger_arg) {
            var triggers = ['all'],
                trigger_idx, triggers_length, trigger;

            if (this._events) {
                if (trigger_arg.indexOf('change:') !== -1) {
                    triggers.push('change');
                }

                Array.prototype.push.apply(triggers, trigger_arg.split(' '));

                triggers_length = triggers.length;

                for (trigger_idx = 0; trigger_idx < triggers_length; ++trigger_idx) {
                    trigger = triggers[trigger_idx];

                    if (this._events[trigger]) {
                        return true;
                    }
                }
            }

            return false;
        },

        url: function() {
            var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || undefined;
            if (!base || this.isNew()) {
                return base;
            }
            return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
        },

        unregisterFromModelManager: function() {
            MM.removeModel(this);
        },

        /**
         * Manually refreshes the model by asking the backend.
         * Uses the GameFrontendBridgeController to call models APIs 'read' method.
         *
         * @param {function} [cb] - success callback
         * @param {object} props - additional request parameters
         */
        reFetch: function(cb, props) {
            var success = function(resp) {
                    this.set(resp.json || resp);
                    if (cb) {
                        cb();
                    }
                },
                show_loader = false, // does not work here anyway
                request_data = {
                    action_name: 'read',
                    model_url: this.urlRoot
                };

            if (props) {
                request_data['arguments'] = props;
            }

            gpAjax.ajaxGet('frontend_bridge', 'execute', request_data, show_loader, success.bind(this));
        }

    });

    /**
     * Static Methods - called via GrepolisModel.addAttributeReader etc.
     */

    /**
     * This method handles situation when we want to know on the frontend when timestamp will run out. For example,
     * hero can be injured, and in 2h will be healthy. To have a possibility to listen on the "change" event when will
     * happened, you should do:
     *
     * - Go to the model that keeps the timestamp and add:
     *
     *      Model.addTimestampTimer(PlayerHero, 'cured_at');
     *
     * - Now you can listen on the changes:
     *
     *      PlayerHeroes.onCureTimeRunsOut = function(obj, callback) {
     *          obj.listenTo(this, 'timestamp:cured_at', callback);
     *      };
     *
     * @param {Object} model_class      Backbone.Model which inherits from window.GrepolisModel
     * @param {String} attribute_name   name of the attribute which stores the timestamp
     */
    GrepolisModel.addTimestampTimer = function(model_class, attribute_name, reset_notifications) {
        if (typeof model_class.timestamp_timers !== 'object') {
            model_class.timestamp_timers = [];
        }

        model_class.timestamp_timers.push({
            attribute_name: attribute_name,
            reset_notifications: reset_notifications
        });

        if (typeof model_class._timestampTimerCallback !== 'function') {
            model_class._timestampTimerCallback = function(props) {
                var event_name = props.event_name,
                    timer_name = props.timer_name;

                this.trigger(event_name, this);
                TM.unregister(timer_name);

                if (props.reset_notifications) {
                    NotificationLoader.resetNotificationRequestTimeout(100);
                }
            };
        }

        /**
         * Manages timestamp timer
         *
         * @param {Object} props    object with settings created by .initializeTimestampTimer function
         */
        if (typeof model_class._manageTimestampTimer !== 'function') {
            model_class._manageTimestampTimer = function(props) {
                var value = this.get(props.attribute_name),
                    interval = Math.max(0, (value || 0) - Timestamp.now()) * 1000,
                    timer_name = props.timer_name;

                clearTimeout(running_timers[timer_name]);
                if (typeof value === 'number') { // to prevent a call when value is null
                    running_timers[timer_name] = setTimeout(this._timestampTimerCallback.bind(this, props), interval);
                }

                /*
                if (interval > 0) {
                	if (TM.exists(timer_name)) {
                		TM.update(timer_name, interval);
                	}
                	else {
                		TM.register(timer_name, interval, this._timestampTimerCallback.bind(this, props), {max : 1});
                	}
                }
                else {
                	if (TM.exists(timer_name)) {
                		this._timestampTimerCallback(props);
                	}
                }
                */
            };
        }

        /**
         * Instantiates timestamp timer
         */
        if (typeof model_class.initializeTimestampTimer !== 'function') {
            model_class.initializeTimestampTimer = function(attribute_name, reset_notifications) {
                var event_name = 'timestamp:' + attribute_name;
                var props = {
                    attribute_name: attribute_name,
                    event_name: event_name,
                    timer_name: this.cid + ':' + event_name,
                    reset_notifications: reset_notifications
                };

                this.on('change:' + attribute_name, function() {
                    this._manageTimestampTimer(props);
                }, this);

                this._manageTimestampTimer(props);
            };
        }
    };

    GrepolisModel.addAttributeReader = function(model_class, attribute_name) {
        var args = Array.prototype.slice.call(arguments, 1);
        $(args).each(function(index, argument_attribute_names) {
            model_class['get' + argument_attribute_names.camelCase()] = function() {
                return this.get(argument_attribute_names);
            };
        });
    };

    window.GrepolisModel = GrepolisModel;
}());