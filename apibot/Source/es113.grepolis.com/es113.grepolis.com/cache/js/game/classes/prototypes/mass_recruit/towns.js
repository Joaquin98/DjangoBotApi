/*globals MassRecruitTown */

(function() {
    "use strict";

    function MassRecruitTowns(towns, gods_favor) {
        this.towns = towns.clone();
        this.gods_favor = gods_favor;
        this.towns_obj = [];

        //Initialize objects for each town
        this._createTownObjects(towns);
    }

    MassRecruitTowns.prototype.getTownById = function(town_id) {
        town_id = parseInt(town_id, 10);

        return this.towns_obj.filter(function(element /*, i*/ ) {
            return element.getId() === town_id;
        })[0];
    };

    MassRecruitTowns.prototype._createTownObjects = function(towns) {
        var i, l = towns.length;

        for (i = 0; i < l; i++) {
            this.towns_obj[this.towns_obj.length] = new MassRecruitTown(towns[i], this.gods_favor);
        }
    };

    MassRecruitTowns.prototype.getClonedTowns = function() {
        return this.towns_obj.clone();
    };

    MassRecruitTowns.prototype.getTowns = function() {
        return this.towns_obj;
    };

    window.MassRecruitTowns = MassRecruitTowns;
}());