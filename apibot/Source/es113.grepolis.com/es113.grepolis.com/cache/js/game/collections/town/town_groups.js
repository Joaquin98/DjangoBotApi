/*global Game */
define("collections/town/town_groups", function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var TownGroup = window.GameModels.TownGroup;
    var StringSorter = window.StringSorter;

    var ALL_GROUP_ID = Game.constants.ui.town_group.all_group_id,
        NO_GROUP_GROUP_ID = Game.constants.ui.town_group.no_group_group_id;

    var TownGroups = function() {}; // never use this, becasue it will be overwritten

    TownGroups.model = TownGroup;
    TownGroups.model_class = 'TownGroup';

    /**
     * Returns array of town groups
     *
     * @return {Array}
     */
    TownGroups.getTownGroups = function() {
        var group_id, group, groups = this.models.clone(),
            i, l = groups.length,
            sorted = [],
            all_towns_group, no_group_group, sorter = new StringSorter();

        for (i = 0; i < l; i++) {
            group = groups[i];
            group_id = group.getId();

            if (group_id === ALL_GROUP_ID) {
                all_towns_group = group;
            } else if (group_id === NO_GROUP_GROUP_ID) {
                no_group_group = group;
            } else {
                sorted.push(group);
            }
        }

        sorted = sorter.compareObjectsByFunction(sorted, function(group) {
            return group.getName();
        });

        if (all_towns_group) {
            sorted.unshift(all_towns_group);
        }

        if (no_group_group) {
            sorted.push(no_group_group);
        }

        return sorted;
    };

    /**
     * Prepares town groups data to be displayed in the dropdown component
     *
     * @return {Array}
     */
    TownGroups.getTownGroupsForDropdown = function() {
        var town_groups = this.getTownGroups(),
            town_group,
            i, l = town_groups.length,
            options = [];

        for (i = 0; i < l; i++) {
            town_group = town_groups[i];

            //Ommit Keine gruppe
            if (town_group.getId() !== NO_GROUP_GROUP_ID) {
                options.push({
                    value: town_group.getId(),
                    name: town_group.getName()
                });
            }
        }

        return options;
    };

    /**
     * Returns group model depends on the group id
     *
     * @param {Integer} group_id
     *
     * @return {GameModels.TownGroup}
     */
    TownGroups.getTownGroup = function(group_id) {
        return this.get(group_id);
    };

    /**
     * Makes group active depends on the group id
     *
     * @param {Integer} group_id
     *
     */
    TownGroups.makeTownGroupActive = function(group_id, callbacks) {
        var town_group = this.getTownGroup(group_id);

        town_group.setActive(callbacks);
    };

    /**
     * Returns id of the active group or ALL_GROUP_ID if no group is selected
     *
     * @return {Integer}
     */
    TownGroups.getActiveGroupId = function() {
        //There should be always only one model returned
        var models = this.where({
            active: true
        });

        return models.length ? models[0].getId() : ALL_GROUP_ID;
    };

    TownGroups.getTownGroupsCount = function() {
        return this.models.length;
    };

    /**
     * Temporary function to handle all towns and 'keine gruppe' groups
     */
    TownGroups.triggerCollapsedChange = function(state) {
        this.changed = {
            collapsed: state
        }; // backbone internal stuff
        this.trigger('change:collapsed', this, state);
    };

    TownGroups.onTownGroupCollapsedChange = function(callback, context) {
        this.on('change:collapsed', callback, context);
    };

    /**
     * Triggers an event for each change on the {GameModels.TownGroup} model. So for example,
     * when town groups is changed, two events are triggered, for previously active group and currently active
     *
     * @param {Function} callback
     * @param {Object} context
     */
    TownGroups.onTownGroupActiveChange = function(callback, context) {
        this.on('change:active', callback, context);
    };

    /**
     * Triggers an event only for the town group which has been activated
     *
     * @param {Function} callback
     * @param {Object} context
     */
    TownGroups.onTownGroupActivation = function(callback, context) {
        this.onTownGroupActiveChange(function(town_group_model, value) {
            if (value === true && typeof callback === 'function') {
                callback.apply(this, arguments);
            }
        }, context);
    };

    window.GameCollections.TownGroups = GrepolisCollection.extend(TownGroups);

    return window.GameCollections.TownGroups;
});