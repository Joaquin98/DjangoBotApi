/*global Backbone */

(function() {
    "use strict";

    var SenateBuildingModel = Backbone.Model.extend({
        getId: function() {
            return this.get('id');
        },

        getName: function() {
            return this.get('name');
        },

        getLevel: function() {
            return this.get('level');
        }
    });

    window.GameModels.SenateBuildingModel = SenateBuildingModel;
}());