define('features/custom_colors/factories/custom_colors', function() {
    'use strict';

    var WF = require_legacy('WF');
    var WQM = require_legacy('WQM');
    var windows = require('game/windows/ids');
    var priorities = require('game/windows/priorities');
    var window_type = windows.CUSTOM_COLORS;

    return {
        openWindow: function() {
            WQM.addQueuedWindow({
                type: window_type,
                priority: priorities.getPriority(window_type),
                open_function: function() {
                    return WF.open(window_type);
                }
            });
        }
    };
});