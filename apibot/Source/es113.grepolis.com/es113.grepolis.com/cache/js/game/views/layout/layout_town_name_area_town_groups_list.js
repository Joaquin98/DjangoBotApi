/*global us, Game, GameEvents, TownGroupsAnalyzer, DM */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var ALL_GROUP_ID = Game.constants.ui.town_group.all_group_id;

    var LayoutTownNameAreaTownGroupsList = BaseView.extend({
        ROW_HEIGHT: 22,
        ROW_WIDTH: 235,
        SUB_ROW_WIDTH: 230,

        $list: null,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = options.l10n;
            this.$parent = options.$parent;
        },

        bindTownListEvents: function() {
            this.unbindTownListEvents();

            var town_groups = this.controller.getTownGroupsCollection(),
                town_group_towns = this.controller.getTownGroupsTownsCollection(),
                towns = this.controller.getTownsCollection();

            var click_event = (Game.isiOs() ? 'tap' : 'click') + '.town_list';

            //Bind selecting town events
            this.$list.on(click_event, '.item', this._handleSelectingTownEvent.bind(this));

            //Bind toggle group events
            this.$list.on(click_event, '.toggle_group', this._handleToggleCollapseEvent.bind(this));

            //Bind removing town from group event
            this.$list.on(click_event, '.delete_town', this._handleRemovingTownFromListEvent.bind(this));

            //Bind selecting town group event
            this.$list.on(click_event, '.group_name .name', this._handleSelectingTownGroupEvent.bind(this));

            town_groups.onTownGroupCollapsedChange(this._handleTownGroupCollapsedEvent, this);
            town_groups.onTownGroupActiveChange(this.rerender, this);
            town_groups.on('add remove change', this.rerender, this);

            town_group_towns.on('add remove change', this.rerender, this);

            this.controller.getAttacksCollection().onEntriesChange(this, this.updateTownIcons);
            this.controller.getSupportsCollection().onEntriesChange(this, this.updateTownIcons);

            towns.onTownNameChange(this, function() {
                town_group_towns.sortTowns();
                this.rerender();
            }.bind(this));

            towns.onTownCountChange(this, function() {
                town_group_towns.reFetch(function() {
                    town_group_towns.sortTowns();
                    this.rerender();
                }.bind(this));
            }.bind(this));

            if (this.controller.isTownGroupsDragDropEnabled()) {
                $('#town_groups_list .item').draggable({
                    appendTo: 'body',
                    distance: 20,
                    helper: function() {
                        var $el = $(this);

                        if (!$el.hasClass('town_group_town')) {
                            return;
                        }

                        return $el.clone().css({
                            width: $el.width()
                        });
                    },
                    scope: 'town_group',
                    scaling: Game.ui_scale.normalize.factor
                });

                // drop
                $('#town_groups_list .group_towns').droppable({
                    drop: function(event, ui) {
                        var $group = $(this),
                            $item = ui.draggable,
                            destination_group_id = $group.data('groupid'),
                            origin_group_id = $item.data('groupid'),
                            town_id = $item.data('townid');

                        //All towns group can not be modified
                        if (destination_group_id !== ALL_GROUP_ID) {
                            //User can move towns only between different groups
                            if (destination_group_id !== origin_group_id) {
                                if (!town_group_towns.hasTown(destination_group_id, town_id)) {
                                    town_groups.getTownGroup(destination_group_id).addTown(town_id);
                                }
                            }
                        }
                    },
                    scope: 'town_group'
                });
            }
        },

        unbindTownListEvents: function() {
            var town_groups = this.controller.getTownGroupsCollection(),
                town_group_towns = this.controller.getTownGroupsTownsCollection();

            if (this.$list) {
                this.$list.off('.town_list');

                $('#town_groups_list .item').off('.draggable');
                $('#town_groups_list .group_towns').off('.draggable');
            }

            town_groups.off(null, null, this);
            town_group_towns.off(null, null, this);
        },

        bindEventListeners: function() {
            this.unbindEventListeners();

            $.Observer(GameEvents.itowns.town_groups.add).subscribe('town_groups_dropdown', function() {
                this.rerender();
            }.bind(this));

            $.Observer(GameEvents.itowns.town_groups.remove).subscribe('town_groups_dropdown', function() {
                this.rerender();
            }.bind(this));

            $.Observer(GameEvents.itowns.town_groups.set_active_group).subscribe('town_groups_dropdown', function() {
                this.rerender();
            }.bind(this));

            $.Observer(GameEvents.town.town_switch).subscribe('town_groups_dropdown', function() {
                this.rerender();
            }.bind(this));
        },

        unbindEventListeners: function() {
            $.Observer().unsubscribe('town_groups_dropdown');
        },

        createListNode: function() {
            this.$list = $('<div class="town_groups_list sandy-box" id="town_groups_list" />').appendTo('body');
        },

        render: function() {
            var controller = this.controller,
                l10n = this.l10n;

            this.$list.html(us.template(controller.getTemplate('town_groups_list'), {
                //active_group_id : controller.getActiveGroupId(),
                town_groups_collection: controller.getTownGroupsCollection(),
                town_groups_towns_collection: controller.getTownGroupsTownsCollection(),
                island_quests_collection: controller.getIslandQuestsCollection(),

                SINGLE_GROUP_MAX_ROWS_PER_SUB_GROUP: TownGroupsAnalyzer.prototype.SINGLE_GROUP_MAX_ROWS_PER_SUB_GROUP,

                l10n: {
                    no_results: l10n.no_results,
                    no_towns_in_group: l10n.no_towns_in_group
                }
            }));

            //Tooltips
            this.$list.find('.group_name .name').tooltip(this.l10n.town_group_tooltip);
            this.$list.find('.island_quest_icon').tooltip(this.l10n.new_island_quest);

            this.renderSupportAttackIcons();
            this.renderTownGroupRevoltConquestIcons();

            this.bindTownListEvents();
            this.bindEventListeners();

            this.organizeMenuInColumns();

            //Position list relatively to the ".town_groups_dropdown" container
            this.updateListPosition();
        },

        renderSupportAttackIcons: function() {
            var controller = this.controller,
                map_tooltips = DM.getl10n('map_tooltips'),
                attacks_col = controller.getAttacksCollection(),
                supports_col = controller.getSupportsCollection(),

                createAttackSupportTooltip = function(query, count_function, tooltip_function) {
                    if (!this.$list) {
                        return;
                    }
                    this.$list.find(query).each(function(idx, el) {
                        var $el = $(el),
                            town_id = $el.data('townid'),
                            incoming = count_function(town_id),
                            incoming_attacks = incoming !== undefined ? incoming.getIncoming() : 0;

                        if (incoming_attacks > 0) {
                            $el.removeClass('hidden').tooltip(tooltip_function(incoming_attacks));
                        } else if (!$el.hasClass('hidden')) {
                            $el.addClass('hidden');
                        }
                    });
                }.bind(this);

            createAttackSupportTooltip(
                '.attack_icon',
                attacks_col.getIncomingAttacksForTown.bind(attacks_col),
                map_tooltips.incoming_attacks
            );

            createAttackSupportTooltip(
                '.support_icon',
                supports_col.getIncomingSupportsForTown.bind(supports_col),
                map_tooltips.incoming_support
            );
        },

        renderTownGroupRevoltConquestIcons: function() {
            var CommandsHelper = require('helpers/commands'),
                Features = require('data/features'),
                town_group_icon_tooltips = require('translations/town_group_icons'),

                createTownGroupIconAndTooltip = function(icon_elm, town_ids, tooltip) {
                    if (!this.$list) {
                        return;
                    }
                    this.$list.find(icon_elm).each(function(idx, el) {
                        var $el = $(el),
                            town_id = $el.data('townid'),
                            has_icon = town_ids.indexOf(town_id) >= 0;

                        if (has_icon) {
                            $el.removeClass('hidden').tooltip(tooltip);
                        } else if (!$el.hasClass('hidden')) {
                            $el.addClass('hidden');
                        }
                    });
                }.bind(this);

            if (Features.isOldCommandVersion()) {
                createTownGroupIconAndTooltip(
                    '.conquest_icon',
                    CommandsHelper.getTownIdsForAllIncomingConquerors(),
                    town_group_icon_tooltips.conquerors
                );
            } else {
                createTownGroupIconAndTooltip(
                    '.revolt_arising_icon',
                    CommandsHelper.getTownIdsForAllRevoltsOfGivenType(true),
                    town_group_icon_tooltips.revolt_arising
                );

                createTownGroupIconAndTooltip(
                    '.revolt_running_icon',
                    CommandsHelper.getTownIdsForAllRevoltsOfGivenType(),
                    town_group_icon_tooltips.revolt_running
                );
            }
        },

        rerender: function() {
            //Don't do anything when list is closed
            if (!this.$list) {
                return;
            }

            this.render();
        },

        updateTownIcons: function() {
            this.renderSupportAttackIcons();
            this.renderTownGroupRevoltConquestIcons();
        },

        show: function() {
            if (this.$list) {
                return;
            }

            this.createListNode();
            this.render();
        },

        /**
         * Executed when town list is being hidden
         */
        hide: function() {
            this.unbindTownListEvents();
            this.unbindEventListeners();

            if (this.$list) {
                this.$list.remove();
            }

            this.$list = null;
        },

        /**
        col: 0
        id: -1
        num: 165
        num_visible: 13
        row: 0
        */
        organizeMenuInColumns: function() {
            var $list = this.$list,
                $group, $inner_column;
            var group, analized_data = this.controller.getTownGroupsAnalizedData(),
                i, l = analized_data.length,
                row_height = this.ROW_HEIGHT,
                row_width = this.ROW_WIDTH;

            //if group has subgroups means that there is only 1 group
            if (l === 1) {
                var sub_group, sub_groups_count;
                var sub_group_pos_top, sub_group_pos_left, sub_group_height, sub_group_width;

                group = analized_data[0];
                sub_groups_count = group.sub_groups.length;

                $group = $list.find('.town_group_' + group.id);

                $group.find('.group_towns').css({
                    height: group.num_visible * row_height
                });

                for (i = 0; i < sub_groups_count; i++) {
                    sub_group = group.sub_groups[i];

                    sub_group_pos_top = sub_group.row * row_height;
                    sub_group_pos_left = sub_group.col * this.SUB_ROW_WIDTH;
                    sub_group_height = sub_group.num * row_height;
                    sub_group_width = this.SUB_ROW_WIDTH;

                    $inner_column = $group.find('.inner_column_' + i);

                    $inner_column.css({
                        position: 'absolute',
                        top: sub_group_pos_top,
                        left: sub_group_pos_left,
                        width: sub_group_width
                    });
                }
            } else {
                var group_pos_top, group_pos_left, group_height, group_width;

                for (i = 0; i < l; i++) {
                    group = analized_data[i];

                    group_pos_top = group.row * row_height;
                    group_pos_left = group.col * row_width;
                    group_height = group.num_visible * row_height;
                    group_width = row_width;

                    $group = $list.find('.town_group_' + group.id);

                    $group.css({
                        position: 'absolute',
                        top: group_pos_top,
                        left: group_pos_left,
                        width: group_width
                    });

                    $group.find('.group_towns').css({
                        height: group_height
                    });
                }
            }

            $list.css(this.calculateListSize(analized_data));
        },

        updateColumnFlow: function() {
            //Don't do anything when list is closed
            if (!this.$list) {
                return;
            }

            this.organizeMenuInColumns();
            this.updateListPosition();
        },

        calculateListSize: function(analized_data) {
            var i, l = analized_data.length,
                group,
                rows_in_column = 0,
                nr_of_columns = 0;

            var sub_groups_count, sub_group;

            if (l === 1) {
                group = analized_data[0];
                sub_groups_count = group.sub_groups.length;

                nr_of_columns = Math.min(sub_groups_count, TownGroupsAnalyzer.prototype.SINGLE_GROUP_MAX_COL_COUNT);

                for (i = 0; i < sub_groups_count; i++) {
                    sub_group = group.sub_groups[i];
                }

                rows_in_column = group.num_visible + 1;
            } else {
                var col_nr, rows_in_column_temp = 0;

                for (i = 0; i < l; i++) {
                    group = analized_data[i];

                    if (col_nr !== group.col) {
                        col_nr = group.col;
                        rows_in_column_temp = 0;
                    }

                    nr_of_columns = Math.max(nr_of_columns, group.col);
                    rows_in_column_temp += group.num_visible + 1;

                    rows_in_column = Math.max(rows_in_column, rows_in_column_temp);
                }

                //+1 because we are counting from 0
                nr_of_columns++;
            }

            return {
                width: nr_of_columns * this.ROW_WIDTH,
                height: rows_in_column * this.ROW_HEIGHT
            };
        },

        updateListPosition: function() {
            this.$list.css(this.calculateListPosition());
        },

        /**
         * Determinates correct position of the town list
         *
         * @return {Object}
         */
        calculateListPosition: function() {
            var $list = this.$list,
                $cont = this.$parent.find('.town_groups_dropdown'),
                width = $cont.outerWidth(true),
                height = $cont.outerHeight(true),
                offset = $cont.offset();

            var list_width = $list.outerWidth(true),
                mod_left = -((list_width - width) / 2);

            return {
                left: offset.left * Game.ui_scale.normalize.factor + mod_left,
                top: offset.top * Game.ui_scale.normalize.factor + height + 1
            };
        },

        _handleTownGroupCollapsedEvent: function() {
            this.updateColumnFlow();
        },

        _handleSelectingTownGroupEvent: function(e) {
            var $item = $(e.currentTarget),
                group_id = $item.data('groupid');

            this.controller.handleSelectingTownGroupEvent(group_id);
        },

        _handleRemovingTownFromListEvent: function(e) {
            var $item = $(e.currentTarget),
                group_id = $item.data('groupid'),
                town_id = $item.data('townid');

            e.stopPropagation();

            this.controller.handleRemovingTownFromListEvent(group_id, town_id);
        },

        _handleToggleCollapseEvent: function(e) {
            var $item = $(e.currentTarget),
                group_id = $item.data('groupid');

            //Apply css class on the town group container to make it smaller
            this.$list.find('.town_group_' + group_id).toggleClass('collapsed');

            this.controller.handleToggleCollapseEvent(group_id);
        },

        _handleSelectingTownEvent: function(e) {
            var $item = $(e.currentTarget),
                group_id = $item.data('groupid'),
                town_id = $item.data('townid');

            this.controller.handleSelectingTownEvent(group_id, town_id);
        },

        destroy: function() {
            //This component is not being destroyed
        }
    });

    window.GameViews.LayoutTownNameAreaTownGroupsList = LayoutTownNameAreaTownGroupsList;
}());