/*global jQuery, document, Game, console */

/**
 * Observer Class
 *
 * Refactorization:
 * - GPEvents
 *   - outer_units_changed:'outer_units_changed' never used
 */
(function($, GameEvents) {
    'use strict';

    var $document = $(document);

    var valid_iframe_postmessage = {
        CloseCashshop: GameEvents.premium.close_cash_shop
    };

    //-tracking events
    //- notification events
    //- gp events

    // for GameEvents definition see:
    // js/data/events.js

    function eventHasProperName(event_name) {
        var parts = event_name.split(':'),
            i, l = parts.length,
            test = GameEvents;

        for (i = 0; i < l; i++) {
            if (test[parts[i]]) {
                test = test[parts[i]];
            } else {
                return false;
            }
        }

        return true;
    }

    function prepareEventName(eventName, className, methodName) {
        if (eventName === 'all' && !Game.dev) {
            throw 'Listening to all events is only allowed for debugging!';
        }

        if (!eventName && methodName !== 'unsubscribe') {
            throw 'The "eventName" has to be specified for $.Observer(eventName).' + methodName + '()';
        }

        if (typeof eventName !== 'undefined' && !eventHasProperName(eventName)) {
            throw 'The "eventName" you want to use in $.Observer(eventName).' + methodName + '() is not correctly defined! Current event name: (' + eventName + ')';
        }

        if (!eventName && !className) {
            throw 'One of "eventName" or "className" has to be specified for $.Observer(eventName)...' + eventName + ', ' + className + ' , ' + methodName;
        }

        if (methodName !== 'publish' && !className && Game.dev) {
            console.warn('You did not specified className in $.Observer. Are you sure it\'s correct?', methodName);
        }

        //If className is specified, then event name can be empty
        eventName = eventName || '';

        //If className is cm_context, then change it to string
        if (className && className.main) {
            className = 'window_' + className.main;
        }

        var joined_classname = Array.isArray(className) ? className.join('.') : className;
        return !className ? eventName : eventName + '.' + joined_classname;
    }

    /**
     * Helper function @todo rewrite at home
     */
    function getLength(obj) {
        var propId, counter = 0;

        for (propId in obj) {
            if (obj.hasOwnProperty(propId)) {
                counter += 1;
            }
        }

        return counter;
    }

    /**
     * Helper function @todo rewrite at home
     */
    function displayObjectProperties(data) {
        var obj = data.obj,
            groupTitle = data.groupTitle,
            groupName = data.groupName,
            eventName = data.eventName,
            firstCall = data.firstCall,
            className,

            objProp, length = 0,
            /*subGroupLength = 0,*/
            events = $._data(document, 'events'),
            i, l, listeners, count = 0;

        //var output = {};

        //Take only events with className
        if (groupName && groupName.substr(0, 1) === '.') {
            className = groupName.substr(1);

            console.group('Events found for following class name: ' + className);
            for (objProp in events) {
                if (events.hasOwnProperty(objProp)) {
                    listeners = events[objProp];
                    l = listeners.length;

                    for (i = 0; i < l; i++) {
                        //If we are looking for specific class
                        if ((listeners[i].namespace || '').indexOf(className) > -1) {
                            console.warn('event type: %c"' + listeners[i].type + '"%c || namespace: ' + listeners[i].namespace, 'color:blue', '');
                            //output[count] = {eventType : listeners[i].type, namespace : listeners[i].namespace};

                            count++;
                        }
                    }
                }
            }

            if (!count) {
                console.log('None');
            }

            console.groupEnd();
            //console.table(output, ['eventType', 'namespace']);

            return false;
        }

        //Display all listeners for concrete event name
        if (eventName) {
            displayObjectProperties({
                obj: eventName,
                groupTitle: eventName,
                firstCall: false
            });

            return false;
        }

        if (typeof obj !== 'object') {
            listeners = events[obj] || [];
            l = listeners.length;

            if (l > 0) {
                console.groupCollapsed(groupTitle + ', ' + l + ' listener' + (l === 1 ? '' : 's'));
                for (i = 0; i < l; i++) {
                    console.warn('event type:', listeners[i].type, ' ||| namespace: ', listeners[i].namespace, '||| handler: ', listeners[i].handler);
                }
                console.groupEnd();
            } else {
                console.log(groupTitle + ' (' + obj + ')');
            }

            return false;
        }

        length = getLength(obj);

        if (length > 0) {
            console[firstCall ? 'group' : 'groupCollapsed'](groupTitle);
            for (objProp in obj) {
                if (obj.hasOwnProperty(objProp)) {
                    if (getLength(obj[objProp]) > 0) {
                        if ((groupName && groupName === objProp) || !groupName) {
                            displayObjectProperties({
                                obj: obj[objProp],
                                groupTitle: objProp,
                                firstCall: false
                            });
                        }
                    }
                }
            }
            console.groupEnd();
        } else {
            console.log('None');
        }

        return true;
    }

    $.Observer = function(eventName) {
        return {
            /**
             * Transmits information to all listeners about action which did happen.
             *
             * @param {String|Object} [className]   optionally a class name or array of class names.
             * @param {Object} data                 data which should be provided to all listeners
             *
             * -----------------------------------------------------------------
             *  Example 1:
             *
             *      All subscribers which listens on 'GameEvents.some.event' will
             *      be notified.
             *
             *
             *      $.Observer(GameEvents.some.event).publish({
             *          some_data : 123
             *      });
             *
             * -----------------------------------------------------------------
             *  Example 2:
             *
             *      Only subscribers which listens on 'GameEvents.some.event' and
             *      specified 'some_class' as a class name will be notified.
             *
             *
             *      $.Observer(GameEvents.some.event).publish(['some_class'], {some_data : 123});
             */
            publish: function(className, data) {
                if (!data) {
                    data = className;
                    className = '';
                }

                $document.trigger(prepareEventName(eventName, className, 'publish'), data);

                // also publish to 'all' event
                /*if (Game.dev) {
                	data = data || {};
                	data.gameEventName = eventName;
                	$document.trigger(prepareEventName('all', className, 'publish'), data);
                }*/
            },

            /**
             * Saves information that some part of the code wants to listen on the specific event
             *
             * @param {String|Object} [className]   optional parameter, but highly recommended
             *     That helps with unregistering events, because you can have 2 listeners with following classes:
             *     (1) 'class1' (2) 'class1', 'class2' and when you will call $.Observer().unsubscribe('class2');
             *     only the second listener will be removed. @see also examples from $.Observer().publish() method
             * @param {Function} callback    a function which will be executed when an event happened
             *
             * -----------------------------------------------------------------
             *  Example 1:
             *
             *      Not recommended case. Please use it only if you really understand how it works.
             *      Listeners registered like this are very hardly recognizable and probably
             *      never unregistered.
             *
             *
             *      $.Observer(GameEvents.some.event).subscribe(function(e) {});
             *
             * -----------------------------------------------------------------
             *  Example 2:
             *
             *      Just properly registered listener
             *
             *
             *      $.Observer(GameEvents.some.event).subscribe('class_1', function(e) {});
             *
             * -----------------------------------------------------------------
             *  Example 3:
             *
             *      Listener registered with 2 classes. Sometimes its necessary to unregister/reregister
             *      some listeners during the window is opened. In that cases its good
             *      to specify 2 class names, one global (for example 'window_oktoberfest') and one internal
             *      (for example 'listen_for_beer').
             *
             *
             *      $.Observer(GameEvents.some.event).subscribe(['class_1', 'class_2'], function(e) {});
             */
            subscribe: function(className, callback) {
                //If className is not defined
                if (!callback) {
                    callback = className;
                    className = '';
                }

                if (typeof callback !== 'function') {
                    throw 'Callback must be a function';
                }

                $document.on(prepareEventName(eventName, className, 'subscribe'), callback);
            },

            /**
             * Removes listener
             * -----------------------------------------------------------------
             *  Example 1:
             *
             *      Removes listener using Component Manager context (usually
             *      listener is also registered with the same context - usually
             *      becuase there is a possibility to crate class names by hand).
             *      This way of registering listeners is used with Backbone Windows,
             *      and makes this process much easier.
             *
             *
             *      $.Observer().unsubscribe(cm_context);
             *
             * -----------------------------------------------------------------
             *  Example 2:
             *
             *      Removes all listeners which has class name 'some_class'
             *
             *
             *      $.Observer().unsubscribe('some_class');
             * -----------------------------------------------------------------
             *  Example 3:
             *
             *      Removes all listeners which has all specified classes
             *
             *
             *      $.Observer().unsubscribe(['class_name', 'class_name_x']);
             *
             * -----------------------------------------------------------------
             * Example 4:
             *
             *      Removes only listeners which listen on specific event type
             *      and contains spcific class name.
             *
             *
             *      $.Observer(GameEvents.document.key.shift.down).unsubscribe('class_name');
             *
             * -----------------------------------------------------------------
             *  Example 5:
             *
             *      Removes only listeners which listen on specific event type
             *      and contains spcific class names.
             *
             *
             *      $.Observer(GameEvents.document.key.shift.down).unsubscribe(['class_name', 'class_name_x']);
             */
            unsubscribe: function(className) {
                $document.off(prepareEventName(eventName, className, 'unsubscribe'));
            },

            /**
             * Displays all details about events in the game
             *
             * Usage examples:
             *
             * - show info about all events
             *   $.Observer().status();
             *
             * - show info about one event group
             *   $.Observer().status('building');
             *
             * - show info about one event type:
             *   $.Observer('building:expand').status();
             *
             * - show info about all events with specific class
             *   $.Observer().status('.GameSounds');
             */
            status: function(groupName) {
                console.log('%c==========================================', 'font-weight:bold;color:green;');
                console.log('%cEVENTS MANAGER', 'font-weight:bold;color:green;');
                console.log('%c==========================================', 'font-weight:bold;color:green;');
                console.group('Legend:');
                console.log('Log - indicates that event is known, and has been added to GameEvents list.');
                console.warn('Warrning - indicates that something is listening on this event.');
                console.groupEnd();

                displayObjectProperties({
                    obj: GameEvents,
                    groupTitle: 'EVENTS MANAGER (only registered with $.Observer)',
                    groupName: groupName,
                    eventName: eventName,
                    firstCall: true
                });
            }
        };
    };

    //Publishers for key events
    $document.on('keydown.observer', function(e) {
        var key = e.keyCode,
            is_input = !!(e.target && e.target.tagName.match(/INPUT|TEXTAREA|SELECT|OPTION/));

        $.Observer(GameEvents.document.key_down).publish(e);

        switch (key) {
            case 16: //Shift
                $.Observer(GameEvents.document.key.shift.down).publish(e, is_input);
                break;
            case 27: //ESC
                $.Observer(GameEvents.document.key.esc.down).publish(e, is_input);
                break;
            case 32: //Arrow left
                $.Observer(GameEvents.document.key.space.down).publish(e, is_input);
                break;
            case 37: //Arrow left
                $.Observer(GameEvents.document.key.arrow_left.down).publish(e, is_input);
                break;
            case 39: //Arrow left
                $.Observer(GameEvents.document.key.arrow_right.down).publish(e, is_input);
                break;
        }
    }).on('keyup.observer', function(e) {
        var key = e.keyCode,
            is_input = !!(e.target && e.target.tagName.match(/INPUT|TEXTAREA|SELECT|OPTION/));

        $.Observer(GameEvents.document.key_up).publish(e, is_input);

        switch (key) {
            case 13: //ENTER
                $.Observer(GameEvents.document.key.enter.up).publish(e, is_input);
                break;
            case 16: //Shift
                $.Observer(GameEvents.document.key.shift.up).publish(e, is_input);
                break;
            case 27: //ESC
                $.Observer(GameEvents.document.key.esc.up).publish(e, is_input);
                break;
            case 32: //Arrow left
                $.Observer(GameEvents.document.key.space.up).publish(e, is_input);
                break;
            case 37: //Arrow left
                $.Observer(GameEvents.document.key.arrow_left.up).publish(e, is_input);
                break;
            case 39: //Arrow left
                $.Observer(GameEvents.document.key.arrow_right.up).publish(e, is_input);
                break;
        }
    });


    /**
     * Publish global window.resize event into event system
     */
    $(window).on('resize', function(e) {
        $.Observer(GameEvents.document.window.resize).publish(e);
    });

    /**
     * Publish filtered set of 'message' events to the game events
     *
     * @param {jQuery-Event} e
     */
    $(window).on('message', function(e) {
        var message = (e.originalEvent && e.originalEvent.data) ? e.originalEvent.data : null,
            game_event = valid_iframe_postmessage[message] || null;

        if (game_event) {
            $.Observer(game_event).publish(e);
        }
        e.preventDefault();
        e.stopPropagation();
    });

}(jQuery, window.GameEvents));