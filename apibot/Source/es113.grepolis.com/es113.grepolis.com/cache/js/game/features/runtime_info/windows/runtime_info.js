define('features/runtime_info/windows/runtime_info', function() {
    'use strict';

    var windows = require('game/windows/ids');
    var tabs = require('game/windows/tabs');
    var RuntimeController = require('features/runtime_info/controllers/runtime_info');
    var WindowFactorySettings = require_legacy('WindowFactorySettings');
    var DM = require_legacy('DM');
    var window_type = windows.RUNTIME_INFO;

    WindowFactorySettings[window_type] = function(props) {
        props = props || {};

        var l10n = DM.getl10n(window_type);

        return us.extend({
            window_type: window_type,
            height: 530,
            width: 400,
            tabs: [{
                type: tabs.INDEX,
                title: l10n.tabs[0],
                content_view_constructor: RuntimeController,
                hidden: true
            }],
            max_instances: 1,
            activepagenr: 0,
            title: l10n.window_title
        }, props);
    };

    return WindowFactorySettings[window_type];
});