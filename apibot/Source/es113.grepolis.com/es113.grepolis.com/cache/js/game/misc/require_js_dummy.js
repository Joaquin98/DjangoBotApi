/* global Game */
(function() {
    'use strict';

    var modules = {};

    window.require = function(module_name) {
        if (!modules[module_name]) {
            debug('require: warn: you require a unregistered module', module_name);
            if (Game.dev) {
                console.trace();
            }
        }
        return modules[module_name];
    };

    window.define = function(module_name, fn) {
        if (modules[module_name]) {
            debug('require: warn: duplicate definition of', module_name);
            if (Game.dev) {
                console.trace();
            }
        }
        modules[module_name] = fn(require);
    };

    /**
     * wrapper to warn if you require a window object which is undefined at your point of requireing
     * this method also helps to mark all legacy imports in the source code and makes it easier for migrations scripts
     *
     * @param [object || string] object_or_string
     * @returns object
     */
    window.require_legacy = function(object_or_string) {
        var object = typeof object_or_string === 'string' ? window[object_or_string] : object;

        if (typeof object === 'undefined') {
            debug('require: warn: you require a legacy global "window" object which is currently undefined');
            if (Game.dev) {
                console.trace();
            }
        }
        return object;
    };

}());