(function() {
    'use strict';

    //Fields object keeps information about the data which is in the textboxes
    function MassRecruitFieldsStore(objTowns) {
        //Keeps information about what user typed in textboxes (in this hash array are only rows for towns where you can buy something, rest are skipped)
        this.fields = {};
        this.objTowns = objTowns; //@todo
    }

    MassRecruitFieldsStore.prototype.init = function() {
        //Reset
        this.fields = {};

        var i, towns = this.objTowns.getClonedTowns(),
            l = towns.length,
            fields = this.fields;

        //Browse all towns
        for (i = 0; i < l; i++) {
            var town = towns[i];

            //Add entry to hashmap when there is a possibility to build some units
            if (!town.isUnitBuildInactive()) {
                fields[town.getId()] = {};
            }
        }
    };

    MassRecruitFieldsStore.prototype.resetTowns = function() {
        var town_id, fields = this.fields;

        for (town_id in fields) {
            if (fields.hasOwnProperty(town_id)) {
                fields[town_id] = {};
            }
        }
    };

    MassRecruitFieldsStore.prototype.resetRow = function(town_id) {
        var row = this.fields[town_id],
            unit_id;

        for (unit_id in row) {
            if (row.hasOwnProperty(unit_id)) {
                delete row[unit_id];
            }
        }
    };

    MassRecruitFieldsStore.prototype.getRow = function(town_id) {
        return $.extend({}, this.fields[town_id]);
    };

    MassRecruitFieldsStore.prototype.getAllRows = function() {
        return $.extend({}, this.fields);
    };

    MassRecruitFieldsStore.prototype.setUnitCount = function(town_id, unit_id, value) {
        value = parseInt(value, 10);

        if (value === 0 || isNaN(value)) {
            delete this.fields[town_id][unit_id];

            return;
        }

        if (typeof this.fields[town_id] === 'undefined') {
            this.fields[town_id] = this.getRow(town_id);
        }

        this.fields[town_id][unit_id] = Math.min(
            value,
            this.objTowns.getTownById(town_id).getUnitById(unit_id).getMax()
        );
    };

    window.MassRecruitFieldsStore = MassRecruitFieldsStore;
}());