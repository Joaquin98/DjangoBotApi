/*globals Game */

define("models/town/town_group_town", function() {
    "use strict";

    /**
     * group_id: 1
     * id: "1_93"
     * town_id: 93
     */

    var TownGroupTown = function() {}; // never use this, becasue it will be overwritten

    TownGroupTown.town_model = null;

    TownGroupTown.getTownModel = function() {
        if (!this.town_model) {
            //This works only because town_id will never change
            this.town_model = new TownRelationProvider(this.getTownId()).getModel();
        }

        return this.town_model;
    };

    TownGroupTown.urlRoot = 'TownGroupTown';

    TownGroupTown.getGroupId = function() {
        return this.get('group_id');
    };

    TownGroupTown.getTownId = function() {
        return this.get('town_id');
    };

    TownGroupTown.getTownName = function() {
        return this.getTownModel().getName();
    };

    TownGroupTown.getId = function() {
        return this.get('id');
    };

    TownGroupTown.isCurrentTown = function() {
        return this.getTownId() === parseInt(Game.townId, 10);
    };

    window.GameModels.TownGroupTown = GrepolisModel.extend(TownGroupTown);

    return window.GameModels.TownGroupTown;
});