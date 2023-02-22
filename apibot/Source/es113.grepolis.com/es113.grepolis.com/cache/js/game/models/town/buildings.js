/*global us */

(function() {
    "use strict";

    var Buildings = GrepolisModel.extend({
        urlRoot: 'Buildings',

        /**
         * Returns level of the building
         *
         * @param {String} building_id    string which represents building id
         *
         * @return {Number}   returns building level
         */
        getBuildingLevel: function(building_id) {
            return this.has(building_id) ? this.get(building_id) : 0;
        },

        hasBuildingWithLevel: function(building_id, level) {
            return this.has(building_id) && parseInt(this.get(building_id), 10) >= parseInt(level, 10);
        },

        getLevels: function() {
            var levels = us.clone(this.attributes); //@todo can not be "toJSON()" ?

            //Remove not important stuff
            delete levels.id;

            return levels;
        },

        getBuildings: function() {
            var buildings = this.toJSON();

            delete buildings.id;

            return buildings;
        },

        /**
         * Binds a listener which will be executed when building level will change
         *
         * @param {Object} obj          object which is listening on changes
         * @param {Function} callback
         */
        onBuildingLevelChange: function(obj, callback) {
            obj.listenTo(this, 'change', callback);
        },

        onBuildingStorageLevelChange: function(obj, callback) {
            obj.listenTo(this, 'change:storage', callback);
        },

        onBuildingFarmLevelChange: function(obj, callback) {
            obj.listenTo(this, 'change:farm', callback);
        },

        onBuildingMarketLevelChange: function(obj, callback) {
            obj.listenTo(this, 'change:market', callback);
        }
    });

    window.GameModels.Buildings = Buildings;
}());