/* globals makeDWord, MM, GPWindowMgr, DM */

define('helpers/olympus', function() {
    'use strict';

    var MapHelpers = require('map/helpers'),
        TempleSizes = require('enums/temple_sizes'),
        DateHelper = require('helpers/date'),
        OLYMPUS_MODEL_ID = 1;

    return {
        getTemplePowersArray: function(temple) {
            if (!temple) {
                return [];
            }

            var powers = temple.getBuff();

            powers = Object.keys(powers).map(function(power_id) {
                return {
                    power_id: power_id,
                    configuration: powers[power_id]
                };
            });

            return powers;
        },

        isOlympusTemple: function(temple_id) {
            return typeof MM.getOnlyCollectionByName('Temple').getTempleById(temple_id) !== 'undefined';
        },

        getOlympusTemple: function() {
            var temple = MM.getOnlyCollectionByName('Temple').getTemplesBySize(TempleSizes.OLYMPUS);

            if (temple.length === 1) { //Checking that there is at least and only one olympus temple
                return temple[0];
            }

            return null;
        },

        getTempleByIslandXAndIslandY: function(island_x, island_y) {
            var island_xy = makeDWord(island_y, island_x);
            return MM.getOnlyCollectionByName('Temple').getTempleByIslandXY(island_xy);
        },

        generateTempleLinkByTempleId: function(temple_id) {
            var temple = MM.getOnlyCollectionByName('Temple').getTempleById(temple_id);

            return this.generateTempleLink({
                id: temple.getId(),
                x: temple.getIslandX(),
                y: temple.getIslandY(),
                name: temple.getName()
            });
        },

        generateTempleLink: function(temple_data) {
            var link = document.createElement('a'),
                str_data = '{"tp":"temple","id":' + temple_data.id + ',"ix":' + temple_data.x + ',"iy":' + temple_data.y + ',"res":"' + temple_data.res + '"}';

            link.id = 'temple_' + temple_data.x + '_' + temple_data.y;
            link.className = 'gp_town_link';
            link.href = '#' + btoa(str_data);

            if (temple_data.name) {
                link.innerText = temple_data.name;
            }

            return link;
        },

        generateTempleLinkForMap: function(temple_data, offset) {
            var position = MapHelpers.map2Pixel(temple_data.x, temple_data.y),
                link = this.generateTempleLink(temple_data);

            link.id = 'map_' + link.id;
            link.className = 'temple_link';
            link.style.left = offset.x + position.x + 'px';
            link.style.top = offset.y + position.y + 'px';

            return link;
        },

        openPortalActionWindow: function(action, portal_temple_id, options) {
            var window_action = action.split('_'),
                l10n = DM.getl10n('olympus'),
                action_index = 1;

            options = Object.assign({
                id: portal_temple_id,
                is_portal_command: true
            }, options);

            window_action = window_action[action_index];

            GPWindowMgr.Create(
                GPWindowMgr.TYPE_TOWN,
                l10n.olympus_via_portal, {
                    'action': window_action
                },
                options
            );
        },

        getOlympusModel: function() {
            return MM.getModels().Olympus[OLYMPUS_MODEL_ID];
        },

        getOlympusNextJumpAtTimestamp: function() {
            var olympus = this.getOlympusModel(),
                next_jump_at = olympus.getNextJumpAt();

            return DateHelper.timestampToDateTime(next_jump_at);
        }
    };
});