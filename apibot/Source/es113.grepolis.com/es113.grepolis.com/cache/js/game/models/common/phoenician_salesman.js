/*global define, Game */

(function() {
    "use strict";

    var PhoenicianSalesman = function() {};

    PhoenicianSalesman.urlRoot = 'PhoenicianSalesman';

    PhoenicianSalesman.getArrivalAt = function() {
        return this.get('arrival_at');
    };

    PhoenicianSalesman.getCurrentTownId = function() {
        return this.get('current_town_id');
    };

    PhoenicianSalesman.isInCurrentTown = function() {
        return this.getCurrentTownId() === Math.floor(Game.townId);
    };

    PhoenicianSalesman.getId = function() {
        return this.get('id');
    };

    PhoenicianSalesman.getNextTownId = function() {
        return this.get('next_town_id');
    };

    PhoenicianSalesman.onCurrentTownChange = function(view, callback) {
        view.listenTo(this, 'change:current_town_id', callback);
    };

    window.GameModels.PhoenicianSalesman = GrepolisModel.extend(PhoenicianSalesman);
}());