/*global Backbone */

(function() {
    "use strict";

    var SenateBuildingView = Backbone.View.extend({
        className: 'building',

        events: {

        },

        initialize: function() {
            this.template = this.options.template;
            this.l10n = this.options.l10n;
        },

        render: function() {
            var $el = this.$el,
                model = this.model,
                building_id = model.getId();

            $el.html(us.template(this.template, {
                model: model,
                l10n: this.l10n
            }));

            if (!$el.hasClass(building_id)) {
                $el.addClass(building_id);
            }

            return this;
        }
    });

    window.GameViews.SenateBuildingView = SenateBuildingView;
}());