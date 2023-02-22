/*global Backbone, GameData, MousePopup */

/**
 * View which represents single row in the support overview which
 * displays total amount of units
 */
(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var SupportOverviewListRowTotalUnitsView = BaseView.extend({
        //Subcontext for component manager
        sub_context: 'total_units',
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

            this.$list.append((us.template(controller.getTemplate('list_total_units'), {
                l10n: this.l10n,
                units: controller.getTotalAmountOfUnits(),
                mode: controller.getMode(),
                modes: controller.getModes()
            })));

            this.$el = this.$list.find('.support_row_total_units');

            this.initializeComponents();

            return this;
        },

        initializeComponents: function() {
            var unit_id, units = this.controller.getTotalAmountOfUnits(),
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

    window.GameViews.SupportOverviewListRowTotalUnitsView = SupportOverviewListRowTotalUnitsView;
}());