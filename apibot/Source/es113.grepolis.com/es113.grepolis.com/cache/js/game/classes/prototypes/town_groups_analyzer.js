/*globals window*/

define("classes/prototypes/town_groups_analyzer", function() {
    "use strict";

    /**
     * Prepares data for town groups list controller which will render them as a HTML list
     *
     * @param {GameCollections.TownGroups} towns_groups_collecton
     * @param {GameCollections.TownGroupTowns} town_groups_towns_collection
     *
     * @constructor
     */
    function TownGroupsAnalyzer(towns_groups_collecton, town_groups_towns_collection) {
        this.towns_groups_collecton = towns_groups_collecton;
        this.town_groups_towns_collection = town_groups_towns_collection;
    }

    TownGroupsAnalyzer.prototype.MAX_ROWS_PER_COLUMN_COUNT = 24;
    TownGroupsAnalyzer.prototype.MAX_COL_COUNT = 3;
    TownGroupsAnalyzer.prototype.SINGLE_GROUP_MAX_COL_COUNT = 3;
    TownGroupsAnalyzer.prototype.SINGLE_GROUP_MAX_ROWS_PER_SUB_GROUP = 14;
    TownGroupsAnalyzer.prototype.SINGLE_GROUP_SPACE_ROWS = 1;
    TownGroupsAnalyzer.prototype.TITLE_ROW_SIZE = 1;

    /**
     * Returns town groups
     * @see TownGroups.getTownGroups()
     *
     * @return {Array}
     */
    TownGroupsAnalyzer.prototype.getTownGroups = function() {
        return this.towns_groups_collecton.getTownGroups();
    };

    /**
     * Returns number of towns which are in specific group
     *
     * @param {Integer} group_id
     *
     * @return {Integer}
     */
    TownGroupsAnalyzer.prototype.getTownCountInGroup = function(group_id) {
        return this.town_groups_towns_collection.getTownsCount(group_id);
    };

    /**
     * Returns number of visible towns in the group
     *
     * @param group
     * @param num_towns_in_group
     * @param max_visible_per_group
     * @returns {number}
     */
    TownGroupsAnalyzer.prototype.getVisibleTownsCount = function(group, num_towns_in_group, max_visible_per_group) {
        var num_visible = Math.min(num_towns_in_group, max_visible_per_group);

        if (group.isCollapsed()) {
            //0 - because no town is visible
            num_visible = 0;
        } else if (num_towns_in_group === 0) {
            //1 - because no town is visible, but there is a message "No Towns"
            num_visible = 1;
        }

        return num_visible;
    };

    TownGroupsAnalyzer.prototype.getLastRowPosition = function(num_towns_in_group) {
        var sub_group_count = Math.floor(num_towns_in_group / this.SINGLE_GROUP_MAX_ROWS_PER_SUB_GROUP);

        return Math.ceil(sub_group_count / this.SINGLE_GROUP_MAX_COL_COUNT) - 1;
    };

    TownGroupsAnalyzer.prototype.getAnalyzedData = function() {
        var groups = this.getTownGroups();

        var groups_count = groups.length;

        // name as title counts as row so "-1"
        var max_visible_per_group = Math.floor(this.MAX_ROWS_PER_COLUMN_COUNT / Math.ceil(groups_count / this.MAX_COL_COUNT)) - 1;
        // var max_visible_per_group = Math.floor((this.MAX_ROWS_PER_COLUMN_COUNT * this.MAX_COL_COUNT) / groups_count) - 1;

        var i, group, group_data, sub_group_data, num_visible, num_towns_in_group, rows_left, prev_group, data = [],
            filled_col_rows = [0, 0, 0];

        for (i = 0; i < groups_count; i++) {
            group = groups[i];

            num_towns_in_group = this.getTownCountInGroup(group.getId());

            // number of towns visible in the group
            num_visible = this.getVisibleTownsCount(group, num_towns_in_group, max_visible_per_group);

            group_data = {
                id: group.getId(), //group_id
                num: num_towns_in_group,
                num_visible: num_visible
            };

            // extend only group to sub groups with height of one visible column (without scrolling)
            if (groups_count === 1) {
                group_data.sub_groups = [];

                var last_row = this.getLastRowPosition(num_towns_in_group);
                var num_left = num_towns_in_group;
                var j = 0;

                while (num_left) {
                    var num = Math.min(num_left, this.SINGLE_GROUP_MAX_ROWS_PER_SUB_GROUP);

                    sub_group_data = {
                        num: num,
                        num_visible: num,
                        col: j % this.SINGLE_GROUP_MAX_COL_COUNT,
                        row: Math.floor(j / this.SINGLE_GROUP_MAX_COL_COUNT) * (this.SINGLE_GROUP_MAX_ROWS_PER_SUB_GROUP + this.SINGLE_GROUP_SPACE_ROWS)
                    };

                    if (sub_group_data.row < last_row) {
                        sub_group_data.num_visible += this.SINGLE_GROUP_SPACE_ROWS;
                    }

                    group_data.sub_groups.push(sub_group_data);
                    num_left -= num;
                    j++;
                }
            }

            // rows left to fill in the current column (+1 for the title)
            rows_left = prev_group ? this.MAX_ROWS_PER_COLUMN_COUNT - (prev_group.row + prev_group.num_visible + this.TITLE_ROW_SIZE) : 0;

            // first group (all towns group)
            if (!prev_group) {
                group_data.col = 0;
                group_data.row = 0;

                if (!group.isCollapsed()) {
                    // expand up to column height
                    group_data.num_visible = Math.min(group_data.num, this.MAX_ROWS_PER_COLUMN_COUNT);
                }

                rows_left = this.MAX_ROWS_PER_COLUMN_COUNT - group_data.num_visible - 1;

                var total_rows_left = this.MAX_ROWS_PER_COLUMN_COUNT * this.MAX_COL_COUNT - group_data.num_visible;
                max_visible_per_group = Math.floor(total_rows_left / (groups_count - 1)) - 1;
            }
            // too big for same column and number of columns is not exceeded
            else if ((num_visible + 1) > rows_left && (prev_group.col + 1 < this.MAX_COL_COUNT)) {
                group_data.col = prev_group.col + 1;

                group_data.row = 0;

                // expand previous group to fill empty space
                if (data[i - 1].num_visible > 1) {
                    filled_col_rows[prev_group.col] -= data[i - 1].num_visible;
                    data[i - 1].num_visible = Math.min(prev_group.num_visible + rows_left, prev_group.num);

                    filled_col_rows[prev_group.col] += data[i - 1].num_visible;
                }

                rows_left = this.MAX_ROWS_PER_COLUMN_COUNT - group_data.num_visible - 1;
            }
            // same column below previous group
            else {
                group_data.col = prev_group.col;
                group_data.row = prev_group.row + prev_group.num_visible + 1;

                rows_left = rows_left - group_data.num_visible - 1;
            }

            filled_col_rows[group_data.col] += group_data.num_visible + 1;

            prev_group = group_data;

            data.push(group_data);
        }

        // cut height of window to longest column
        var rows_per_column_count = Math.max.apply(null, filled_col_rows);

        i = data.length;

        // expand last group of each column to fill empty space
        while (i--) {
            var col = data[i].col;
            var expand_rows = rows_per_column_count - filled_col_rows[col];
            data[i].num_visible += expand_rows;
            filled_col_rows[col] += expand_rows;
        }

        return data;
    };

    window.TownGroupsAnalyzer = TownGroupsAnalyzer;

    return window.TownGroupsAnalyzer;
});