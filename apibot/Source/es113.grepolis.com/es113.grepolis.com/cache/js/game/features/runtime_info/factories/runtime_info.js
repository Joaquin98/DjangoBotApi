define('features/runtime_info/factories/runtime_info', function() {
    'use strict';

    var WF = require_legacy('WF');
    var WQM = require_legacy('WQM');
    var windows = require('game/windows/ids');
    var priorities = require('game/windows/priorities');

    return {
        /**
         * @param data {number} indicates a town_id {object} indicates a spot target_x,y,number_on_island
         * @param options {Object}
         */
        openWindow: function(data, options) {
            var window_type = windows.RUNTIME_INFO;
            WQM.addQueuedWindow({
                type: window_type,
                priority: priorities.getPriority(window_type),
                open_function: function() {
                    window.WM.closeWindowsByType(window_type);
                    var args = {};

                    if (us.isNumber(data)) {
                        args.target_town_id = data;
                    } else {
                        args.island_coordinates = {
                            x: data.target_x,
                            y: data.target_y,
                            spot: data.target_number_on_island
                        };
                    }

                    args.is_portal_command = (options && options.is_portal_command) ? options.is_portal_command : false;

                    return WF.open(window_type, {
                        args: args
                    });
                }
            });
        }
    };
});