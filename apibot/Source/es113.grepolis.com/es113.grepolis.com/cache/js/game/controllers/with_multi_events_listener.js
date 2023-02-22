/*globals TM, Backbone */

(function() {
    'use strict';

    var WithMultiEventsListener = Backbone.View.extend({
        initialize: function(options) {

        },

        multi_events: {},

        /**
         * Keeps multi events data
         */
        multi_events_timers_names: {},

        /**
         * Checks whether an event is registered or not
         *
         * @param {String} multi_event_name   custom event name
         *
         * @return {Boolean}
         */
        isMultiEventRegistered: function(multi_event_name) {
            return this.multi_events_timers_names[multi_event_name] !== undefined;
        },

        unregisterMultiEventsListeners: function() {
            var multi_events = this.multi_events;

            for (var event_name in multi_events) {
                if (multi_events.hasOwnProperty(event_name)) {
                    this.off(event_name);

                    TM.unregister('controller:multi_listener:' + event_name + ':' + this.getSubContext());
                }
            }

            this.multi_events = {};
        },

        /**
         * Removes multi event data for specific event and controller which listens to it
         *
         * @param {String} multi_event_name   custom event name
         *
         * @private
         */
        _removeMultiEventsData: function(multi_event_name) {
            delete this.multi_events_timers_names[multi_event_name];
        },

        /**
         * Adds multi events data which is used to determinate whether an event
         * is already registered or not
         *
         * @param {String} multi_event_name   custom event name
         *
         * @private
         */
        _addMultiEventsData: function(multi_event_name) {
            this.multi_events_timers_names[multi_event_name] = true;

            TM.unregister('controller:multi_listener:' + multi_event_name + ':' + this.getSubContext());
            TM.register('controller:multi_listener:' + multi_event_name + ':' + this.getSubContext(), 250, function(multi_event_name) {
                //Remove events data so another timer can be registered
                this._removeMultiEventsData(multi_event_name);
                //Trigger event on the model
                this.trigger(multi_event_name);
            }.bind(this, multi_event_name), {
                max: 1
            });
        },

        /**
         * Creates listener which listens on multiple events but triggers only one which is delayed by 1s to the first
         * triggered event from this group
         *
         * @param {String} multi_event_name   custom event name
         * @param {Array} definitions         array of objects, @see example
         * @param {Function} callback         callback function
         *
         * Example:
         *
         * this.listenToMultiEvents('all_events_to_force_update', [
         *     {obj : this.getBuildingsModel(), method : 'onBuildingLevelChange'},
         *     {obj : this.getCollection("building_orders"), method : 'onOrderCountChange'},
         *     {obj : this.getCollection('casted_powers'), method : 'onCastedPowerCountChange'}
         * ], function() {
         *     this._updateCurrentTownData();
         * }.bind(this));
         */
        listenToMultiEvents: function(multi_event_name, definitions, callback) {
            var i, l = definitions.length,
                definition;

            var multi_events_callback = function(multi_event_name) {
                if (!this.isMultiEventRegistered(multi_event_name)) {
                    this._addMultiEventsData(multi_event_name);
                }
            };

            for (i = 0; i < l; i++) {
                definition = definitions[i];
                definition.obj[definition.method](this, multi_events_callback.bind(this, multi_event_name));
            }

            this._registerEvent(multi_event_name, callback);
        },

        _registerEvent: function(event_name, callback) {
            this.multi_events[event_name] = true;
            this.on(event_name, callback);
        },

        /**
         * Called when controller is being destroyed
         *
         * @private
         */
        _destroy: function() {

        }
    });

    window.GameControllers.WithMultiEventsListener = WithMultiEventsListener;
}());