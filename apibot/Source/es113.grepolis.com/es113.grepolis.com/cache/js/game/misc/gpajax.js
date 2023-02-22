/*globals _, HumanMessage, NotificationLoader, WQM, Game, MaintenanceWindowFactory, url, Timestamp, Layout, HelperLayout, HelperTown, BotCheckWindowFactory, GPWindowMgr, WM, debug, GPAjax */

/**
 * GPAjax class
 *
 * class_options
 *  - {Boolean} enable_response_errors (default true)
 *  - {Boolean} enable_response_errors_human_msg (default true)
 *  - {Boolean} enable_response_errors_to_console (default false)
 *
 * @param {Object} layout
 * @param {Boolean} locking
 * @param {Object} class_options (optional)
 * @return object
 */
function GPAjax(layout, locking, class_options) {

    var maintenanceManager = require('managers/maintenance');
    var HelperPlayerHints = require('helpers/player_hints');

    // version is beeing sent with every code 200 response
    var version = null;
    var request_running = false,
        class_opt = class_options || {};

    // polling interval should be between 2 and 4 seconds, a typical server update lasts 10 seconds
    /**
     * Contains up to two stacks of requests from doClosedRequestsContext(). The current (first) stack contains all request
     * currently running. Should a second context of requests be started, the requests after that will be stored in the
     * waiting (second) stack.
     *
     * If the current stack of requests is done it will be deleted, and the waiting stack will become the current one.
     *
     * If a new waiting stack will be created, but there already is one, then the one already there will be overwritten.
     * This has the benefit, that requests from a context which isn't needed anymore (think switching thru towns very fast)
     * don't have to be done
     */
    window.request_stacks = window.request_stacks || {
        current: undefined,
        waiting: undefined
    };

    /**
     * maintenance mode is handled in the maintenanceManager module, which is optional
     */
    function disableMaintenanceMode() {
        if (maintenanceManager) {
            maintenanceManager.endMaintenance();
        }
    }

    function enableMaintenanceMode() {
        if (maintenanceManager) {
            maintenanceManager.startMaintenance();
        }
    }

    /**
     * Handles erroneous HTTP status codes
     * 400, 404, 500, 501, 502, 503
     *
     * @param {Object} jqXHR
     * @param {String} textStatus
     * @param {String} errorThrown
     * @param {Object} options (optional)
     * @return void
     */
    function handleHTTPStatusCode(jqXHR, textStatus, errorThrown, options) {
        switch (jqXHR.status) {
            case 400: //400 Bad Request
                errorThrown = _('This request is incorrect.');
                break;
            case 404: //404 Not Found
                errorThrown = _('The requested page could not be found.');
                break;
            case 500: //500 Internal Server Error
                errorThrown = _('An internal error has occurred!');
                break;
            case 501: //501 Not Implemented
                errorThrown = _('This request is incorrect.');
                break;
            case 502: //502 Bad Gateway / Loadbalancer will display Sorry page and return this status code
                //$(document).html(jqXHR.responseText);
                errorThrown = _('The server is temporarily not available.');
                break;
            case 503: //503 Service Unavailable
                errorThrown = _('The server is temporarily not available.');
                break;
            case 504: //504 Gateway Timeout
                errorThrown = _('The network has not responded due to a time-out.');
                break;
        }
        HumanMessage.error(_('Network error') + '<br/>' + jqXHR.status + ' ' + errorThrown);

        //If options are setuped this way so window should be closed on an error
        if (options && options.close_wnd && options.wnd) {
            options.wnd.close();
        }
    }

    /**
     * Handle status code 503 : maintenance
     *
     * Just enable maintenance mode and do not throw error message like all the other
     * status codes
     */
    function handleMaintenanceStatusCode(jqXHR, textStatus, errorThrown) {
        if (jqXHR.responseText && jqXHR.responseText === 'updating') {
            enableMaintenanceMode();
        }
    }

    /**
     * Check if the version sent with valid requests didn't change.
     * Otherwise show the "update finished, pls refresh" window
     */
    function _handleMissedUpdate(parsed_response) {

        if (parsed_response !== null && parsed_response.version && parsed_response.update) {

            var version_changed = version && parsed_response.version !== version;

            // if branch or revision changed and the update type marks a hard update
            // show maintenance window
            if (version_changed && (parsed_response.update === 'hard' || parsed_response.update === 'unknown')) {
                if (maintenanceManager) {
                    var force = true;
                    maintenanceManager.startMaintenance(force);
                    maintenanceManager.endMaintenance();
                }
            }

            version = parsed_response.version;
        }
    }

    /**
     * Open a new request context. All requests done inside of this context will have to finish, before the requests of the next
     * context will be started. All requests of a context, plus all requests done after the context closed and before the next opens
     * will be droped if a new context will be opened
     */
    this.doClosedRequestsContext = function(callback) {
        var context_stack = _addRequestsStackAndDropWaiting();

        callback();
        context_stack.pending = context_stack.stack.length; // remember how many request have to be done til the next stack can start
    };

    /**
     * adds a new request-stack. Will add a 'current' or 'waiting' context, depending on whether there already is one
     *
     * @returns {object}
     */
    function _addRequestsStackAndDropWaiting() {
        if (window.request_stacks.current) {
            return (window.request_stacks.waiting = {
                stack: [],
                pending: false,
                untraced: []
            });
        } else {
            return (window.request_stacks.current = {
                stack: [],
                pending: false
            });
        }
    }

    /**
     * Will create a plain object from the arguments passed, that later can be used to make an ajax request with executeStackedRequest()
     *
     * @param {string} controller
     * @param {string} action
     * @param {object} params
     * @param {string} type
     * @param {function|object} callback
     * @param {boolean} show_loader
     * @param {object} http_status_code_options
     * @param {integer} town_id
     *
     * @returns {object}
     */
    function _createStackedRequest(controller, action, params, type, callback, show_loader, http_status_code_options, town_id) {
        return {
            controller: controller,
            action: action,
            params: params,
            type: type,
            callback: callback,
            show_loader: show_loader,
            http_status_code_options: http_status_code_options,
            town_id: town_id
        };
    }

    /**
     * used to determine if the 'current' stack can have additional requests added
     *
     * @returns {Boolean}
     */
    function _isCurrentStackOpen() {
        return window.request_stacks.current.pending === false;
    }

    /**
     * used to determine if the 'waiting' stack can have additional requests added
     *
     * @returns {Boolean}
     */
    function _isWaitingStackOpen() {
        return window.request_stacks.waiting.pending === false;
    }

    /**
     * to check if all requests stacked in a context are done they get wrapped here.
     * if the last request of a context is done, the next waiting context will be made
     * current context and requests from that will be started
     *
     * @param {function} callback
     */
    function _stackedCurrentRequestDone(callback) {
        var callback_args = Array.prototype.slice.call(arguments, 1);
        if (typeof callback === 'function') {
            callback.apply(this, callback_args);
        }

        if ((--window.request_stacks.current.pending) === 0) {
            _activateCurrentlyWaitingRequests();
        }
    }

    /**
     * to make the waiting context the current context, and start all requests from it
     */
    function _activateCurrentlyWaitingRequests() {
        var requests, request_idx, requests_length, request;

        window.request_stacks.current = window.request_stacks.waiting;
        window.request_stacks.waiting = undefined;

        if (window.request_stacks.current) {
            requests = window.request_stacks.current.stack;
            requests_length = requests.length;
            for (request_idx = 0; request_idx < requests_length; ++request_idx) {
                request = requests[request_idx];

                _executeStackedRequest(request);
            }

            requests = window.request_stacks.current.untraced;
            if (requests) {
                requests_length = requests.length;
                for (request_idx = 0; request_idx < requests_length; ++request_idx) {
                    request = requests[request_idx];

                    _executeStackedRequest(request);
                }
            }
        }
    }

    /**
     * the callback method(s) of a request have to be wrapped by the stackedCurrentRequestDone() function
     * to make it possible to count when all requests of a context are done.
     *
     * @param {objtec} request
     */
    function _wrapCallback(request) {
        var callback = request.callback;

        if (typeof callback === 'object') {
            if (callback.success) {
                callback.success = _stackedCurrentRequestDone.bind(this, callback.success);
            }

            if (callback.error) {
                callback.error = _stackedCurrentRequestDone.bind(this, callback.error);
            }
        } else {
            request.callback = _stackedCurrentRequestDone.bind(this, callback);
        }

    }

    /**
     * add a request to the current context request stack and wrap its callback
     *
     * @param {object} request
     */
    function _addToCurrentStack(request) {
        _wrapCallback(request);

        window.request_stacks.current.stack.push(request);
    }

    /**
     * do the ajax request from a request object
     *
     * @param {object} request
     */
    function _executeStackedRequest(request) {
        _doGpajaxrequest(request.controller, request.action, request.params, request.type, request.callback, request.show_loader, request.http_status_code_options, request.town_id);
    }

    /**
     * add a request to the waiting context request stack and wrap its callback
     *
     * @param {object} request
     */
    function _addToWaitingStack(request) {
        _wrapCallback(request);

        window.request_stacks.waiting.stack.push(request);
    }

    /**
     * Add a request to the waiting context untraced request stack and wrap its callback.
     * The untraced requests don't count if the context is checked for its completion.
     * But the untraced requests get canceled as well, when the context gets canceled (if a new waiting context overwrites it)
     *
     * @param {object} request
     */
    function _addToWaitingUntraced(request) {
        window.request_stacks.waiting.untraced.push(request);
    }

    /**
     * Decorates the gpajaxrequest method. Here the decission will be made where to put the request. Whether it has to be executed
     * right away, or stored into one of the context stacks
     *
     * @param {string} controller
     * @param {string} action
     * @param {object} params
     * @param {string} type
     * @param {function|object} callback
     * @param {boolean} show_loader
     * @param {object} http_status_code_options
     */
    function gpajaxrequest(controller, action, params, type, callback, show_loader, http_status_code_options) {
        if (!window.request_stacks.current) {
            // no stacks at all
            // -> just do the damn request

            return _doGpajaxrequest(controller, action, params, type, callback, show_loader, http_status_code_options, Game.townId);
        } else if (!_isCurrentStackOpen() && !window.request_stacks.waiting) {
            // only current stack but closed
            // -> requests not belonging to the request group. Execute right now, don't have to store

            return _doGpajaxrequest(controller, action, params, type, callback, show_loader, http_status_code_options, Game.townId);
        } else {
            var request = _createStackedRequest(controller, action, params, type, callback, show_loader, http_status_code_options, Game.townId);

            if (_isCurrentStackOpen()) {
                // only current stack awaits more -> pending === false
                // -> we are in a request scope and store which requests should always happen together. Those will be executed this second as well

                _addToCurrentStack(request);
                _executeStackedRequest(request);
            } else if (_isWaitingStackOpen()) {
                // current stack closed and waiting stack is open -> pending === false
                // -> add request to waiting stack, DO NOT execute

                _addToWaitingStack(request);
            } else {
                // current and waiting stack both closed
                // -> add request to untraced stack in waiting

                _addToWaitingUntraced(request);
            }
        }
    }

    /**
     * GPAjax Request
     * @param {String} controller
     * @param {String} action
     * @param {Object} params
     * @param {String} type 'POST' or 'GET'
     * @param {mixed} callback if function reference; handled as success callback; else if object with members success and error ...
     * @param {Boolean} show_loader (show spinner?)
     * @param {Object} http_status_code_options (optional)
     *
     * @return void
     */
    function _doGpajaxrequest(controller, action, params, type, callback, show_loader, http_status_code_options, town_id) {

        if (maintenanceManager && maintenanceManager.isMaintenanceRunning()) {
            if (params.class_name !== 'ApiUpdateDummy') {
                return;
            }
        }

        if (typeof show_loader === 'undefined') {
            show_loader = true;
        }

        if (window.isForum) {
            // don't fetch notifications in external alliance forum
            params.nl_skip = true;
        }

        if (locking && request_running) {
            return;
        }

        request_running = true;

        var callback_success = null;
        var callback_error = null;
        if (typeof callback === 'object') {
            callback_success = callback.success ? callback.success : null;
            callback_error = callback.error ? callback.error : null;
        } else {
            callback_success = callback;
        }

        if (layout && show_loader === true) {
            layout.showAjaxLoader();
        }

        if (window.MaintenanceWindowFactory && MaintenanceWindowFactory.isMaintenanceTime()) {
            return; // don't do anything when maintenance (user logged out)
        }

        var statusCodeCallback = function(jqXHR, textStatus, errorThrown) {
            handleHTTPStatusCode(jqXHR, textStatus, errorThrown, http_status_code_options);
        };

        jQuery.ajaxSetup({
            'cache': false
        });

        //When models and collections are stored in the window handler then the script below tries to stringify
        //them which generates and error (thrown by segmented collection because the toJSON is not implemented there)
        //therfore we have to remove 'window_handle' from params which is not used there anyway.
        var stripped_params = $.extend(true, {}, params); //Clone it so the property will not be removed by reference from EndlessScroll
        delete stripped_params.window_handle;

        var jqXHR = jQuery.ajax({
            url: url(controller, action, {
                town_id: town_id
            }),
            type: type,
            data: {
                'json': JSON.stringify(stripped_params)
            },
            dataType: 'text',

            statusCode: {
                400: statusCodeCallback,
                404: statusCodeCallback,
                418: statusCodeCallback,
                500: statusCodeCallback,
                501: statusCodeCallback,
                502: statusCodeCallback,
                503: handleMaintenanceStatusCode,
                504: statusCodeCallback
            },
            success: function(data, flag, jqXHR) {
                var i,
                    retdata,
                    t_token,
                    game_initialization = (controller === 'data' && action === 'get') || (controller === 'debug' && action === 'get') ||
                    (controller === 'debug' && action === 'getSpeed');

                var return_data = (data && data.length) ? JSON.parse(data) : null;

                // only statuscode 200 disables maintenance mode
                if (jqXHR.status === 200) {
                    disableMaintenanceMode();
                }

                if (!return_data || !return_data.json || !return_data._srvtime) {
                    return;
                }

                _handleMissedUpdate(return_data);

                if (return_data.version) {
                    version = return_data.version;
                }

                retdata = return_data.json;

                if (typeof retdata !== 'object' || retdata === null) {
                    retdata = {
                        data: retdata
                    };
                }

                // Plain block
                if (return_data.plain) {
                    for (i in return_data.plain) {
                        if (return_data.plain.hasOwnProperty(i)) {
                            retdata[i] = return_data.plain[i];
                        }
                    }
                }

                request_running = false;
                if (layout && show_loader == true) {
                    layout.hideAjaxLoader();
                }

                t_token = retdata.t_token;
                delete retdata.t_token;

                Timestamp.updateServerTimebyUnixTime(return_data._srvtime);
                delete return_data._srvtime;

                if (typeof Layout !== 'undefined' && typeof Layout.insertEventTrackingCode !== 'undefined' && retdata.event_pixel) {
                    Layout.insertEventTrackingCode(retdata.event_pixel);

                    delete retdata.event_pixel;
                }

                // Redirect request:
                if (retdata.redirect) {
                    window.location.href = retdata.redirect;

                    delete retdata.redirect;

                    return;
                }

                if (retdata.maintenance) {
                    return MaintenanceWindowFactory.openMaintenanceWindow(retdata.maintenance);
                }

                if (retdata.success) {
                    HumanMessage.success(retdata.success);
                }

                // notifications have to be handled BEFORE error handling
                // otherwise they are not handled at all
                if (retdata.notifications) {
                    if (NotificationLoader) {
                        NotificationLoader.recvNotifyData(retdata, game_initialization);

                        delete retdata.notifications;
                        delete retdata.next_fetch_in;
                    }
                }

                if (retdata.bar && retdata.bar.gift && retdata.bar.gift.length) {
                    var windows = require('game/windows/ids');

                    var window_type = windows.DAILY_LOGIN;

                    var daily_login_gift = HelperLayout.getGiftData(retdata.bar.gift, 'gift.daily_reward');

                    if (daily_login_gift && !WM.isOpened(window_type)) {
                        HelperLayout.openDailyLoginGift(daily_login_gift);
                    }
                }

                if (retdata.error) {
                    // show special popup message in maximized forum window
                    if (window.isForum && retdata.type && retdata.type === 'botcheck') {
                        HumanMessage.error('Response Error');
                        var priorities = require('game/windows/priorities');

                        WQM.addQueuedWindow({
                            type: GPWindowMgr.TYPE_BOT_CHECK,
                            priority: priorities.getPriority(GPWindowMgr.TYPE_BOT_CHECK),
                            open_function: function() {
                                return BotCheckWindowFactory.openBotCheckWindow();
                            }
                        });
                    }

                    if (callback_error) {
                        callback_error(layout, retdata, t_token);
                    }
                    if (typeof retdata.gpSwitchtown !== 'undefined') {
                        HumanMessage.error(retdata.error);
                        if (retdata.gpSwitchtown === null) {
                            window.location.reload();
                        } else {
                            HelperTown.townSwitch(parseInt(retdata.gpSwitchtown, 10));
                        }
                    } else if (typeof retdata.gpVerificationRequest !== 'undefined') {
                        var verification_data = JSON.parse(retdata.gpVerificationRequest);
                        var use_player_hint = false;

                        if (verification_data.player_hint) {
                            use_player_hint = true;
                        }

                        //Question asked after casting effect, whether you want to overwrite already casted effect
                        // with new one which is better
                        Layout.showConfirmDialog(
                            verification_data.title,
                            verification_data.desc,
                            function() {
                                params.verification_code = verification_data.code;
                                gpajaxrequest(controller, action, params, type, callback, show_loader, http_status_code_options);
                            },
                            verification_data.ok,
                            null,
                            verification_data.cancel,
                            function() {
                                if (verification_data.player_hint) {
                                    if (HelperPlayerHints.isHintEnabled(verification_data.player_hint)) {
                                        HelperPlayerHints.getPlayerHintsCollection().disableHint(verification_data.player_hint);
                                    } else {
                                        HelperPlayerHints.getPlayerHintsCollection().enableHint(verification_data.player_hint);
                                    }
                                    return false;
                                } else {
                                    return null;
                                }
                            },
                            verification_data.check,
                            null,
                            use_player_hint
                        );
                    } else {
                        HumanMessage.error(retdata.error);
                        if (retdata.error_message && Game.dev) {
                            console.error(retdata.error, retdata.error_message);
                        }
                    }

                    delete retdata.error;
                    return;
                }

                if (callback_success) {
                    callback_success(layout, retdata, flag, t_token);
                }

                if (retdata._sysmsg == 1) {
                    NotificationLoader.resetNotificationRequestTimeout();
                    delete retdata._sysmsg;
                }
            },
            error: function(jqXHR, text_status, error_thrown) {
                // Fix virtual Response Errors which are none
                if (jqXHR.status === 0 || jqXHR.readyState === 0) {
                    return;
                }

                request_running = false;

                if (layout && show_loader == true) {
                    layout.hideAjaxLoader();
                }

                // in case if maintenance exit early to prevent error handling
                if (jqXHR.status === 503) {
                    return;
                }

                if (class_opt.enable_response_errors !== false) {
                    if (class_opt.enable_response_errors_human_msg !== false) {
                        HumanMessage.error('Response Error');
                    } else if (class_opt.enable_response_errors_to_console === true) {
                        debug('Response Error');
                    }
                }

                if (callback_error) {
                    callback_error(layout, null);
                }
            }
        });

        return jqXHR;
    } //end private function: gpajaxrequest

    /**
     * @deprecated as public method
     */
    this.get = function(controller, action, params, show_loader, callbackSuccess, http_status_code_options) {
        return gpajaxrequest(controller, action, params, 'GET', callbackSuccess, show_loader, http_status_code_options);
    };

    /**
     * @deprecated as public method
     */
    this.post = function(controller, action, params, show_loader, callbackSuccess) {
        return gpajaxrequest(controller, action, params, 'POST', callbackSuccess, show_loader);
    };

    this.ajaxGet = function(controller, action, params, show_loader, callback) {
        return this._ajax(controller, action, params, show_loader, callback, 'get');
    };

    this.ajaxPost = function(controller, action, params, show_loader, callback) {
        return this._ajax(controller, action, params, show_loader, callback, 'post');
    };

    this._ajax = function(controller, action, params, show_loader, callback, method) {
        var new_callback;

        if (!params) {
            params = {
                town_id: Game.townId
            };
        } else if (!params.town_id) {
            params.town_id = Game.townId;
        }

        // send information for notifications if game is initialized or not
        params.nl_init = NotificationLoader.isGameInitialized();

        if (typeof callback === 'object') {
            new_callback = callback;
        } else {
            new_callback = function(_layout, data, flags, t_token) {
                if (typeof callback === 'function') {
                    callback(data, t_token);
                }
            };
        }

        return this[method](controller, action, params, show_loader, new_callback);
    };

    this.checkBackendDuringMaintenance = function() {
        this.ajaxGet('frontend_bridge', 'fetch', {
            'class_name': 'ApiUpdateDummy',
            'method_name': 'read',
            'version': 1,
            'nl_skip': true,
            'params': {} // skips loading any backbone notifications
        }, false, function() {});
    };

    // exportes used for unit tests
    if (window.DEBUG) {
        this.specs = {
            handleHTTPStatusCode: handleHTTPStatusCode,
            gpajaxrequest: gpajaxrequest,
            _doGpajaxrequest: _doGpajaxrequest,
            locking: locking,
            handleMaintenanceStatusCode: handleMaintenanceStatusCode,
            request_running: request_running
        };
    }
}