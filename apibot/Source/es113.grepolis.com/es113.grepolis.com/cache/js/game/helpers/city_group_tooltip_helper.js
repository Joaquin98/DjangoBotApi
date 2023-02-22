/* global MM */
define('helpers/city_group_tooltip_helper', function() {
    'use strict';

    return {

        /**
         * Getting the data (which should be displayed in the map tooltip) for city groups for specific town
         * @param {Object} town
         * @returns {String|Boolean}
         */
        getCityGroupTooltipData: function(town) {
            var tooltip_data = false,
                town_collection = MM.getOnlyCollectionByName("Town");
            if (town_collection.isMyOwnTown(town.id)) {
                tooltip_data = this.getTownGroupsTextForTown(town);
            }
            return tooltip_data;
        },

        /**
         * Gets the string for the town which will be displayed on the map tooltip for that town.
         * This text contains the name of the town group this town is in, or if the town is in more town groups
         * it will return a (...) string. When there are no town groups there will be returned a false.
         * @param {Object} town
         * @returns {String|Boolean}
         */
        getTownGroupsTextForTown: function(town) {
            var town_groups = MM.getOnlyCollectionByName('TownGroup'),
                towns_in_town_groups = MM.getCollections().TownGroupTown[0];
            var groups_for_given_town = towns_in_town_groups.getTownGroupsForTown(town.id);

            switch (groups_for_given_town.length) {
                case 0:
                    return false;
                case 1:
                    return '(' + town_groups.getTownGroup(groups_for_given_town[0].getGroupId()).getName() + ')';
                default:
                    return ' (...)';
            }
        }
    };
});