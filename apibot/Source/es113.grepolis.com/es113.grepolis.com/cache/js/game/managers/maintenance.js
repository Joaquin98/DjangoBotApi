/* global Raven */
define('managers/maintenance', function() {
    'use strict';

    var GameEvents = require('data/events');

    var maintenance_poll_timeout = Math.floor(2000 + Math.random() * 2000),
        maintenance_timer_id = null,
        maintenance_running = false;

    function _clearTimerViaClearInterval() {
        if (maintenance_timer_id) {
            window.clearInterval(maintenance_timer_id);
            maintenance_timer_id = null;
        }
    }

    function _clearTimerViaTM() {
        window.TM.unregister('maintenance_mode_timer');
    }

    /**
     * clears the Timer, depending if it is registerd via TM
     * or setInterval
     */
    function clearPollingTimer() {
        if (window.TM && !maintenance_timer_id) {
            _clearTimerViaTM();
        } else {
            _clearTimerViaClearInterval();
        }
    }

    function _setTimerViaTM() {
        window.TM.unregister('maintenance_mode_timer');
        window.TM.register('maintenance_mode_timer', maintenance_poll_timeout, function() {
            window.gpAjax.checkBackendDuringMaintenance();
        });
    }

    function _setTimerViaSetInterval() {
        maintenance_timer_id = window.setInterval(function() {
            window.gpAjax.checkBackendDuringMaintenance();
        }, maintenance_poll_timeout);
    }

    /**
     * polls the server until we end maintenance mode
     * uses TM if available, but since this module may run
     * e.g. in max. forum if can fall back to setInterval
     */
    function startPollingTimer() {
        if (window.TM) {
            _setTimerViaTM();
        } else {
            _setTimerViaSetInterval();
        }
    }

    return {

        /**
         * start maintenance mode, can be called many times
         * but only acts once
         * @param {Boolean} force when true, force fire events for and restart polling otherwise
         *  does nothing if maintenance is already triggered
         */
        startMaintenance: function(force) {
            if (maintenance_running && !force) {
                return;
            }

            clearPollingTimer();
            maintenance_running = true;
            if (window.gpAjax) {
                startPollingTimer();
            }
            $.Observer(GameEvents.system.maintenance_started).publish({});

            // If we have a running logger, add the state
            if (Raven && Raven.isSetup()) {
                Raven.setExtraContext({
                    maintenance: 'started'
                });
            }
        },

        /**
         * end maintenance mode, can be called often but acts only once
         */
        endMaintenance: function() {
            if (!maintenance_running) {
                return;
            }

            clearPollingTimer();
            $.Observer(GameEvents.system.maintenance_ended).publish({});

            if (Raven && Raven.isSetup()) {
                Raven.setExtraContext({
                    maintenance: 'ended, but game not refreshed'
                });
            }
            // Maintenace_running will never become false to avoid the player calling APIs with old version of the game
            // Only refresh / reload returns this to a sane state
            //maintenance_running = false;
        },

        /**
         * return true if maintenance is running
         */
        isMaintenanceRunning: function() {
            return maintenance_running;
        }
    };

});