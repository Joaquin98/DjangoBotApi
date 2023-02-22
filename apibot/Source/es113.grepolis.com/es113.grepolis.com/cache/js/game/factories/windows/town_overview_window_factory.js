/*globals Overviews, _ */

window.TownOverviewWindowFactory = (function() {
    'use strict';

    return {
        openTownGroupOverview: function() {
            return Overviews.openOverview('town_group_overview', 'town_group_overviews');
        },

        /**
         * Opens overview window with trade tab preselected
         */
        openTradeOverview: function() {
            return Overviews.openOverview('trade_overview', 'town_overviews');
        },

        /**
         * Opens overview window with commands tab preselected
         */
        openCommandOverview: function() {
            return Overviews.openOverview('command_overview', 'town_overviews');
        },

        /**
         * Opens overview window with mass recruit tab preselected
         */
        openMassRecruitOverview: function() {
            return Overviews.openOverview('recruit_overview', 'town_overviews');
        },

        /**
         * Opens overview window with units tab preselected
         */
        openUnitsOverview: function() {
            return Overviews.openOverview('unit_overview', 'town_overviews');
        },

        /**
         * Opens overview window with outer units tab preselected
         */
        openOuterUnitsOverview: function() {
            return Overviews.openOverview('outer_units', 'town_overviews');
        },

        /**
         * Opens overview window with buildings tab preselected
         */
        openBuildingsOverview: function() {
            return Overviews.openOverview('building_overview', 'town_overviews');
        },

        /**
         * Opens overview window with culture tab preselected
         */
        openCultureOverview: function() {
            return Overviews.openOverview('culture_overview', 'town_overviews');
        },

        /**
         * Opens overview window with gods tab preselected
         */
        openGodsOverview: function() {
            return Overviews.openOverview('gods_overview', 'town_overviews');
        },

        /**
         * Opens overview window with hides tab preselected
         */
        openHidesOverview: function() {
            return Overviews.openOverview('hides_overview', 'town_overviews');
        },

        /**
         * Opens overview window with town groups tab preselected
         */
        openTownGroupsOverview: function() {
            return Overviews.openOverview('town_group_overview', 'town_overviews');
        },

        /**
         * Opens overview window with towns tab preselected
         */
        openTownsOverview: function() {
            return Overviews.openOverview('towns_overview', 'town_overviews');
        },

        /**
         * opening standard overviews
         */
        openOverview: function(name) {
            return Overviews.openOverview(name);
        }
    };
}());