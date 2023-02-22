/*globals Game */

define('models/town/town_group', function() {
    "use strict";

    var ALL_GROUP_ID = Game.constants.ui.town_group.all_group_id,
        NO_GROUP_GROUP_ID = Game.constants.ui.town_group.no_group_group_id;

    /**
     * active: false
     * id: 1
     * name: "Group 1"
     * player_id: 4
     * collapsed : null
     */

    var TownGroup = function() {}; // never use this, becasue it will be overwritten

    TownGroup.urlRoot = 'TownGroup';

    /**
     * Returns information whether the town group is active or not
     *
     * @return {Boolean}
     */
    TownGroup.isActive = function() {
        return this.get('active');
    };

    /**
     * Returns town group id
     *
     * @return {Integer}
     */
    TownGroup.getId = function() {
        return this.get('id');
    };

    /**
     * Returns town group name
     *
     * @return {String}
     */
    TownGroup.getName = function() {
        return this.get('name');
    };

    /**
     * Removes town from town group
     *
     * @param {Number} town_id
     */
    TownGroup.removeTown = function(town_id) {
        this.execute('removeTown', {
            id: this.getId(),
            town_id: town_id
        });
    };

    /**
     * Sets group to active
     */
    TownGroup.setActive = function(callback) {
        this.execute('setActive', {
            id: this.getId()
        }, callback);
    };

    /**
     * Sets group to be inactive
     */
    TownGroup.setInactive = function(callback) {
        this.execute('setInactive', null, callback);
    };

    /**
     * Add a town to this town group
     */
    TownGroup.addTown = function(town_id) {
        this.execute('addTown', {
            id: this.getId(),
            town_id: town_id
        });
    };

    /**
     * Returns information whether the group is collapsed or not
     *
     * @return {Boolean}
     */
    TownGroup.isCollapsed = function() {
        var group_id = this.getId();

        if (group_id === ALL_GROUP_ID || group_id === NO_GROUP_GROUP_ID) {
            return parseInt($.cookie('town_group_toggle_' + group_id), 10) === 1;
        } else {
            return this.get('collapsed') === true;
        }
    };

    /**
     * Toggles the display state of the town group
     */
    TownGroup.toggleCollapsed = function() {
        this.execute('toggleCollapsed', {
            id: this.getId()
        });
    };

    TownGroup.isRealTownGroup = function() {
        var group_id = this.getId();

        return group_id !== ALL_GROUP_ID && group_id !== NO_GROUP_GROUP_ID;
    };

    window.GameModels.TownGroup = GrepolisModel.extend(TownGroup);
    return window.GameModels.TownGroup;
});