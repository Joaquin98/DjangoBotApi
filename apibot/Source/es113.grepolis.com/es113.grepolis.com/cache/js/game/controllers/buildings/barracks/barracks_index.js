/*globals Game, GameData, GameControllers, ITowns, GameDataUnits */

(function() {
    'use strict';

    var BarracksController = GameControllers.TabController.extend({
        selected_unit_id: null,

        initialize: function() {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        /**
         * Render page
         *
         * @returns {*}
         */
        renderPage: function() {
            this.recalculateSelectedUnitId();

            //Initialize main view controller
            var main_view_controller = this.registerController('main_view_controller', new GameControllers.BarracksMainViewController({
                el: this.$el,
                parent_controller: this
            }));
            main_view_controller.renderPage();

            //Update widow title
            this.updateWindowTitle();

            return this;
        },

        /**
         * Recalculates which unit should be selected in the tabs
         */
        recalculateSelectedUnitId: function() {
            this.selected_unit_id = this.getUnits()[0].id;
        },

        /**
         * Returns id of the currently selected unit
         *
         * @return {String}
         */
        getSelectedUnitId: function() {
            return this.selected_unit_id;
        },

        /**
         * Sets currently selected unit
         *
         * @param {String} unit_id
         */
        setSelectedUnitId: function(unit_id) {
            this.selected_unit_id = unit_id;
        },

        getUnits: function() {
            var building_type = this.getBuildingType(),
                itown = ITowns.getTown(Game.townId),
                iunits = itown.units(),
                support_units = itown.unitsSupport(),
                outer_units = itown.unitsOuter(),
                unit_id, gd_unit, gd_units = GameData.units,
                god_id = itown.god(),
                returned_units = [],
                unit_cost,
                units_max_build = GameDataUnits.getMaxBuild(gd_units);

            for (unit_id in gd_units) {
                if (gd_units.hasOwnProperty(unit_id)) {
                    gd_unit = gd_units[unit_id];

                    //Check if unit can be displayed for this type of building
                    if (unit_id !== 'militia') {
                        if ((building_type === 'barracks' && !gd_unit.is_naval) || (building_type === 'docks' && gd_unit.is_naval)) {
                            //Check if god is the same as in town
                            if ((god_id && gd_unit.god_id === 'all') || (god_id && gd_unit.god_id === god_id) || !gd_unit.god_id) {
                                unit_cost = gd_unit.resources;

                                returned_units.push({
                                    id: unit_id,
                                    count: iunits[unit_id] || 0,
                                    outer: outer_units[unit_id] || 0,
                                    support: support_units[unit_id] || 0,
                                    max_build: units_max_build[unit_id],
                                    has_dependencies: GameDataUnits.hasDependencies(unit_id)
                                });
                            }
                        }
                    }
                }
            }

            return returned_units;
        },

        /**
         * Returns building type, either 'barracks' or 'docks', because this controller handles both windows
         *
         * @return {String}
         */
        getBuildingType: function() {
            return this.getPreloadedData().building_type;
        },

        /**
         * Change window title
         */
        updateWindowTitle: function() {
            var l10n = this.getl10n(),
                building_type = this.getController('main_view_controller').getBuildingType();

            this.setWindowTitle(l10n.wnd_title + ' - ' + GameData.buildings[building_type].name + ' (' + Game.townName + ')');
        },

        onTownSwitch: function() {
            this.recalculateSelectedUnitId();
        },

        destroy: function() {

        }
    });

    window.GameControllers.BarracksController = BarracksController;
}());