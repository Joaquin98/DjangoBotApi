define('features/strategic_map_filter/factories/strategic_map_filter', function() {
    'use strict';

    var WF = require_legacy('WF');
    var WQM = require_legacy('WQM');
    var windows = require('game/windows/ids');
    var priorities = require('game/windows/priorities');
    var window_type = windows.STRATEGIC_MAP_FILTER;

    return {
        openWindow: function() {
            WQM.addQueuedWindow({
                type: window_type,
                priority: priorities.getPriority(window_type),
                open_function: function() {
                    return WF.open(window_type);
                }
            });
        },

        closeWindow: function() {
            window.WM.closeWindowsByType(window_type);
        }
    };
});