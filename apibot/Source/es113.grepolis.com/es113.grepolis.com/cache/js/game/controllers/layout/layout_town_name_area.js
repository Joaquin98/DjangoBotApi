/*global Game, Timestamp, us, HelperTown, GameViews, TownGroupsAnalyzer, GameControllers, MM */

(function() {
    'use strict';

    var ALL_GROUP_ID = Game.constants.ui.town_group.all_group_id,
        NO_GROUP_GROUP_ID = Game.constants.ui.town_group.no_group_group_id,
        TempleSizes = require('enums/temple_sizes'),
        Features = require('data/features');

    var LayoutTownNameAreaController = GameControllers.BaseController.extend({
        //Town name area view
        view: null,
        //Town groups list view
        town_groups_list_view: null,

        is_list_opened: false,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutTownNameArea({
                el: this.$el,
                controller: this
            });

            this.town_groups_list_view = new GameViews.LayoutTownNameAreaTownGroupsList({
                controller: this,
                l10n: this.getl10n(),
                $parent: this.$el
            });

            this.registerEventListeners();
            this.setTownName();

            return this;
        },

        registerEventListeners: function() {
            this.getTownsCollection().onTownCountChange(this, this.onTownCountChange);
            this.getTownsCollection().onTownRemoved(this, this.removeTownFromTownGroup);
            this.getTownGroupsTownsCollection().onRefetchFinished(this, this.updateArrowButtonStates);
            this.getPlayerModel().onCulturalPointsChange(this, this.view.renderCultureOverview.bind(this.view));
            this.getCollection('casted_alliance_powers').onPowerAddRemove(this, this.handleAlliancePowerAddRemove.bind(this));
            if (Features.isOlympusEndgameActive()) {
                this.getTempleCollection().onAllianceIdChange(this, this.handleTempleChangedOwner.bind(this));
            }

            this.listenTo(this.getTownGroupsCollection(), 'change', this.updateArrowButtonStates);
            this.listenTo(this.getTownGroupsTownsCollection(), 'add remove', this.updateArrowButtonStates);

            var current_town = this.getCollection('towns').getCurrentTown();

            current_town.onNameChange(this, this.setTownName.bind(this));
        },

        removeTownFromTownGroup: function(town) {
            var groups_with_this_town = this.getTownGroupsTownsCollection().getAllTownGroupsForTown(town.id);
            if (groups_with_this_town && groups_with_this_town.length > 0) {
                this.getTownGroupsTownsCollection().removeTownFromAllTownGroups(town.id);
            }
        },

        onTownCountChange: function() {
            this.updateArrowButtonStates();
            this.view.renderCultureOverview();
        },

        updateArrowButtonStates: function() {
            var btn_prev_town = this.getComponent('btn_prev_town'),
                btn_next_town = this.getComponent('btn_next_town');

            var are_buttons_disabled = this.isTownSwitchPossibleInCurrentGroup();

            btn_prev_town.toggleDisable(are_buttons_disabled);
            btn_next_town.toggleDisable(are_buttons_disabled);
        },

        isTownSwitchPossibleInCurrentGroup: function() {
            return this.getTownsCountForActiveGroup() <= 1 && this.isCurrentTownInActiveTownGroup();
        },

        getTownGroupsCount: function() {
            return this.getTownGroupsCollection().getTownGroupsCount();
        },

        getTownsCount: function() {
            return this.getCollection('towns').getTownsCount();
        },

        getTownsCountForActiveGroup: function() {
            var activeGroupId = this.getTownGroupsCollection().getActiveGroupId();
            return this.getTownGroupsTownsCollection().getTownsCount(activeGroupId);
        },

        isCurrentTownInActiveTownGroup: function() {
            var activeGroupId = this.getTownGroupsCollection().getActiveGroupId();
            return this.getTownGroupsTownsCollection().hasTown(activeGroupId, Game.townId);
        },

        toggleList: function() {
            this[this.is_list_opened ? 'hideList' : 'showList']();
        },

        showList: function() {
            this.town_groups_list_view.show();

            this.is_list_opened = true;
        },

        hideList: function() {
            this.town_groups_list_view.hide();

            this.is_list_opened = false;
        },

        isTownGroupsDragDropEnabled: function() {
            // on ipad the Curator / drag and drop feature breaks the main functionality of the Town List - no scrolling
            // it is disabled until proper solution is found to maybe do both
            if (Game.isiOs() || Game.isHybridApp()) {
                return false;
            }

            return this.getTownGroupsCount() > 1 && this.getModel('premium_features').hasCurator();
        },

        /**
         * Returns the lowest expire time for the casted spells
         *
         * @return {Integer}
         */
        getLowestExpireTime: function() {
            var casted_power, casted_powers = this.getCollection('casted_powers').getCastedPowers(),
                i, l = casted_powers.length,
                times = [],
                time_left;

            for (i = 0; i < l; i++) {
                casted_power = casted_powers[i];
                time_left = Math.max(0, casted_power.getEndAt() - Timestamp.now());

                if (time_left > 0) {
                    times.push(time_left);
                }
            }

            return times.length === 0 ? 0 : us.min(times);
        },

        /**
         * Returns casted powers
         *
         * @return {Array}
         */
        getCastedPowers: function() {
            return this.getCollection('casted_powers').getCastedPowers();
        },

        getCastedPowerById: function(real_power_id) {
            return this.getCollection('casted_powers').where({
                id: real_power_id
            })[0];
        },

        getCappedPowerProgresses: function() {
            return this.getCollection('capped_powers_progresses');
        },

        getCappedPowerProgressByPowerId: function(power_id) {
            var capped_powers = this.getCappedPowerProgresses();
            if (typeof capped_powers === 'undefined') {
                return false;
            }
            return capped_powers.getCappedPowerProgressesForPowerIdAndType(power_id, 'battlepoints');
        },

        getCastedAlliancePowersByOrigin: function(origin) {
            return this.getCollection('casted_alliance_powers').getCastedAlliancePowersByOrigin(origin).map(
                function(power) {
                    return {
                        power_id: power.getPowerId(),
                        configuration: power.getConfiguration()
                    };
                }
            );
        },

        /**
         * Changes town name depends on the data from ITowns
         */
        setTownName: function() {
            this.view.setTownName(this.getActiveTownName());
        },

        renameTown: function(town_name, _rn) {
            HelperTown.renameTown(town_name,
                function() {
                    //resizes town name area on success
                    this.setTownName();
                    HelperTown.updateBrowserWindowTitle();
                }.bind(this),
                function() {
                    //Restore town name if new town name did not pass rules on the backend
                    _rn.restore();
                }
            );
        },

        /**
         * Returns name of the current town
         *
         * @return {String}
         */
        getActiveTownName: function() {
            var current_town = this.getCollection('towns').getCurrentTown();
            return current_town.getName();
        },

        /**
         * Returns sorted town groups
         *
         * @return {Array}
         */
        getTownGroupsCollection: function() {
            return this.getCollection('town_groups');
        },

        getTownGroupsTownsCollection: function() {
            return this.getCollection('town_group_towns');
        },

        getIslandQuestsCollection: function() {
            return this.getCollection('island_quests');
        },

        getTownsCollection: function() {
            return this.getCollection('towns');
        },

        getTempleCollection: function() {
            return this.getCollection('temples');
        },

        getPlayerModel: function() {
            return MM.getModelByNameAndPlayerId('Player');
        },

        getAttacksCollection: function() {
            return this.getCollection('attacks');
        },

        getSupportsCollection: function() {
            return this.getCollection('supports');
        },

        /**
         * Analizes town groups and returns an array of objects with information where each group should be displayed,
         * how many towns should be visible etc.
         *
         * Object structure:
         * - col: 0
         * - id: -1
         * - num: 165
         * - num_visible: 13
         * - row: 0
         *
         * @return {Array}
         */
        getTownGroupsAnalizedData: function() {
            var town_groups_analyzer = new TownGroupsAnalyzer(
                this.getTownGroupsCollection(),
                this.getTownGroupsTownsCollection()
            );

            return town_groups_analyzer.getAnalyzedData();
        },

        /**
         * Function executed when user click on the remove town button
         * on the town list
         */
        handleRemovingTownFromListEvent: function(group_id, town_id) {
            var group_model = this.getCollection('town_groups').getTownGroup(group_id);

            group_model.removeTown(town_id);
        },

        /**
         * Function executed when user click on the toggle town button
         * on the town list
         */
        handleToggleCollapseEvent: function(group_id) {
            var town_groups = this.getCollection('town_groups'),
                group_model = town_groups.getTownGroup(group_id);

            if (group_id === ALL_GROUP_ID || group_id === NO_GROUP_GROUP_ID) {
                $.cookie('town_group_toggle_' + group_id, group_model.isCollapsed() ? 0 : 1, {
                    expires: 9999999
                });
                town_groups.triggerCollapsedChange(!group_model.isCollapsed());
            } else {
                group_model.toggleCollapsed();
            }
        },

        /**
         * Function executed when user clicks on the town
         */
        handleSelectingTownEvent: function(group_id, town_id) {
            //When user clicks on the 'no towns' item
            if (group_id === undefined || town_id === undefined) {
                return;
            }

            //Switch town
            HelperTown.townSwitch(town_id);

            this.activateTownGroup(group_id, 'select_town');
            this.hideList();
        },

        /**
         * Function executed when user clicks on the town list to select
         * some town group
         */
        handleSelectingTownGroupEvent: function(group_id) {
            this.activateTownGroup(group_id, 'select_town_group');
        },

        activateTownGroup: function(group_id, action_type) {
            var town_groups = this.getCollection('town_groups'),
                group_model = town_groups.getTownGroup(group_id);

            var active_group_id = town_groups.getActiveGroupId();

            if (active_group_id === group_id) {
                return;
            }

            if (group_id === NO_GROUP_GROUP_ID) {
                group_model.setInactive(this.onGroupChanged);
            } else if (action_type === 'select_town_group') {
                group_model.setActive(this.onGroupChanged);
            } else if (action_type === 'select_town') {
                group_model.setActive(this.onGroupChanged);
            }
        },

        handleAlliancePowerAddRemove: function(model) {
            this.view.renderCastedAlliancePowers(this.$el.find('.casted_powers_area .list'), model.getOrigin());
        },

        handleTempleChangedOwner: function(model) {
            this.view.renderCastedAlliancePowers(this.$el.find('.casted_powers_area .list'), model.getTempleSize());
        },

        onGroupChanged: function() {

        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutTownNameAreaController = LayoutTownNameAreaController;
}());