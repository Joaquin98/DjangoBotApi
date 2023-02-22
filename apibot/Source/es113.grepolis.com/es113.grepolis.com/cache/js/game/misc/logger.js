/* global Game */

define('misc/logger', function() {
    'use strict';

    var active_types = [];

    function _log(default_console_function, type, output) {
        var outs = Array.prototype.slice.call(arguments, 2),
            log_type;

        if (active_types.indexOf(type) !== -1) {
            if (outs.length === 1 && typeof outs[0] === 'function') {
                outs = outs[0]();

                if (!Array.isArray(outs)) {
                    outs = [outs];
                }
            } else {
                outs = outs.map(function(out) {
                    if (typeof out === 'function') {
                        return out();
                    } else {
                        return out;
                    }
                });
            }

            if (outs !== undefined) {
                switch (type) {
                    case 'error':
                        log_type = 'error';
                        break;
                    case 'warn':
                        log_type = 'warn';
                        break;
                    default:
                        log_type = default_console_function;
                        break;
                }

                log_type = (typeof console[log_type] === 'function') ? log_type : 'log';


                console[log_type].apply(console, outs);

            }
        }
    }

    var Logger = {
        init: function() {
            if (Game.dev && active_types.length === 0) {
                active_types.push('error', 'warn');
            }
        },

        get: function(type) {
            // IE8 does not have bind, and it may not be faked here during loading, so play safe
            if (typeof _log.bind === 'undefined') {
                return {
                    log: function() {},
                    group: function() {},
                    groupEnd: function() {}
                };
            }

            // all modern browsers
            return {
                log: _log.bind.apply(_log, Array.prototype.concat(null, 'log', Array.prototype.slice.apply(arguments))),
                group: _log.bind.apply(_log, Array.prototype.concat(null, 'group', Array.prototype.slice.apply(arguments))),
                groupEnd: _log.bind(null, 'groupEnd', type)
            };
        },

        on: function(type) {
            if (active_types.indexOf(type) === -1) {
                active_types.push(type);
            }

            return Logger;
        },

        isOn: function(type) {
            return active_types.indexOf(type) !== -1;
        },

        off: function(type) {
            if (type === undefined) {
                // remove all loggers
                active_types = [];
            } else {
                var position = active_types.indexOf(type);

                if (position !== -1) {
                    delete active_types[position];
                }
            }

            return Logger;
        }
    };

    window.Logger = Logger;
    return Logger;
});