define('helpers/window_infos', function() {
    'use strict';

    var GameWindowInfoData = require('game/game/infos');

    var HelperWindowInfos = {
        getMinSupportedWindowWidth: function() {
            return GameWindowInfoData.MIN_SUPPORTED_WINDOW_WIDTH;
        }
    };

    return HelperWindowInfos;
});