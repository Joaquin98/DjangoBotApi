(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;
    var Features = require('data/features');

    var LayoutBattlepoints = {

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.$points = this.$el.find('.points');

            this.render();
        },

        render: function() {
            var points = this.controller.getBattlepoints(),
                tooltip = Features.battlepointVillagesEnabled() ?
                this.controller.getl10n().battlepoints.bpv_tooltip :
                this.controller.getl10n().battlepoints.non_bpv_tooltip;

            this.$points.text(points);
            this.$el.tooltip(tooltip);
        },

        destroy: function() {

        }
    };

    window.GameViews.LayoutBattlepoints = BaseView.extend(LayoutBattlepoints);
}());