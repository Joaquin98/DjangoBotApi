define('features/collected_items/factories/collected_items', function(require) {
    'use strict';

    var WF = require_legacy('WF'),
        WQM = require_legacy('WQM'),
        windows = require('game/windows/ids'),
        priorities = require('game/windows/priorities'),
        BenefitHelper = require('helpers/benefit'),
        PlayerHintsHelper = require('helpers/player_hints');

    var CollectWindowFactory = {
        openWindow: function() {
            var window_type = windows.COLLECTED_ITEMS,
                window_skin = BenefitHelper.getBenefitSkin();

            if (!PlayerHintsHelper.isHintEnabled('collected_items')) {
                return;
            }

            WQM.addQueuedWindow({
                type: window_type,
                priority: priorities.getPriority(window_type),
                open_function: function() {
                    return WF.open(window_type, {
                        args: {
                            window_skin: window_skin
                        }
                    });
                }
            });
        }
    };

    window.CollectWindowFactory = CollectWindowFactory;

    return CollectWindowFactory;
});