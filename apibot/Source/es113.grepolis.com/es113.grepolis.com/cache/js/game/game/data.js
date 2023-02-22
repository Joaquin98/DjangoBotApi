define('game/data', function() {
    /**
     * Contains units data
     */
    window.GameData.units = [];

    /**
     * Contains powers data
     */
    window.GameData.powers = [];

    /**
     * Contains map size
     */
    window.GameData.map_size = 0;

    /**
     * Adds data to this object
     *
     * @param object data {property : value, ...}
     */
    window.GameData.add = function(data) {
        'use strict';

        jQuery.extend(this, data);
    };

    return window.GameData;
});