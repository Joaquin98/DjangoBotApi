define('features/collected_items/windows/collected_items', function(require) {
    'use strict';

    var windows = require('game/windows/ids'),
        tabs = require('game/windows/tabs'),
        CollectedItemsController = require('features/collected_items/controllers/collected_items'),
        WindowFactorySettings = require_legacy('WindowFactorySettings'),
        window_type = windows.COLLECTED_ITEMS,
        WindowSettingsHelper = require('helpers/event_window_settings');

    WindowFactorySettings[window_type] = function(props) {
        var options = {
            tabs: [{
                type: tabs.INDEX,
                content_view_constructor: CollectedItemsController,
                hidden: true
            }],
            window_settings: {
                minimizable: false
            }
        };

        return WindowSettingsHelper.getEventWindowSettings(window_type, options, props);
    };

    return WindowFactorySettings[window_type];
});