/* global MM, Game, WMap, GameEvents, Minimap */
define('helpers/map_color_changes', function() {
    'use strict';

    var DefaultColors = require('helpers/default_colors');
    var FILTERS = require('enums/filters');

    var MapColorChangesHelper = {

        /**
         * Assign a new color to a player, alliance, pact or enemy
         * @param {String} color - color to assign
         * @param {String} type - the type of assignment (alliance, player, pact, enemy)
         * @param {String} id - the id of the player/alliance
         * @param {String} info - if the assignment from info screen
         */
        assignColor: function(color, type, id, info) {
            /*
             * when it is about the players alliance (own_alliance), we will get the type alliance but with a 0 as id
             * So this change will be saved in a new variable, but we still need the alliance type because of the
             * flag images on the map
             */
            var color_type = type,
                color_other_id = id;
            if (type === FILTERS.FILTER_TYPES.ALLIANCE && id === Game.alliance_id) {
                color_type = FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE;
                color_other_id = 0;
            } else if (type === FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE) {
                type = FILTERS.FILTER_TYPES.ALLIANCE;
                id = Game.alliance_id;
            }
            MM.getOnlyCollectionByName('CustomColor').assignColor({
                type: color_type,
                other_id: color_other_id,
                color: color
            }, function(data) {
                WMap.mapData.updateColors(data.town_ids, color);
                this.changeColorsOnMap(data.town_ids, type, color);
                if (info && data.town_ids.length > 0) {
                    var element = $('.info_tab_content[data-' + type + '="' + id + '"]');
                    element.find('.actual_flag').css('background-color', '#' + color);
                }
                $.Observer(GameEvents.color_picker.change_color).publish({
                    color: color,
                    type: color_type,
                    id: color_other_id
                });
            }.bind(this));
        },

        /**
         * Remove custom color assignment - set color to default color
         */
        removeColorAssignment: function(color, type, id, info, additional_id) {
            var color_type = type,
                color_other_id = id;
            if (type === FILTERS.FILTER_TYPES.ALLIANCE && id === Game.alliance_id) {
                color_type = FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE;
                color_other_id = 0;
            } else if (type === FILTERS.ALLIANCE_TYPES.OWN_ALLIANCE) {
                type = FILTERS.FILTER_TYPES.ALLIANCE;
                id = Game.alliance_id;
            }
            MM.getOnlyCollectionByName('CustomColor').removeColorAssignment({
                type: color_type,
                other_id: color_other_id
            }, function(data) {
                var color = DefaultColors.getDefaultColor(type, id, additional_id);
                WMap.mapData.updateColors(data.town_ids, color);
                this.changeColorsOnMap(data.town_ids, type, color);
                if (info && data.town_ids.length > 0) {
                    var element = $('.info_tab_content[data-' + type + '="' + id + '"]');
                    element.find('.actual_flag').css('background-color', '#' + color);
                }
                $.Observer(GameEvents.color_picker.change_color).publish({
                    color: color,
                    type: color_type,
                    id: color_other_id
                });
            }.bind(this));
        },

        /**
         * Changes flag-color on WMap, also updates the big flag inside the info-tab
         */
        changeColorsOnMap: function(town_ids, type, color) {
            if ($('#minimap_canvas #minimap').css('display') !== 'none') {
                Minimap.refresh({
                    center_on_current_town: false
                });
            }

            // change flag color in map
            $.each(town_ids, function(id, town_id) {
                var elem = $('#town_flag_' + town_id);
                if (typeof elem !== 'undefined') {
                    // change style
                    elem.css({
                        backgroundColor: '#' + color
                    });
                }
            });
        }
    };

    return MapColorChangesHelper;
});