define('factories/windows/quest_welcome_window_factory', function() {
    'use strict';

    var WF = require_legacy('WF');
    var WQM = require_legacy('WQM');
    var windows = require('game/windows/ids');
    var priorities = require('game/windows/priorities');
    var window_type = windows.QUEST_WELCOME;

    return {
        openWindow: function(quest_model) {
            WQM.addQueuedWindow({
                type: window_type,
                priority: priorities.getPriority(window_type),
                open_function: function() {
                    return WF.open(window_type, {
                        models: {
                            progressable: quest_model
                        }
                    });
                }
            });
        }
    };
});