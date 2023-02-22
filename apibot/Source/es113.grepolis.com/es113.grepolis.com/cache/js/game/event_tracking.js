/* globals gpAjax */

(function() {
    'use strict';

    window.eventTracking = function eventTracking() {
        this.logJsonEvent = function(definition_id, data) {
            gpAjax.ajaxPost(
                'event_tracking',
                'log_json_event', {
                    'definition_id': definition_id,
                    'data': data
                },
                false,
                function() {}
            );
        };

        return this;
    }.call({});
}());