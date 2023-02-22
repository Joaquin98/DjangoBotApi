/* global us */
(function() {
    'use strict';

    // This file is used to extend underscore by some more helpful utility functions

    us.mixin({

        /**
         * _.map for objects, keeps key/value associations
         *
         * @nosideeffects
         * @param {object} obj - object to map over
         * @param {function} mapper - function(v, k, obj) that should return the new value at a given key
         * @param context - used for the mapper function
         * @return {object}
         */
        objMap: function(obj, mapper, context) {
            return us.reduce(obj, function(obj, v, k) {
                obj[k] = mapper.call(context, v, k, obj);
                return obj;
            }, {}, context);
        },

        /**
         * _.filter for objects, keeps key/value associations,
         *  but only includes the properties that pass test().
         *
         * @nosideeffects
         * @param {object} obj - object to map over
         * @param {function} test - function(v, k, obj) that should return truthy values for key/value pairs that should stay
         * @param context - used for the test function
         * @return {object}
         */
        objFilter: function(obj, test, context) {
            return us.reduce(obj, function(obj, v, k) {
                if (test.call(context, v, k, obj)) {
                    obj[k] = v;
                }
                return obj;
            }, {}, context);
        },

        /**
         * Makes sure a value is within certain boundaries.
         * @param {number} min
         * @param {number} val
         * @param {number} max
         * @return {number}
         */
        clamp: function(min, val, max) {
            return Math.min(max, Math.max(val, min));
        }

    });

})();