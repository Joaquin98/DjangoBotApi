/*global Backbone */

/**
 * model to handle all data needed to calculate time to arrival for units
 * distance is updated by map
 * selected_units is updated by layout_units
 * watching is set automatically when selected_units is not empty
 * current speed is calculated when distance or selected_units is changed
 */

(function() {
    'use strict';

    var UnitTimeToArrival = Backbone.Model.extend({
        defaults: {
            watching: false,
            distance: 0,
            time_to_arrival: 0,
            selected_units: null,
            current_speed: 0
        },

        initialize: function() {
            this.clearSelectedUnits();
            this.on('change:distance', function() {
                this.setTimeToArrival(this.calculateTimeToArrival());
            }, this);
        },

        /**
         * initialize values needed to calculations passed from map
         * @param {Object} data mapData sent from map object
         */

        initializeValues: function(data) {
            this.setUnitSpeeds(data.unit_speeds);
            this.setDurationOffset(data.duration_offset);
        },

        /**
         * clears properties responsible for handling selected units
         * used when changed collection of units
         */
        clear: function() {
            this.clearSelectedUnits();
            this.setWatching(false);
        },

        /**
         * assigns callback to changed state of watching flag
         * @param {Function} callback
         * @param {mixed} context
         */
        onChangeWatching: function(callback, context) {
            this.on('change:watching', callback, context);
        },

        /**
         * assigns callback to changed state of time_to_arrival property
         * @param {Function} callback
         * @param {mixed} context
         */
        onChangeTimeToArrival: function(callback, context) {
            this.on('change:time_to_arrival', callback, context);
        },

        /**
         * sets unit_speeds property
         * @param {Object} unit_speeds
         */
        setUnitSpeeds: function(unit_speeds) {
            this.set('unit_speeds', unit_speeds);
        },

        /**
         * returns unit_speeds property
         * @return {Object}
         */
        getUnitSpeeds: function() {
            return this.get('unit_speeds');
        },

        /**
         * returns unit speed for passed unit_id parameter
         * @param {String} unit_id
         * @return {Number} returns unit speed if unit exists in unit_speed property, otherwise returns 0
         */
        getUnitSpeed: function(unit_id) {
            var unit_speeds = this.getUnitSpeeds();
            if (unit_speeds.hasOwnProperty(unit_id)) {
                return unit_speeds[unit_id];
            } else {
                return 0;
            }
        },

        /**
         * sets duration_offset property
         * @param {Number} duration_offset
         */
        setDurationOffset: function(duration_offset) {
            this.set('duration_offset', duration_offset);
        },

        /**
         * returns duration_offset property
         * @return {Number}
         */
        getDurationOffset: function() {
            return this.get('duration_offset');
        },

        /**
         * sets watching property
         * @param {Boolean} watching
         */
        setWatching: function(watching) {
            this.set('watching', watching);
        },

        /**
         * returns watching property
         * @return {Boolean}
         */
        isWatching: function() {
            return this.get('watching');
        },

        /**
         * sets distance property
         * @param {Number} distance
         */
        setDistance: function(distance) {
            this.set('distance', distance);
        },

        /**
         * returns distance property
         * @return {Number}
         */
        getDistance: function() {
            return this.get('distance');
        },

        /**
         * sets time_to_arrival property
         * @param {Number} time_to_arrival
         */
        setTimeToArrival: function(time_to_arrival) {
            this.set('time_to_arrival', time_to_arrival);
        },

        /**
         * returns time_to_arrival property
         * @return {Number}
         */
        getTimeToArrival: function() {
            return this.get('time_to_arrival');
        },

        /**
         * clears selected_units object
         */
        clearSelectedUnits: function() {
            return this.set('selected_units', {});
        },

        /**
         * sets selected_units property
         *
         * @return {Object} selected_units
         */
        getSelectedUnits: function() {
            return this.get('selected_units');
        },

        /**
         * adds unit_id to selected_units object
         * automatically set watching to true (as the selected_units is no longer empty)
         * @param {String} selected_unit_id
         */
        addSelectedUnit: function(selected_unit_id) {
            this.getSelectedUnits()[selected_unit_id] = true;
            this.updateCurrentSpeed();
            this.setWatching(true);
            this.setTimeToArrival(this.calculateTimeToArrival());
        },

        /**
         * removes unit_id to selected_units object
         * automatically set watching to false when selected_units object is empty
         * @param {String} selected_unit_id
         */
        removeSelectedUnit: function(selected_unit_id) {
            delete this.getSelectedUnits()[selected_unit_id];
            this.updateCurrentSpeed();
            if ($.isEmptyObject(this.getSelectedUnits())) {
                this.setWatching(false);
            } else {
                this.setTimeToArrival(this.calculateTimeToArrival());
            }
        },

        /**
         * sets current_speed property
         *
         * @param {Number} current_speed
         */
        setCurrentSpeed: function(current_speed) {
            this.set('current_speed', current_speed);
        },

        /**
         * returns current_speed property
         * @return {Number}
         */
        getCurrentSpeed: function() {
            return this.get('current_speed');
        },

        /**
         * update current speed as a slowest speed from selected units
         */
        updateCurrentSpeed: function() {
            this.setCurrentSpeed(this.getSlowestSelectedUnit());
        },

        /**
         * returns the slowest speed from selected units
         * @return {Number}
         */
        getSlowestSelectedUnit: function() {
            var unit_speeds = this.getUnitSpeeds(),
                slowest_speed = -1;

            us.each(this.getSelectedUnits(), function(value, unit_id) {
                if (slowest_speed === -1) {
                    slowest_speed = unit_speeds[unit_id];
                } else if (unit_speeds[unit_id] < slowest_speed) {
                    slowest_speed = unit_speeds[unit_id];
                }
            });

            return slowest_speed;
        },

        /**
         * calculate time to arrival
         * @return {Number}
         */
        calculateTimeToArrival: function() {
            return Math.round((this.getDistance() * 50) / this.getCurrentSpeed()) + this.getDurationOffset(); //offset to an other island
        }

    });

    window.GameModels.UnitTimeToArrival = UnitTimeToArrival;
}());