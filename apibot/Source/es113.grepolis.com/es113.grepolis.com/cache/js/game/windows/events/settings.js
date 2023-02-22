define('windows/events/settings', function() {
    var window_settings = {
        collected_items: {
            battleships: {
                minwidth: 521,
                minheight: 364,
                width: 521
            },
            christmas: {
                minwidth: 589,
                minheight: 384,
                width: 589
            },
            epic_battle: {
                minwidth: 589,
                minheight: 384,
                width: 589
            }
        }
    };

    return {
        getWindowSettings: function(window_type, skin) {
            var settings = window_settings[window_type];
            return settings && settings[skin] ? settings[skin] : {};
        }
    };
});