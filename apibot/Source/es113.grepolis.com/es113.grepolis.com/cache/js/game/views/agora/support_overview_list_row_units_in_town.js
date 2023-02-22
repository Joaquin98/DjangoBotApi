/*global define, Backbone, GameData, MousePopup */

/**
 * View which represents single row in the support overview which
 * displays units in town
 */
(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var SupportOverviewListRowUnitsInTownView = BaseView.extend({
        //Subcontext for component manager
        sub_context: 'units_in_town',
        //List container element
        $list: null,
        //Single row element
        $el: null,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.$list = options.$list;
            this.l10n = this.controller.getl10n();

            this.render();
        },

        //Render list with total units
        render: function() {
            var controller = this.controller;

            this.$list.append((us.template(controller.getTemplate('list_units_in_town'), {
                l10n: this.l10n,
                model: controller.getUnitsInTown()
            })));

            this.$el = this.$list.find('.support_row_units_in_town');

            this.initializeComponents();

            return this;
        },

        initializeComponents: function() {
            var unit_id, units_in_town = this.controller.getUnitsInTown(),
                units = units_in_town.getUnits(),
                gd_units = GameData.units;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    this.$el.find('.unit_icon40x40.' + unit_id).tooltip(gd_units[unit_id].name);
                }
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.SupportOverviewListRowUnitsInTownView = SupportOverviewListRowUnitsInTownView;
}());