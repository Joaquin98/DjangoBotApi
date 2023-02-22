(function() {
    'use strict';

    var EMERGENCY_INTERVAL = 3333;

    /**
     * find the next interval in a collection by checking all
     * models for their 'getRealTimeLeft' value and choose the
     * smallest one.
     *
     * Returned values can be assumed to be >= 0 if the game works normally,
     * <= 0 if the deamon is overdue or network connections exists
     *
     * In case the interval can not be determined the function throws in DEV mode
     * or returns EMERGENCY_INTERVAL in prod mode.
     *
     * This can happen when you enter e.g. a empty collection or have a broken implementation
     * of getRealTimeLeft in your model
     *
     * @param {GrepolisCollection} collection
     * @returns {number} || null
     */
    var getNextInterval = function(collection) {
        var interval = collection.reduce(function(memo, model) {
            var time_left = model.getRealTimeLeft();

            return time_left < memo ? time_left : memo;
        }, Infinity);

        if (interval === Infinity) {
            if (window.Game.dev) {
                throw 'CollectionAutomaticFetchFactory: could not get a valid next interval for collection' + collection;
            } else {
                // in live return a valid Number, because Infinity might crash the browser if used in timers
                return EMERGENCY_INTERVAL;
            }
        }

        return interval;
    };

    var CollectionAutomaticFetchFactory = {
        initializeNotificationRequestHandlerForTrades: function(obj) {
            obj.initializeNotificationRequestHandler(['all'], getNextInterval);
        },

        initializeNotificationRequestHandlerForConstructionQueue: function(obj) {
            obj.initializeNotificationRequestHandler(['add', 'remove', 'change'], getNextInterval);
        },

        initializeNotificationRequestHandlerForSpawnMissions: function(obj) {
            obj.setFetchBackendData(obj.reFetch.bind(obj));
            obj.initializeNotificationRequestHandler(['refetch'], getNextInterval);
        }
    };

    window.CollectionAutomaticFetchFactory = CollectionAutomaticFetchFactory;

    if (window.DEBUG) {
        window.CollectionAutomaticFetchFactory.specs = {
            getNextInterval: getNextInterval,
            EMERGENCY_INTERVAL: EMERGENCY_INTERVAL
        };
    }
}());