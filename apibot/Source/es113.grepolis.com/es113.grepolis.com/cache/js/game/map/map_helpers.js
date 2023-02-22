/**
 * Helper methods for map and map data, used in various places
 */
define('map/helpers', function() {

    var TOWN_TYPES = require('enums/town_types'),
        GameDataMap = require('data/map'),
        CommandsHelper = require('helpers/commands'),
        Features = require("data/features");

    var tileSizeBitWise = {
            x: 7,
            y: 7
        }, // 2 >> x
        tileSize = {
            x: 256,
            y: 128
        };

    return {
        /**
         * returns the type of town.
         *
         * @param {Object} town Town object
         * @return {String}
         *
         */
        getTownType: function(town) {

            if (town.type === TOWN_TYPES.FREE) {
                return TOWN_TYPES.FREE;
            } else if (town.type === TOWN_TYPES.INV_SPO) {
                return TOWN_TYPES.INV_SPO;
            } else if (town.type === TOWN_TYPES.DOMINATION_AREA_MARKER) {
                return TOWN_TYPES.DOMINATION_AREA_MARKER;
            } else if (town.nr >= GameDataMap.getUseableTownSpotsOnIsland()) {
                return TOWN_TYPES.SPECIAL_TOWN;
            } else if (town.expansion_stage === undefined) {
                return TOWN_TYPES.TOWN;
            } else {
                return TOWN_TYPES.FARM_TOWN;
            }
        },

        /**
         * Converts map coordinates to CSS pixel coordinates
         *
         * @param x Number
         * @param y Number
         * @return Object
         */
        map2Pixel: function(x, y) {
            /*jshint bitwise: false*/

            var offset;
            x = +x;
            y = +y;

            // every x-wise odd tile is
            // lowered by half tile height
            if (x & 1) {
                offset = true;
            }
            x <<= tileSizeBitWise.x;
            y <<= tileSizeBitWise.y;

            return {
                x: x,
                y: offset ? y + (tileSize.y >> 1) : y
            };
        },

        /**
         * Converts pixel coordinates to map coordinates
         *
         * @param x Number
         * @param y Number
         * @return Object
         */
        pixel2Map: function(x, y) {
            /*jshint bitwise: false*/

            var mapX = x >> tileSizeBitWise.x,
                // every x-wise odd tile is
                // lowered by half tile height
                mapY = ((mapX & 1) ? (y - (tileSize.y >> 1)) : y) >> tileSizeBitWise.y;

            return {
                x: mapX,
                y: mapY
            };
        },

        getOnGoingColonizationsCount: function() {
            return CommandsHelper.getOnGoingColonizationsCount();
        },

        getColonizedTown: function(town) {
            return window.ITowns.getColonizedTown(town);
        },

        isTempleTile: function(island_type) {
            return Features.isOlympusEndgameActive() && island_type >= 61 && island_type <= 77;
        }
    };
});