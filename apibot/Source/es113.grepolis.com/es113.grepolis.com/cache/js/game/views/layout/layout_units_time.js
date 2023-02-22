/*global Backbone, GameEvents */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutUnitsTime = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.unit_time_to_arrival = this.controller.getModel('unit_time_to_arrival');
            this.l10n = this.controller.l10n;
            this.registerViewComponents();
        },

        registerViewComponents: function() {
            //@todo move it to the controller
            this.unit_time_to_arrival.onChangeWatching(function(model, watching) {
                if (!watching) {
                    this.$el.html(this.l10n.select_unit);
                }
            }, this);

            this.unit_time_to_arrival.onChangeTimeToArrival(function(model, time_to_arrival) {
                if (model.isWatching()) {
                    this.$el.html('~ ' + DateHelper.readableSeconds(time_to_arrival));
                }
            }, this);

            this.$el.html(this.l10n.select_unit);
        },

        destroy: function() {

        }
    });

    window.GameViews.LayoutUnitsTime = LayoutUnitsTime;
}());