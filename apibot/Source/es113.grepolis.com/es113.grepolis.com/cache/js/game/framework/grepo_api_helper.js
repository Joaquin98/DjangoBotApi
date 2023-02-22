/* global Game , Logger, gpAjax */
(function() {
    'use strict';

    var GrepoApiHelper = {

        /**
         * @returns {function} callback from a given callback argument
         * @param {object|function} callback_arg
         * @param {function} log_success logging function success
         * @param {function} log_error logging function error
         * @TODO we should find a way to remove the two parameters log_success and log_error and still log relevant data
         */
        getCallbackFromCallbackArg: function(callback_arg, log_success, log_error) {
            var callback,
                tmp_fn;

            log_success = log_success || function() {};
            log_error = log_error || function() {};

            if (typeof callback_arg === 'function') {
                callback = function(data, t_token) {
                    log_success(data);
                    callback_arg(data);
                }.bind(this);
            } else if (typeof callback_arg === 'object') {
                if (callback_arg.success) {
                    callback = {
                        success: function(layout, data, flags, t_token) {
                            log_success(data);
                            callback_arg.success(data);
                        }.bind(this)
                    };
                }
                if (callback_arg.error) {
                    tmp_fn = function(layout, data, t_token) {
                        log_error(data);
                        callback_arg.error(data);
                    }.bind(this);

                    if (callback) {
                        callback.error = tmp_fn;
                    } else {
                        callback = {
                            error: tmp_fn
                        };
                    }
                }
            }

            if (!callback) {
                if (Game.dev) {
                    callback = {
                        success: function(layout, data, flags, t_token) {
                            log_success(data);
                        }.bind(this),
                        error: function(layout, data, t_token) {
                            log_error(data);
                        }.bind(this)
                    };
                } else {
                    callback = function() {};
                }
            }

            return callback;
        },

        /**
         * execute a given action on the frontend-bridge controller
         * @param {string} api_name - the url of the service (usually backend class without 'Api' prefix)
         * @param {string} action_name
         * @param {object} props
         * @param {function | object} callback_arg
         * @return {Promise | null}		no promise during town-switches, see below
         */
        execute: function(api_name, action_name, props, callback_arg) {

            // Callbacks that log success or error data
            var log_success = function(data) {
                Logger.get('MM').log('Execute: ' + api_name + '.' + action_name + '(', props, ') => succes', data);
            }.bind(this);
            var log_error = function(data) {
                Logger.get('MM').log('Execute: ' + api_name + '.' + action_name + '(', props, ') => ERROR', data);
            }.bind(this);

            var callback = GrepoApiHelper.getCallbackFromCallbackArg.call(this, callback_arg, log_success, log_error);

            /*
             * call execute on the frontend bridge via gpajax and return a promise or null
             *
             * When there is _no_ town-switch going on, gpajax returns a jqXHR deffered-object
             * on town-switching, sadly, no jqxhr is returned, because of gpajax queue implementation
             */
            var jqXhr = gpAjax.ajaxPost('frontend_bridge', 'execute', {
                model_url: api_name,
                action_name: action_name,
                'arguments': props
            }, false, callback);

            return jqXhr;
        }
    };

    window.GrepoApiHelper = GrepoApiHelper;
})();