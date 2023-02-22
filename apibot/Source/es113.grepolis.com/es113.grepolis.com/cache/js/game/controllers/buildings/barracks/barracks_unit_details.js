/*global GameViews, Game, GameData, GameDataUnits, GeneralModifications, HumanMessage, GameEvents, Tracking, GameControllers, gpAjax */

(function() {
    'use strict';

    var BarracksUnitDetailsViewController = GameControllers.TabController.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            var selected_unit_id = this.getSelectedUnitId();

            this.view = new GameViews.BarracksUnitDetails({
                el: this.$el,
                controller: this
            }).render(selected_unit_id);

            this.registerEventListeners();

            return this;
        },

        reRender: function(unit_id) {
            this.view.reRender(unit_id);
        },

        registerEventListeners: function() {
            this.getCollection('remaining_unit_orders').onOrderCountChange(this, this.onUnitOrderCountChange.bind(this));
        },

        getUnitDetailsSubContextName: function() {
            return 'unit_details';
        },

        getBuildingType: function() {
            return this.parent_controller.getBuildingType();
        },

        getSelectedUnitId: function() {
            return this.parent_controller.getSelectedUnitId();
        },

        getBuildingLevel: function(building_id) {
            return this.getCollection('towns').getCurrentTown().getBuildings().getBuildingLevel(building_id);
        },

        getUnitDetails: function(unit_id) {
            var town_id = Game.townId,
                building_type = this.getBuildingType(),
                gd_unit = GameData.units[unit_id];

            var building_level = this.getBuildingLevel(building_type),
                //@todo this part should be changed to get data from the backend
                augmentation_bonus = this.getCollection('benefits').getAugmentationBonusForUnitBuildTime(),
                world_boost_bonus = this.getCollection('world_boosts').getWorldBoostFactorForUnitRecruitTime(gd_unit),
                time_bonus = GeneralModifications.getUnitBuildTimeModification(town_id, gd_unit.is_naval),
                resource_factor = GeneralModifications.getUnitBuildResourcesModification(town_id, gd_unit);

            return {
                id: unit_id,
                name: gd_unit.name,
                costs: {
                    wood: gd_unit.resources.wood * resource_factor,
                    iron: gd_unit.resources.iron * resource_factor,
                    stone: gd_unit.resources.stone * resource_factor,
                    favor: gd_unit.favor,
                    population: gd_unit.population,
                    build_time: GeneralModifications.getUnitBuildTime(unit_id, building_level, augmentation_bonus, time_bonus, world_boost_bonus)
                },
                speed: gd_unit.speed,
                attack_type: gd_unit.attack_type,
                attack: gd_unit.attack,
                def_distance: gd_unit.def_distance,
                def_hack: gd_unit.def_hack,
                def_pierce: gd_unit.def_pierce,
                booty: gd_unit.booty,
                defense: gd_unit.defense,
                capacity: gd_unit.capacity
            };
        },

        /**
         * Builds new units
         *
         * @param {Number} amount    amount of units you want to build
         * @param {Function} on_success_callback will be called, if the request to the server is done
         */
        buildUnits: function(amount, on_success_callback) {
            var building_type = this.getBuildingType();

            var unit_id = this.getSelectedUnitId(),
                controller = GameData.buildings[building_type].controller,
                action = 'build',
                params = {
                    unit_id: unit_id,
                    amount: amount
                };

            if (amount <= 0) {
                return HumanMessage.error(this.l10n.incorrect_number_of_units);
            }

            gpAjax.ajaxPost(controller, action, params, true, function(data) {
                if (typeof on_success_callback === 'function') {
                    on_success_callback();
                }

                $.Observer(GameEvents.command.build_unit).publish({
                    unit_id: unit_id
                });
            });

            return true;
        },

        onUnitOrderCountChange: function() {
            var max_unit_build = GameDataUnits.getMaxBuildForSingleUnit(this.getSelectedUnitId()),
                sub_context = this.getUnitDetailsSubContextName();

            this.getComponent('sl_order_units', sub_context).setMax(max_unit_build);
            this.getComponent('btn_max', sub_context).setCaption(max_unit_build).setDetails(max_unit_build);
        },

        onResearchesChange: function() {
            this.reRender(this.getSelectedUnitId());
        },

        onSelectUnitTabClick: function() {
            this.reRender(this.getSelectedUnitId());
        },

        destroy: function() {

        }
    });

    window.GameControllers.BarracksUnitDetailsViewController = BarracksUnitDetailsViewController;
}());