/*globals MM*/

define('collections/town/town_group_towns', function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var TownGroupTown = window.GameModels.TownGroupTown;
    var StringSorter = window.StringSorter;

    var TownGroupTowns = function() {}; // never use this, becasue it will be overwritten

    TownGroupTowns.model = TownGroupTown;
    TownGroupTowns.model_class = 'TownGroupTown';
    TownGroupTowns.refetch_finished = 'refetch_finished';

    TownGroupTowns.initialize = function() {
        var sorter = new StringSorter();

        this.comparator = function(a, b) {
            return sorter.compare(a.getTownName(), b.getTownName());
        };

    };

    TownGroupTowns.sortTowns = function() {
        var sorter = new StringSorter();

        this.models = sorter.compareObjectsByFunction(this.models, function(a) {
            return a.getTownName();
        });
    };

    TownGroupTowns.getTowns = function(town_group_id) {
        // we do not need to sort it again, because it is already sorted inside of this
        return this.filter(function(town_group_town) {
            return town_group_town.getGroupId() === town_group_id;
        });
    };

    TownGroupTowns.getTownGroupsForTown = function(town_id) {
        return this.filter(function(town_group_town) {
            return town_group_town.getTownId() === town_id &&
                town_group_town.getGroupId() > 0;
        });
    };

    TownGroupTowns.getAllTownGroupsForTown = function(town_id) {
        return this.filter(function(town_group_town) {
            return town_group_town.getTownId() === town_id;
        });
    };

    TownGroupTowns.removeTownFromAllTownGroups = function(town_id) {
        var all_town_groups_with_this_town = this.getAllTownGroupsForTown(town_id);
        all_town_groups_with_this_town.forEach(function(town_group_model) {
            MM.removeModel(town_group_model);
        });
    };

    /**
     * Returns number of towns which are in the specific town group
     *
     * @param {Number} town_group_id
     *
     * @return {Number}
     */
    TownGroupTowns.getTownsCount = function(town_group_id) {
        return this.getTowns(town_group_id).length;
    };

    /**
     * Returns information whether the town group contains any towns or not
     *
     * @param {Number} town_group_id
     *
     * @return {Boolean}
     */
    TownGroupTowns.isGroupEmpty = function(town_group_id) {
        return this.getTownsCount(town_group_id) === 0;
    };

    /**
     * Returns information whether the town group contains specific town or not
     *
     * @param {Integer} town_group_id
     * @param {Integer} selected_town_id
     *
     * @return {Boolean}
     */
    TownGroupTowns.hasTown = function(town_group_id, town_id) {
        var town, towns = this.getTowns(town_group_id),
            i, l = towns.length;

        for (i = 0; i < l; i++) {
            town = towns[i];

            if (town.getTownId() === town_id) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns id of the town which is placed on the town group list before
     * the town which id is specified as an argument
     *
     * @param {Integer} town_group_id
     * @param {Integer} selected_town_id
     *
     * @return {Integer}
     */
    TownGroupTowns.getPrevTownId = function(town_group_id, town_id) {
        var town, prev_town, towns = this.getTowns(town_group_id),
            i, l = towns.length;

        for (i = 0; i < l; i++) {
            town = towns[i];
            prev_town = i === 0 ? towns[l - 1] : towns[i - 1];

            if (town.getTownId() === town_id) {
                return prev_town.getTownId();
            }
        }

        //In case when we switched groups, the town_id will not be found
        if (l > 0) {
            return towns[0].getTownId();
        }

        return -1;
    };

    TownGroupTowns.getNextTownId = function(town_group_id, town_id) {
        var town, next_town, towns = this.getTowns(town_group_id),
            i, l = towns.length;

        for (i = 0; i < l; i++) {
            town = towns[i];
            next_town = i === l - 1 ? towns[0] : towns[i + 1];

            if (town.getTownId() === town_id) {
                return next_town.getTownId();
            }
        }

        //In case when we switched groups, the town_id will not be found
        if (l > 0) {
            return towns[0].getTownId();
        }

        return -1;
    };

    TownGroupTowns.reFetch = function(cb, options) {
        var triggerCustomFinishEvent = function() {
            this.trigger(TownGroupTowns.refetch_finished);
        }.bind(this);

        return GrepolisCollection.prototype.reFetch.apply(this, arguments).then(triggerCustomFinishEvent);
    };

    TownGroupTowns.onRefetchFinished = function(obj, callback) {
        obj.listenTo(this, TownGroupTowns.refetch_finished, callback);
    };

    window.GameCollections.TownGroupTowns = GrepolisCollection.extend(TownGroupTowns);

    return window.GameCollections.TownGroupTowns;
});