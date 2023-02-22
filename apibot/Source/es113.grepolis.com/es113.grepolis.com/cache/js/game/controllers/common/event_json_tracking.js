/**
 * Base class that can be used for all event window controllers to dispatch JSON tracking events
 * for opening and closing window actions.
 */
define('controllers/common/event_json_tracking', function(require) {
    'use strict';

    var EventJsonTrackingController,
        eventTracking = require_legacy('eventTracking'),
        GameControllers = require_legacy('GameControllers'),
        EVENT_SCREEN = require('enums/json_tracking').EVENT_SCREEN;

    EventJsonTrackingController = GameControllers.TabController.extend({

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);

            this.setOnAfterClose(function() {
                eventTracking.logJsonEvent(EVENT_SCREEN, {
                    'screen_name': this.attributes.window_type,
                    'action': 'close',
                    'ingame_event_name': this.attributes.happening_name
                });
            });
        }
    });

    return EventJsonTrackingController;
});